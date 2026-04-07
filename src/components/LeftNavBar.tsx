import React from 'react';
import { Users, Archive, Star, MessageSquareMore, CircleDashed, Trash2, Settings, User } from 'lucide-react';
import type { NavTab } from '../types';

interface LeftNavBarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  totalUnread: number;
  onLogout: () => void;
  onOpenSettings: () => void;
}

const LeftNavBar: React.FC<LeftNavBarProps> = ({ activeTab, onTabChange, totalUnread, onOpenSettings }) => {
  return (
    <nav className="w-[60px] h-full bg-[var(--bg-secondary)] flex flex-col items-center py-3 shrink-0 z-[200] border-r border-[#2a3942]/50">
      {/* Top Main Nav Items */}
      <div className="flex-1 flex flex-col items-center gap-2 w-full">
        <NavItem
          icon={<MessageSquareMore size={24} />}
          label="Chats"
          isActive={activeTab === 'chats'}
          badge={totalUnread > 0 ? totalUnread : undefined}
          onClick={() => onTabChange('chats')}
        />
        <NavItem
          icon={<CircleDashed size={24} />}
          label="Status"
          isActive={activeTab === 'status'}
          onClick={() => onTabChange('status')}
        />
        <NavItem
          icon={<Users size={24} />}
          label="Communities"
          isActive={activeTab === 'communities'}
          onClick={() => onTabChange('communities')}
        />

        <div className="w-[28px] h-[1px] bg-[var(--bg-hover)] my-1" />

        <IconBtn icon={<Archive size={20} />} title="Archived" />
        <IconBtn icon={<Star size={20} />} title="Starred" />
        <IconBtn icon={<Trash2 size={20} />} title="Trash" />
      </div>

      {/* Bottom Nav Items */}
      <div className="flex flex-col items-center gap-2 pb-2 w-full">
        {/* Meta AI Colorful Icon (Restored as per user preference) */}
        <button
          title="Meta AI"
          className="w-10 h-10 flex items-center justify-center rounded-full transition-transform hover:scale-105 mb-1"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#33ccff] via-[#3366ff] to-[#cc33ff] p-[2px]">
            <div className="w-full h-full rounded-full bg-[var(--bg-secondary)] flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-white blur-[1px] opacity-10" />
            </div>
          </div>
        </button>

        <IconBtn icon={<Settings size={22} />} title="Settings" onClick={onOpenSettings} />

        {/* Profile */}
        <div className="w-8 h-8 rounded-full bg-[#6a7c85] flex items-center justify-center cursor-pointer overflow-hidden mt-1 hover:opacity-90 transition-opacity">
          <User size={18} className="text-[var(--bg-secondary)]" />
        </div>
      </div>
    </nav>
  );
};

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  badge?: number;
  onClick: () => void;
}> = ({ icon, label, isActive, badge, onClick }) => (
  <div className="relative w-full flex justify-center py-1 group">
    {isActive && (
      <div className="absolute inset-y-1.5 left-0 w-[3px] bg-[var(--wa-green)] rounded-r-full" />
    )}
    <button
      onClick={onClick}
      title={label}
      className={`relative w-10 h-10 flex items-center justify-center transition-all rounded-xl ${
        isActive ? 'bg-[var(--bg-active)] text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
      }`}
    >
      {icon}
      {badge !== undefined && badge > 0 && (
        <span className="absolute top-1 right-1 min-w-[17px] h-[17px] bg-[var(--wa-green)] text-[var(--bg-primary)] text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[var(--bg-secondary)]">
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </button>
  </div>
);

const IconBtn: React.FC<{ icon: React.ReactNode; title: string; onClick?: () => void }> = ({ icon, title, onClick }) => (
  <button onClick={onClick} title={title} className="w-10 h-10 flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] rounded-xl transition-colors">
    {icon}
  </button>
);

export default LeftNavBar;
