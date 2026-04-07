import React from 'react';
import { ChevronDown } from 'lucide-react';

interface ScrollToBottomBtnProps {
  visible: boolean;
  unreadCount?: number;
  onClick: () => void;
}

const ScrollToBottomBtn: React.FC<ScrollToBottomBtnProps> = ({ visible, unreadCount, onClick }) => {
  if (!visible) return null;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 16,
        right: 20,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        animation: 'fadeIn 0.2s ease forwards',
      }}
    >
      {unreadCount && unreadCount > 0 ? (
        <span
          style={{
            backgroundColor: 'var(--wa-green)',
            color: '#fff',
            fontSize: 11,
            fontWeight: 700,
            padding: '2px 7px',
            borderRadius: 10,
            minWidth: 20,
            textAlign: 'center',
          }}
        >
          {unreadCount}
        </span>
      ) : null}
      <button
        onClick={onClick}
        title="Scroll to bottom"
        style={{
          width: 38,
          height: 38,
          borderRadius: '50%',
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-medium)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-secondary)',
          transition: 'transform 0.15s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <ChevronDown size={20} />
      </button>
    </div>
  );
};

export default ScrollToBottomBtn;
