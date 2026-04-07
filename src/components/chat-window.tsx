import React, { useState, useCallback, useEffect, useMemo } from 'react';
import type { Chat, Message, User } from '../types';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ContactInfoDrawer from './ContactInfoDrawer';
import { messages as initialMessages } from '../data/messages';

interface ChatWindowProps {
  activeChat: Chat | null;
  onBack?: () => void;
  theme: 'light' | 'dark';
  onStartCall: (type: 'audio' | 'video', user: User) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ activeChat, onBack, theme, onStartCall }) => {
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [infoDrawerOpen, setInfoDrawerOpen] = useState(false);

  // Reset search when switching chats
  useEffect(() => {
    setSearchQuery('');
    setIsTyping(false);
    setInfoDrawerOpen(false);
  }, [activeChat?.id]);

  const handleSend = useCallback(
    (text: string) => {
      if (!activeChat) return;
      const newMsg: Message = {
        id: `msg_${Date.now()}`,
        chatId: activeChat.id,
        content: text,
        timestamp: new Date().toISOString(),
        senderId: 'me',
        status: 'sent',
        type: 'text',
      };
      setMessagesMap((prev) => ({
        ...prev,
        [activeChat.id]: [...(prev[activeChat.id] ?? []), newMsg],
      }));

      // Simulate typing response
      setIsTyping(true);
      const timeout = setTimeout(() => setIsTyping(false), 2000);
      return () => clearTimeout(timeout);
    },
    [activeChat]
  );

  const toggleInfoDrawer = () => setInfoDrawerOpen(!infoDrawerOpen);

  const chatMessages = useMemo(() => messagesMap[activeChat?.id || ''] ?? [], [messagesMap, activeChat?.id]);
  
  const matchCount = useMemo(() => 
    searchQuery.trim() 
      ? chatMessages.filter(m => m.content.toLowerCase().includes(searchQuery.toLowerCase())).length 
      : 0,
    [chatMessages, searchQuery]
  );

  if (!activeChat) return null; // Hero is rendered by parent

  return (
    <div className="flex-1 flex h-full overflow-hidden">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-[400px]">
        <ChatHeader
          chat={activeChat}
          onBack={onBack}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onToggleInfo={toggleInfoDrawer}
          onStartCall={(type) => onStartCall(type, activeChat.participant)}
          matchCount={matchCount}
        />
        <MessageList
          messages={chatMessages}
          currentUserId="me"
          isTyping={isTyping}
          highlightQuery={searchQuery}
          isGroup={activeChat.isGroup}
        />
        <MessageInput onSend={handleSend} theme={theme} />
      </div>

      {/* Info Drawer */}
      {infoDrawerOpen && (
        <ContactInfoDrawer
          chat={activeChat}
          onClose={() => setInfoDrawerOpen(false)}
        />
      )}
    </div>
  );
};

export default ChatWindow;
