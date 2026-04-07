import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';

// ---- Types ----
export interface Contact {
  id: string;
  user_id: string;
  phone_number: string;
  name: string | null;
  profile_name: string | null;
  created_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  contact_id: string;
  last_message: string | null;
  last_message_at: string | null;
  unread_count: number;
  created_at: string;
  contact?: Contact;
}

export interface DashMessage {
  id: string;
  user_id: string;
  conversation_id: string;
  wa_message_id: string | null;
  direction: 'inbound' | 'outbound';
  content: string;
  message_type: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  delivered_at: string | null;
  seen_at: string | null;
  created_at: string;
}

// ---- Store Shape ----
interface DashStore {
  // Conversations
  conversations: Conversation[];
  activeConversationId: string | null;
  loadingConversations: boolean;

  // Messages for active conversation
  messages: DashMessage[];
  loadingMessages: boolean;

  // Search
  searchQuery: string;

  // Actions
  setSearchQuery: (q: string) => void;
  setActiveConversation: (id: string | null) => void;
  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  sendMessage: (to: string, message: string, conversationId: string) => Promise<void>;
  markConversationRead: (conversationId: string) => Promise<void>;

  // Realtime handlers
  handleMessageInsert: (msg: DashMessage) => void;
  handleMessageUpdate: (msg: DashMessage) => void;
  handleConversationUpdate: (conv: Conversation) => void;
}

export const useDashStore = create<DashStore>((set, get) => ({
  conversations: [],
  activeConversationId: null,
  loadingConversations: false,
  messages: [],
  loadingMessages: false,
  searchQuery: '',

  setSearchQuery: (q) => set({ searchQuery: q }),

  setActiveConversation: (id) => {
    set({ activeConversationId: id, messages: [] });
    if (id) {
      get().fetchMessages(id);
      get().markConversationRead(id);
    }
  },

  fetchConversations: async () => {
    set({ loadingConversations: true });
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          contact:contacts(*)
        `)
        .order('last_message_at', { ascending: false });

      if (error) throw error;
      set({ conversations: (data as Conversation[]) || [] });
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
    } finally {
      set({ loadingConversations: false });
    }
  },

  fetchMessages: async (conversationId) => {
    set({ loadingMessages: true });
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      set({ messages: (data as DashMessage[]) || [] });
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      set({ loadingMessages: false });
    }
  },

  sendMessage: async (to, message, conversationId) => {
    try {
      const res = await fetch('/api/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, message, conversationId }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to send');
      }

      // Message will appear via realtime subscription
    } catch (err) {
      console.error('Send message error:', err);
      throw err;
    }
  },

  markConversationRead: async (conversationId) => {
    try {
      const supabase = createClient();
      await supabase
        .from('conversations')
        .update({ unread_count: 0 })
        .eq('id', conversationId);

      set((state) => ({
        conversations: state.conversations.map((c) =>
          c.id === conversationId ? { ...c, unread_count: 0 } : c
        ),
      }));
    } catch (err) {
      console.error('Failed to mark read:', err);
    }
  },

  // Realtime: new message inserted
  handleMessageInsert: (msg) => {
    const { activeConversationId } = get();
    if (msg.conversation_id === activeConversationId) {
      set((state) => ({
        messages: [...state.messages, msg],
      }));
    }

    // Update conversation list
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === msg.conversation_id
          ? {
              ...c,
              last_message: msg.content,
              last_message_at: msg.created_at,
              unread_count:
                msg.direction === 'inbound' && c.id !== activeConversationId
                  ? (c.unread_count || 0) + 1
                  : c.unread_count,
            }
          : c
      ).sort((a, b) => {
        const aTime = a.last_message_at ? new Date(a.last_message_at).getTime() : 0;
        const bTime = b.last_message_at ? new Date(b.last_message_at).getTime() : 0;
        return bTime - aTime;
      }),
    }));
  },

  // Realtime: message status updated
  handleMessageUpdate: (msg) => {
    const { activeConversationId } = get();
    if (msg.conversation_id === activeConversationId) {
      set((state) => ({
        messages: state.messages.map((m) =>
          m.id === msg.id ? { ...m, ...msg } : m
        ),
      }));
    }
  },

  // Realtime: conversation changed
  handleConversationUpdate: (conv) => {
    set((state) => {
      const exists = state.conversations.find((c) => c.id === conv.id);
      if (exists) {
        return {
          conversations: state.conversations
            .map((c) => (c.id === conv.id ? { ...c, ...conv } : c))
            .sort((a, b) => {
              const aTime = a.last_message_at ? new Date(a.last_message_at).getTime() : 0;
              const bTime = b.last_message_at ? new Date(b.last_message_at).getTime() : 0;
              return bTime - aTime;
            }),
        };
      }
      // New conversation — refetch to get the contact join
      get().fetchConversations();
      return state;
    });
  },
}));
