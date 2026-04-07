import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Reply, Copy, Star, Trash2 } from 'lucide-react';

export interface ContextMenuAction {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}

interface MessageContextMenuProps {
  x: number;
  y: number;
  isMe: boolean;
  onReply: () => void;
  onCopy: () => void;
  onStar: () => void;
  onDelete: () => void;
  onClose: () => void;
}

const MessageContextMenu: React.FC<MessageContextMenuProps> = ({
  x, y, onReply, onCopy, onStar, onDelete, onClose,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  // Adjust position to prevent overflow
  const adjustedX = Math.min(x, window.innerWidth - 170);
  const adjustedY = Math.min(y, window.innerHeight - 190);

  const items: ContextMenuAction[] = [
    { label: 'Reply', icon: <Reply size={15} />, onClick: onReply },
    { label: 'Copy', icon: <Copy size={15} />, onClick: onCopy },
    { label: 'Star', icon: <Star size={15} />, onClick: onStar },
    { label: 'Delete', icon: <Trash2 size={15} />, onClick: onDelete, danger: true },
  ];

  const menu = (
    <div
      ref={menuRef}
      style={{
        position: 'fixed',
        top: adjustedY,
        left: adjustedX,
        zIndex: 10000,
        backgroundColor: 'var(--bg-primary)',
        borderRadius: 10,
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
        border: '1px solid var(--border-color)',
        overflow: 'hidden',
        minWidth: 160,
        animation: 'fadeIn 0.1s ease forwards',
      }}
    >
      {items.map((item) => (
        <button
          key={item.label}
          onClick={() => { item.onClick(); onClose(); }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            width: '100%',
            padding: '10px 14px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 13,
            color: item.danger ? '#FF6B6B' : 'var(--text-primary)',
            textAlign: 'left',
            transition: 'background 0.1s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </div>
  );

  return createPortal(menu, document.body);
};

export default MessageContextMenu;
