'use client';

import React, { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useDashStore } from '@/lib/store';
import DashConversationList from '@/components/dash/ConversationList';
import DashChatWindow from '@/components/dash/ChatWindow'; // force TS recheck
import { MessageCircle, Settings, LogOut, Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  const {
    activeConversationId,
    fetchConversations,
    handleMessageInsert,
    handleMessageUpdate,
    handleConversationUpdate,
  } = useDashStore();

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Setup Supabase realtime subscriptions
  useEffect(() => {
    const channel = supabase
      .channel('dashboard-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          handleMessageInsert(payload.new as any);
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'messages' },
        (payload) => {
          handleMessageUpdate(payload.new as any);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'conversations' },
        (payload) => {
          handleConversationUpdate(payload.new as any);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, handleMessageInsert, handleMessageUpdate, handleConversationUpdate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#111b21]">
      {/* Left Nav Rail */}
      <div className="w-[68px] bg-[#202c33] flex flex-col items-center py-4 shrink-0 border-r border-[#2a3942]/50">
        <div className="w-10 h-10 bg-[#00a884] rounded-xl flex items-center justify-center mb-8 shadow-lg shadow-[#00a884]/20">
          <MessageCircle size={20} className="text-white" />
        </div>

        <div className="flex-1 flex flex-col items-center gap-2">
          <NavIcon icon={<MessageCircle size={20} />} active tooltip="Chats" />
        </div>

        <div className="flex flex-col items-center gap-2 mt-auto">
          <Link href="/settings">
            <NavIcon icon={<Settings size={20} />} tooltip="Settings" />
          </Link>
          <button onClick={handleLogout}>
            <NavIcon icon={<LogOut size={20} />} tooltip="Logout" />
          </button>
        </div>
      </div>

      {/* Conversation List Panel */}
      <div className="w-[380px] h-full border-r border-[#2a3942]/50 flex flex-col shrink-0">
        <DashConversationList />
      </div>

      {/* Chat Window */}
      <div className="flex-1 h-full flex flex-col min-w-0">
        {activeConversationId ? (
          <DashChatWindow />
        ) : (
          <DashHero />
        )}
      </div>
    </div>
  );
}

// ---- Nav Icon component ----
function NavIcon({
  icon,
  active,
  tooltip,
}: {
  icon: React.ReactNode;
  active?: boolean;
  tooltip?: string;
}) {
  return (
    <div
      title={tooltip}
      className={`w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all ${
        active
          ? 'bg-[#00a884]/20 text-[#00a884]'
          : 'text-[#8696a0] hover:bg-[#2a3942] hover:text-[#e9edef]'
      }`}
    >
      {icon}
    </div>
  );
}

// ---- Empty State Hero ----
function DashHero() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#0b141a] relative overflow-hidden">
      <div className="max-w-[480px] w-full flex flex-col items-center text-center px-8">
        <div className="w-[280px] h-[160px] mb-10 opacity-[0.07] flex items-center justify-center">
          <div className="relative w-full h-full border-[3px] border-[#e9edef] rounded-2xl flex items-center justify-center">
            <div className="w-20 h-20 rounded-full border-2 border-[#e9edef] flex items-center justify-center">
              <MessageCircle size={36} className="text-[#e9edef]" />
            </div>
          </div>
        </div>

        <h1 className="text-[32px] font-light text-[#e9edef] mb-3 tracking-tight">
          WhatsDash for Business
        </h1>
        <p className="text-[14px] text-[#8696a0] leading-relaxed mb-8 max-w-[380px]">
          Send and receive messages from your customers. Select a conversation or start a new one.
        </p>

        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 bg-[#00a884] text-[#111b21] px-6 py-2.5 rounded-full font-semibold text-[14px] hover:brightness-110 transition-all shadow-lg shadow-[#00a884]/20 active:scale-95">
            <Plus size={18} /> New Conversation
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 flex items-center gap-1.5 text-[#8696a0] text-[12px] opacity-40">
        <span>🔒 End-to-end encrypted via WhatsApp</span>
      </div>
    </div>
  );
}
