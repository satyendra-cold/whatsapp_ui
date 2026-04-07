"use client";
import React from 'react';
import { PhoneIncoming, PhoneOutgoing, PhoneMissed, Video, MoreVertical, Search, Phone } from 'lucide-react';
import { calls } from '../data/calls';
import type { CallRecord } from '../types';

const formatCallTime = (iso: string) => {
  const date = new Date(iso);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString())
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

const CallsPage: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col bg-[#111b21] h-full overflow-hidden no-select animate-fade-in">
      {/* Header */}
      <header className="h-[60px] flex items-center justify-between px-4 bg-[#202c33] shrink-0 border-b border-[#222d34]">
        <div className="text-[#e9edef] font-bold text-xl">Calls</div>
        <div className="flex items-center gap-1">
          <IconBtn icon={<Phone size={20} />} title="New call" />
          <IconBtn icon={<MoreVertical size={20} />} title="Menu" />
        </div>
      </header>

      {/* Search - Standard for Sidebar panels */}
      <div className="p-3 shrink-0 bg-[#111b21]">
        <div className="flex items-center gap-3 bg-[#202c33] rounded-lg px-3 py-1.5 ring-offset-0 ring-opacity-0 focus-within:ring-1 ring-[#00a884]">
           <Search size={18} className="text-[#8696a0]" />
           <input type="text" placeholder="Search" className="flex-1 bg-transparent border-none outline-none text-sm text-[#e9edef] placeholder-[#8696a0]" />
        </div>
      </div>

      {/* Call History */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {calls.length > 0 ? (
          calls.map((call) => (
            <CallItem key={call.id} call={call} />
          ))
        ) : (
          <div className="p-8 text-center text-[#8696a0] text-sm">No recent calls.</div>
        )}
      </div>
    </div>
  );
};

const IconBtn: React.FC<{ icon: React.ReactNode; title: string }> = ({ icon, title }) => (
    <button title={title} className="p-2 rounded-full text-[#8696a0] hover:bg-[#374248] transition-colors">{icon}</button>
);

const CallItem: React.FC<{ call: CallRecord }> = ({ call }) => {
  const { participant, direction, type, timestamp, duration } = call;

  const DirectionIcon =
    direction === 'incoming'
      ? PhoneIncoming
      : direction === 'outgoing'
      ? PhoneOutgoing
      : PhoneMissed;

  const directionColor = direction === 'missed' ? '#FF6B6B' : '#00a884';

  return (
    <div
      className="flex items-center gap-3 px-3 py-3 cursor-pointer transition-colors border-b border-[#222d34] hover:bg-[#2a3942]"
    >
      {/* Avatar Fix */}
      <div className="shrink-0">
        <div className="w-[48px] h-[48px] rounded-full overflow-hidden bg-[#202c33] flex items-center justify-center font-bold text-lg text-white">
          {participant.avatar && participant.avatar.startsWith('/') ? (
            <img src={participant.avatar} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <span>{participant.avatar || '?' }</span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 pr-3">
        <div className={`text-[16px] font-medium leading-5 mb-0.5 mt-px truncate ${direction === 'missed' ? 'text-[#FF6B6B]' : 'text-[#e9edef]'}`}>
          {participant.name}
        </div>
        <div className="flex items-center gap-1.5 text-[#8696a0] text-[13px]">
          <DirectionIcon size={14} color={directionColor} />
          <span>{formatCallTime(timestamp)}</span>
          {duration && <span className="opacity-70">· {duration}</span>}
        </div>
      </div>

      {/* Action Icons */}
      <div className="shrink-0 flex items-center pr-1">
        <button className="text-[#00a884] p-2 rounded-full hover:bg-[#334148] transition-colors">
          {type === 'video' ? <Video size={20} /> : <Phone size={20} />}
        </button>
      </div>
    </div>
  );
};

export default CallsPage;
