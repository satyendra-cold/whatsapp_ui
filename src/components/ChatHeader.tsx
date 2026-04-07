import React, { useState } from 'react';
import { Video, Phone, Search, MoreVertical, ArrowLeft, X } from 'lucide-react';
import type { Chat } from '../types';

interface ChatHeaderProps {
  chat: Chat;
  onBack?: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onToggleInfo?: () => void;
  onStartCall?: (type: 'audio' | 'video') => void;
  matchCount?: number;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ chat, onBack, searchQuery, onSearchChange, onToggleInfo, onStartCall, matchCount }) => {
  const { participant } = chat;
  const [searchOpen, setSearchOpen] = useState(false);

  const openSearch = () => setSearchOpen(true);
  const closeSearch = () => {
    setSearchOpen(false);
    onSearchChange('');
  };

  return (
    <header className="h-[60px] flex items-center px-4 gap-3 bg-[var(--bg-secondary)] border-b border-[var(--bg-hover)]/20 shrink-0 z-10">
      {/* Back button (mobile) */}
      {onBack && !searchOpen && (
        <button onClick={onBack} className="p-1 text-[var(--text-secondary)] md:hidden">
          <ArrowLeft size={20} />
        </button>
      )}

      {searchOpen ? (
        <div className="flex-1 flex items-center gap-3 bg-[var(--bg-input)] rounded-lg px-3 py-1.5 animate-fade-in mx-2">
          <Search size={16} className="text-[var(--text-secondary)]" />
          <input
            autoFocus
            type="text"
            placeholder="Search in chat..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-[15px] text-[var(--text-primary)] placeholder-[var(--text-secondary)]"
          />
          {searchQuery && (
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-[var(--text-secondary)] whitespace-nowrap">{matchCount} matches</span>
              <button onClick={() => onSearchChange('')} className="text-[var(--text-secondary)]"><X size={15} /></button>
            </div>
          )}
          <button onClick={closeSearch} className="text-[var(--text-secondary)] ml-1"><X size={20} /></button>
        </div>
      ) : (
        <>
          <div onClick={onToggleInfo} className="flex-1 flex items-center gap-3 cursor-pointer min-w-0 h-full">
            <div className="relative shrink-0">
              <div className="w-[40px] h-[40px] rounded-full overflow-hidden bg-[var(--bg-active)] flex items-center justify-center">
                {participant.avatar && participant.avatar.startsWith('/') ? (
                  <img src={participant.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-sm text-[var(--bg-secondary)]" style={{ backgroundColor: participant.avatarColor || '#6a7c85' }}>
                    {participant.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
              </div>
              {participant.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[var(--wa-green)] border-2 border-[var(--bg-secondary)]" />
              )}
            </div>

            <div className="min-w-0 flex flex-col justify-center">
              <h2 className="text-[16px] font-medium text-[var(--text-primary)] leading-tight truncate">{participant.name}</h2>
              <p className={`text-[13px] leading-tight mt-0.5 ${participant.isOnline ? 'text-[var(--wa-green)]' : 'text-[var(--text-secondary)]'}`}>
                {participant.isOnline ? 'online' : `last seen ${participant.lastSeen}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <HeaderIconBtn icon={<Video size={20} />} title="Video call" onClick={() => onStartCall?.('video')} />
            <HeaderIconBtn icon={<Phone size={20} />} title="Voice call" onClick={() => onStartCall?.('audio')} />
            <div className="w-[1px] h-6 bg-[var(--bg-hover)]/50 mx-1" />
            <HeaderIconBtn icon={<Search size={20} />} title="Search in chat" onClick={openSearch} />
            <HeaderIconBtn icon={<MoreVertical size={20} />} title="More options" onClick={onToggleInfo} />
          </div>
        </>
      )}
    </header>
  );
};

const HeaderIconBtn: React.FC<{ icon: React.ReactNode; title: string; onClick?: () => void }> = ({ icon, title, onClick }) => (
  <button
    title={title}
    onClick={onClick}
    className="p-2.5 rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors"
  >
    {icon}
  </button>
);

export default ChatHeader;
