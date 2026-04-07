import React, { useState, useMemo } from 'react';
import { Search, MoreVertical, Archive, Pin, Plus, Filter } from 'lucide-react';
import ChatContextMenu from './ChatContextMenu';
import type { Chat, ChatFilter } from '../types';

interface SidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (chatId: string) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenSettings?: () => void;
  onChatAction: (chatId: string, action: any) => void;
}

const FILTERS: { id: ChatFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
  { id: 'favourites', label: 'Favourites' },
  { id: 'groups', label: 'Groups' },
];

const Sidebar: React.FC<SidebarProps> = ({
  chats,
  activeChatId,
  onSelectChat,
  searchQuery,
  onSearchChange,
  onOpenSettings,
  onChatAction,
}) => {
  const [activeFilter, setActiveFilter] = useState<ChatFilter>('all');
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, chat: Chat } | null>(null);

  const handleContextMenu = (e: React.MouseEvent, chat: Chat) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, chat });
  };

  const { activeChats, archivedChats } = useMemo(() => {
    return {
      activeChats: chats.filter((c) => !c.isArchived),
      archivedChats: chats.filter((c) => c.isArchived)
    };
  }, [chats]);

  const visibleChats = useMemo(() => {
    let filtered = activeChats;
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (c) =>
          c.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (activeFilter === 'unread') filtered = filtered.filter((c) => (c.unreadCount || 0) > 0);
    if (activeFilter === 'favourites') filtered = filtered.filter((c) => c.isStarred);
    if (activeFilter === 'groups') filtered = filtered.filter((c) => c.isGroup);
    return filtered;
  }, [activeChats, searchQuery, activeFilter]);

  const { pinnedChats, unpinnedChats } = useMemo(() => ({
    pinnedChats: visibleChats.filter((c) => c.isPinned),
    unpinnedChats: visibleChats.filter((c) => !c.isPinned),
  }), [visibleChats]);

  return (
    <aside className="flex-1 h-full flex flex-col bg-[var(--bg-primary)] overflow-hidden">
      {/* Header */}
      <header className="h-[60px] flex items-center justify-between px-4 shrink-0">
        <h1 className="text-[var(--text-primary)] font-bold text-[22px] tracking-tight">Chats</h1>
        <div className="flex items-center gap-1">
          <IconBtn onClick={() => {}} title="New chat" icon={<Plus size={20} className="border border-[var(--text-secondary)]/30 rounded-md p-0.5" />} />
          <IconBtn onClick={onOpenSettings || (() => {})} title="Menu" icon={<MoreVertical size={20} />} />
        </div>
      </header>

      {/* Search & Filter Button */}
      <div className="px-3 py-2 shrink-0 flex items-center gap-2">
        <div className="flex-1 flex items-center gap-4 bg-[var(--bg-secondary)] rounded-lg px-4 py-1.5 focus-within:ring-0">
          <Search size={18} className="text-[var(--text-secondary)]" />
          <input
            type="text"
            placeholder="Search or start a new chat"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-[15px] text-[var(--text-primary)] placeholder-[var(--text-secondary)] py-0.5 "
          />
        </div>
        <button className="p-1.5 text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] rounded-md transition-colors">
          <Filter size={18} />
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 px-3 pt-2 pb-3 overflow-x-auto no-scrollbar shrink-0 border-b border-[var(--bg-hover)]/30">
        {FILTERS.map((f) => {
          const isActive = activeFilter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-3 py-1 rounded-full text-[13px] transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                isActive 
                  ? 'bg-[var(--wa-green)] text-[var(--bg-primary)] font-semibold' 
                  : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
              }`}
            >
              {f.label}
              {f.id === 'unread' && (
                <span className={`text-[11px] px-1 rounded-full ${isActive ? 'bg-[var(--bg-primary)] text-[var(--wa-green)]' : 'bg-[var(--wa-green)] text-[var(--bg-primary)]'}`}>
                  1
                </span>
              )}
            </button>
          );
        })}
        <button className="p-1 px-2 rounded-full bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]">
          <Plus size={16} />
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {archivedChats.length > 0 && (
          <div className="flex items-center gap-4 px-4 py-4 cursor-pointer hover:bg-[var(--bg-hover)] transition-colors border-b border-[var(--bg-hover)]/20">
            <Archive size={20} className="text-[var(--wa-green)]" />
            <span className="flex-1 text-[15px] text-[var(--text-primary)]">Archived</span>
            <span className="text-[12px] text-[var(--wa-green)] font-semibold">3</span>
          </div>
        )}

        <div className="flex flex-col">
          {pinnedChats.map(chat => (
            <ChatItem key={chat.id} chat={chat} isActive={chat.id === activeChatId} onClick={() => onSelectChat(chat.id)} onContextMenu={(e) => handleContextMenu(e, chat)} />
          ))}
          {unpinnedChats.map(chat => (
            <ChatItem key={chat.id} chat={chat} isActive={chat.id === activeChatId} onClick={() => onSelectChat(chat.id)} onContextMenu={(e) => handleContextMenu(e, chat)} />
          ))}
        </div>
      </div>

      {contextMenu && (
        <ChatContextMenu x={contextMenu.x} y={contextMenu.y} chat={contextMenu.chat} onClose={() => setContextMenu(null)} onAction={onChatAction} />
      )}
    </aside>
  );
};

const IconBtn: React.FC<{ onClick: () => void; title: string; icon: React.ReactNode }> = ({ onClick, title, icon }) => (
  <button onClick={onClick} title={title} className="p-2 rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors flex items-center justify-center">
    {icon}
  </button>
);

const ChatItem = React.memo(({ chat, isActive, onClick, onContextMenu }: { chat: Chat; isActive: boolean; onClick: () => void; onContextMenu: (e: React.MouseEvent) => void }) => {
  const { participant, lastMessage, lastMessageTime, unreadCount, isMuted, isPinned } = chat;

  return (
    <div
      onClick={onClick}
      onContextMenu={onContextMenu}
      className={`flex items-center gap-3 px-3 py-[12px] cursor-pointer transition-colors border-b border-[var(--bg-hover)]/20 ${
        isActive ? 'bg-[var(--bg-active)]' : 'hover:bg-[var(--bg-hover)]'
      }`}
    >
      <div className="relative shrink-0 ml-1">
        <div className="w-[49px] h-[49px] rounded-full overflow-hidden bg-[var(--bg-secondary)] flex items-center justify-center">
          {participant.avatar && participant.avatar.startsWith('/') ? (
            <img src={participant.avatar} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className={`w-full h-full flex items-center justify-center text-[var(--bg-secondary)] font-bold text-lg`} style={{ backgroundColor: participant.avatarColor || '#6a7c85' }}>
                {participant.name.split(' ').map(n => n[0]).join('')}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 min-w-0 pr-1">
        <div className="flex justify-between items-center mb-0.5">
          <span className="text-[17px] text-[var(--text-primary)] font-normal truncate">{participant.name}</span>
          <span className={`text-[12px] shrink-0 ${unreadCount ? 'text-[var(--wa-green)] font-medium' : 'text-[var(--text-secondary)]'}`}>{lastMessageTime}</span>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1 overflow-hidden">
            {unreadCount === 0 && participant.name.includes('Gautam') && <span className="text-[var(--wa-blue)] text-base">✓✓ </span>}
            <span className="text-[14px] text-[var(--text-secondary)] truncate leading-5">
              {isMuted && '🔇 '}
              {lastMessage}
            </span>
          </div>
          <div className="flex items-center gap-1.5 ml-2 shrink-0">
            {isPinned && <Pin size={16} className="text-[var(--text-secondary)] rotate-45" />}
            {unreadCount > 0 && (
              <div className="min-w-[20px] h-5 rounded-full bg-[var(--wa-green)] text-[var(--bg-primary)] text-[12px] font-bold flex items-center justify-center px-1.5">
                {unreadCount}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

ChatItem.displayName = 'ChatItem';

export default Sidebar;
