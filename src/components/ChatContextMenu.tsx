import React, { useEffect, useRef } from 'react';
import { 
  Archive, 
  Pin, 
  PinOff, 
  MessageSquare, 
  Heart, 
  Image as ImageIcon, 
  MinusCircle, 
  Trash2
} from 'lucide-react';
import type { Chat } from '../types';

interface ChatContextMenuProps {
  x: number;
  y: number;
  chat: Chat;
  onClose: () => void;
  onAction: (chatId: string, action: any) => void;
}

const ChatContextMenu: React.FC<ChatContextMenuProps> = ({ x, y, chat, onClose, onAction }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Adjust position to keep menu inside viewport
  const menuWidth = 240;
  const menuHeight = 320;
  const adjustedX = x + menuWidth > window.innerWidth ? x - menuWidth : x;
  const adjustedY = y + menuHeight > window.innerHeight ? y - menuHeight : y;

  const handleAction = (action: string) => {
    onAction(chat.id, action);
    onClose();
  };

  return (
    <div
      ref={menuRef}
      style={{
        position: 'fixed',
        top: adjustedY,
        left: adjustedX,
        width: menuWidth,
        backgroundColor: '#202C33',
        borderRadius: 12,
        padding: '8px 0',
        boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
        zIndex: 1000,
        border: '1px solid #33424d',
        animation: 'fadeIn 0.15s ease-out forwards',
      }}
    >
      <ContextItem 
        icon={<Archive size={18} />} 
        label={chat.isArchived ? "Unarchive chat" : "Archive chat"} 
        onClick={() => handleAction(chat.isArchived ? 'unarchive' : 'archive')} 
      />
      <ContextItem 
        icon={chat.isPinned ? <PinOff size={18} /> : <Pin size={18} />} 
        label={chat.isPinned ? "Unpin chat" : "Pin chat"} 
        onClick={() => handleAction(chat.isPinned ? 'unpin' : 'pin')} 
      />
      <ContextItem 
        icon={<MessageSquare size={18} />} 
        label={chat.unreadCount > 0 ? "Mark as read" : "Mark as unread"} 
        onClick={() => handleAction(chat.unreadCount > 0 ? 'markRead' : 'markUnread')} 
      />
      <ContextItem 
        icon={<Heart size={18} />} 
        label={chat.isStarred ? "Remove from favourites" : "Add to favourites"} 
        onClick={() => handleAction(chat.isStarred ? 'unfavourite' : 'favourite')} 
      />
      <ContextItem 
        icon={<ImageIcon size={18} />} 
        label="Add to list" 
        onClick={() => {}} 
      />
      
      <div style={{ height: 0.5, backgroundColor: '#33424d', margin: '4px 0' }} />
      
      <ContextItem 
        icon={<MinusCircle size={18} />} 
        label="Clear chat" 
        onClick={() => handleAction('clear')} 
      />
      <ContextItem 
        icon={<Trash2 size={18} />} 
        label="Delete chat" 
        danger 
        onClick={() => handleAction('delete')} 
      />
    </div>
  );
};

const ContextItem: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  onClick: () => void; 
  danger?: boolean 
}> = ({ icon, label, onClick, danger }) => (
  <button
    onClick={(e) => { e.stopPropagation(); onClick(); }}
    style={{
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '10px 16px',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      textAlign: 'left',
      color: danger ? '#ff5c5c' : '#E9EDEF',
      fontSize: 14,
      transition: 'background 0.1s',
    }}
    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#111B21')}
    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
  >
    <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>
    <span style={{ flex: 1 }}>{label}</span>
  </button>
);

export default ChatContextMenu;
