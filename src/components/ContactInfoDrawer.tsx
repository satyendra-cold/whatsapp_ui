import React from 'react';
import { X, ChevronRight, Star, Bell, Image as ImageIcon, Trash2, LogOut, ShieldAlert } from 'lucide-react';
import type { Chat } from '../types';

interface ContactInfoDrawerProps {
  chat: Chat;
  onClose: () => void;
}

const ContactInfoDrawer: React.FC<ContactInfoDrawerProps> = ({ chat, onClose }) => {
  const { participant, isGroup, groupDescription, members } = chat;

  return (
    <div
      style={{
        width: 380,
        height: '100%',
        backgroundColor: 'var(--bg-secondary)',
        borderLeft: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        animation: 'slideInRight 0.3s ease-out forwards',
      }}
    >
      {/* Header */}
      <div
        style={{
          height: 60,
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          backgroundColor: 'var(--bg-header)',
          borderBottom: '1px solid var(--border-color)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={24} />
        </button>
        <span style={{ fontSize: 16, fontWeight: 500, color: 'var(--text-primary)' }}>
          {isGroup ? 'Group info' : 'Contact info'}
        </span>
      </div>

      {/* Main Info */}
      <div style={{ backgroundColor: 'var(--bg-primary)', padding: '28px 30px', textAlign: 'center', marginBottom: 10 }}>
        <div
          style={{
            width: 200,
            height: 200,
            borderRadius: '50%',
            backgroundColor: participant.avatarColor,
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 64,
            fontWeight: 600,
            color: '#fff',
            boxShadow: 'var(--shadow-soft)',
          }}
        >
          {participant.avatar}
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 400, color: 'var(--text-primary)', margin: '0 0 4px' }}>
          {participant.name}
        </h2>
        <p style={{ fontSize: 16, color: 'var(--text-muted)', margin: 0 }}>
          {isGroup ? `Group • ${members?.length} members` : participant.lastSeen}
        </p>
      </div>

      {/* About Section */}
      <div style={{ backgroundColor: 'var(--bg-primary)', padding: '14px 30px', marginBottom: 10 }}>
        <h3 style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 400, marginBottom: 12 }}>
          {isGroup ? 'Group description' : 'About'}
        </h3>
        <p style={{ fontSize: 14, color: 'var(--text-primary)', margin: 0, lineHeight: 1.5 }}>
          {isGroup ? groupDescription : participant.status}
        </p>
      </div>

      {/* Media/Links/Docs */}
      <div style={{ backgroundColor: 'var(--bg-primary)', padding: '14px 30px', marginBottom: 10, cursor: 'pointer' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <ImageIcon size={20} color="var(--text-muted)" />
            <span style={{ fontSize: 14, color: 'var(--text-primary)' }}>Media, links and docs</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)' }}>
            <span style={{ fontSize: 13 }}>12</span>
            <ChevronRight size={18} />
          </div>
        </div>
      </div>

      {/* List Items */}
      <div style={{ backgroundColor: 'var(--bg-primary)', marginBottom: 10 }}>
        <div style={{ padding: '14px 30px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Star size={20} color="var(--text-muted)" />
            <span style={{ fontSize: 14, color: 'var(--text-primary)' }}>Starred messages</span>
          </div>
          <ChevronRight size={18} color="var(--text-muted)" />
        </div>
        <div style={{ padding: '14px 30px', display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Bell size={20} color="var(--text-muted)" />
            <span style={{ fontSize: 14, color: 'var(--text-primary)' }}>Mute notifications</span>
          </div>
          <ChevronRight size={18} color="var(--text-muted)" />
        </div>
      </div>

      {/* Members Section (Groups only) */}
      {isGroup && members && (
        <div style={{ backgroundColor: 'var(--bg-primary)', padding: '14px 0', marginBottom: 10 }}>
          <h3 style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 400, padding: '0 30px', marginBottom: 12 }}>
            {members.length} members
          </h3>
          {members.map((member) => (
            <div
              key={member.id}
              style={{ padding: '10px 30px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  backgroundColor: member.avatarColor,
                  fontSize: 16,
                  color: '#fff',
                }}
              >
                {member.avatar}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, color: 'var(--text-primary)' }}>{member.name}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{member.status}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Danger Zone */}
      <div style={{ backgroundColor: 'var(--bg-primary)', marginBottom: 20 }}>
        <div style={{ padding: '15px 30px', display: 'flex', alignItems: 'center', gap: 15, color: '#ff5c5c', cursor: 'pointer' }}>
          <ShieldAlert size={20} />
          <span style={{ fontSize: 14 }}>Block {participant.name}</span>
        </div>
        <div style={{ padding: '15px 30px', display: 'flex', alignItems: 'center', gap: 15, color: '#ff5c5c', cursor: 'pointer' }}>
          <Trash2 size={20} />
          <span style={{ fontSize: 14 }}>{isGroup ? 'Exit group' : 'Report contact'}</span>
        </div>
        <div style={{ padding: '15px 30px', display: 'flex', alignItems: 'center', gap: 15, color: '#ff5c5c', cursor: 'pointer' }}>
          <LogOut size={20} />
          <span style={{ fontSize: 14 }}>{isGroup ? 'Delete group' : 'Delete chat'}</span>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default ContactInfoDrawer;
