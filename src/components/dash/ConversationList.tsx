'use client';

import React from 'react';
import { useDashStore } from '@/lib/store';
import type { Conversation } from '@/lib/store';
import { Search, Filter, Settings, LogOut } from 'lucide-react';
import { formatRelativeTime, getInitials, generateAvatarColor, truncate } from '@/lib/utils';
import Link from 'next/link';

export default function DashConversationList() {
  const {
    conversations,
    activeConversationId,
    setActiveConversation,
    searchQuery,
    setSearchQuery,
    loadingConversations,
  } = useDashStore();

  const filtered = conversations.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const name = c.contact?.name?.toLowerCase() || '';
    const phone = c.contact?.phone_number?.toLowerCase() || '';
    const msg = c.last_message?.toLowerCase() || '';
    return name.includes(q) || phone.includes(q) || msg.includes(q);
  });

  return (
    <div className="flex flex-col h-full bg-[#111b21]">
      {/* Header */}
      <div className="h-[60px] px-4 flex items-center justify-between shrink-0 border-b border-[#2a3942]/30">
        <h2 className="text-[20px] font-semibold text-[#e9edef]">Chats</h2>
        <div className="flex items-center gap-2">
          <Link href="/settings" className="md:hidden p-2 rounded-lg text-[#8696a0] hover:bg-[#2a3942] hover:text-[#e9edef] transition-colors">
            <Settings size={18} />
          </Link>
          <button 
            onClick={async () => {
              const { createClient } = await import('@/lib/supabase/client');
              const supabase = createClient();
              await supabase.auth.signOut();
              window.location.href = '/login';
            }}
            className="md:hidden p-2 rounded-lg text-[#8696a0] hover:bg-[#2a3942] hover:text-[#e9edef] transition-colors"
          >
            <LogOut size={18} />
          </button>
          <button className="p-2 rounded-lg text-[#8696a0] hover:bg-[#2a3942] hover:text-[#e9edef] transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 py-2 shrink-0">
        <div className="bg-[#202c33] rounded-lg px-3 py-2 flex items-center gap-3">
          <Search size={16} className="text-[#8696a0] shrink-0" />
          <input
            type="text"
            placeholder="Search or start new chat"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-[14px] text-[#e9edef] placeholder:text-[#8696a0]/60"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {loadingConversations ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#00a884] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#8696a0]">
            <p className="text-sm">No conversations yet</p>
            <p className="text-xs mt-1 opacity-60">Messages from customers will appear here</p>
          </div>
        ) : (
          filtered.map((conv) => (
            <ConversationRow
              key={conv.id}
              conversation={conv}
              isActive={conv.id === activeConversationId}
              onClick={() => setActiveConversation(conv.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

// ---- Conversation Row ----
function ConversationRow({
  conversation,
  isActive,
  onClick,
}: {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}) {
  const contact = conversation.contact;
  const name = contact?.name || contact?.phone_number || 'Unknown';
  const phone = contact?.phone_number || '';
  const initials = getInitials(name);
  const color = generateAvatarColor(name);
  const lastMsg = conversation.last_message || '';
  const timeStr = conversation.last_message_at
    ? formatRelativeTime(conversation.last_message_at)
    : '';
  const unread = conversation.unread_count || 0;

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-3 cursor-pointer transition-colors ${
        isActive ? 'bg-[#2a3942]' : 'hover:bg-[#202c33]'
      }`}
    >
      {/* Avatar */}
      <div
        className="w-[50px] h-[50px] rounded-full flex items-center justify-center text-white text-[18px] font-semibold shrink-0"
        style={{ backgroundColor: color }}
      >
        {initials}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 border-b border-[#2a3942]/30 pb-3">
        <div className="flex items-center justify-between">
          <span className="text-[16px] text-[#e9edef] font-normal truncate">
            {name}
          </span>
          <span
            className={`text-[12px] shrink-0 ml-2 ${
              unread > 0 ? 'text-[#00a884]' : 'text-[#8696a0]'
            }`}
          >
            {timeStr}
          </span>
        </div>
        <div className="flex items-center justify-between mt-0.5">
          <span className="text-[13px] text-[#8696a0] truncate">
            {truncate(lastMsg, 45)}
          </span>
          {unread > 0 && (
            <span className="ml-2 shrink-0 bg-[#00a884] text-[#111b21] text-[11px] font-bold rounded-full min-w-[20px] h-[20px] flex items-center justify-center px-1.5">
              {unread}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
