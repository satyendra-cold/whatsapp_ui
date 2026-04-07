'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useDashStore } from '@/lib/store';
import type { DashMessage } from '@/lib/store';
import { formatTime, formatFullDateTime, getInitials, generateAvatarColor } from '@/lib/utils';
import { Send, ArrowDown, Info, Clock, Check, CheckCheck, AlertCircle, Loader2, FileText } from 'lucide-react';
import TemplateSender from './TemplateSender';

export default function DashChatWindow() {
  const {
    messages,
    conversations,
    activeConversationId,
    loadingMessages,
    sendMessage,
  } = useDashStore();

  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [statusTooltip, setStatusTooltip] = useState<string | null>(null);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find((c) => c.id === activeConversationId);
  const contact = activeConv?.contact;
  const contactName = contact?.name || contact?.phone_number || 'Unknown';
  const contactPhone = contact?.phone_number || '';

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const isNear = container.scrollHeight - container.scrollTop - container.clientHeight < 200;
    if (isNear) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Scroll to bottom on conversation switch
  useEffect(() => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'auto' });
    }, 100);
  }, [activeConversationId]);

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;
    setShowScrollBtn(
      container.scrollHeight - container.scrollTop - container.clientHeight > 300
    );
  };

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || !contactPhone || !activeConversationId) return;

    setInputText('');
    setSending(true);
    try {
      await sendMessage(contactPhone, text, activeConversationId);
    } catch (err) {
      console.error('Send failed:', err);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Group messages by date
  const groupedMessages = groupByDate(messages);

  // Send template function
  const handleSendTemplate = async (
    templateName: string,
    languageCode: string,
    components: any[],
    resolvedText: string
  ) => {
    if (!contactPhone || !activeConversationId) return;
    try {
      const res = await fetch('/api/send-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: contactPhone,
          templateName,
          languageCode,
          components,
          conversationId: activeConversationId,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to send template');
      }
    } catch (err) {
      console.error('Send template failed:', err);
      throw err;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="h-[60px] bg-[#202c33] px-4 flex items-center gap-3 shrink-0 border-b border-[#2a3942]/30">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[15px] font-semibold shrink-0"
          style={{ backgroundColor: generateAvatarColor(contactName) }}
        >
          {getInitials(contactName)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[15px] text-[#e9edef] font-medium truncate">
            {contactName}
          </div>
          <div className="text-[12px] text-[#8696a0] truncate">{contactPhone}</div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 relative overflow-hidden bg-[#0b141a]">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'url("/backgroundImage.webp")',
          backgroundRepeat: 'repeat',
          backgroundSize: '412px',
        }} />

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="h-full overflow-y-auto pt-4 pb-2 px-4 relative z-10"
        >
          {loadingMessages ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-[#00a884] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <div className="bg-[#182229] px-6 py-3 rounded-lg text-[#8696a0] text-sm">
                No messages yet. Send a message to start the conversation.
              </div>
            </div>
          ) : (
            groupedMessages.map((group) => (
              <div key={group.date}>
                {/* Date Divider */}
                <div className="flex justify-center my-4">
                  <span className="bg-[#182229] text-[#8696a0] text-[11px] px-3 py-1 rounded-[7px] shadow-sm font-medium uppercase tracking-wide">
                    {group.date}
                  </span>
                </div>

                {/* Messages */}
                {group.messages.map((msg) => (
                  <MessageBubble
                    key={msg.id}
                    message={msg}
                    onShowStatus={(id) =>
                      setStatusTooltip(statusTooltip === id ? null : id)
                    }
                    showStatus={statusTooltip === msg.id}
                  />
                ))}
              </div>
            ))
          )}
          <div ref={bottomRef} className="h-2" />
        </div>

        {/* Scroll to bottom */}
        {showScrollBtn && (
          <button
            onClick={() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="absolute bottom-4 right-6 w-10 h-10 bg-[#202c33] rounded-full flex items-center justify-center shadow-lg text-[#8696a0] hover:text-[#e9edef] transition-colors z-20"
          >
            <ArrowDown size={20} />
          </button>
        )}
      </div>

      {/* Template Sender Popup */}
      {showTemplatePicker && (
        <TemplateSender
          onSend={handleSendTemplate}
          onClose={() => setShowTemplatePicker(false)}
        />
      )}

      {/* Input */}
      <div className="bg-[#202c33] px-4 py-3 flex items-end gap-3 shrink-0 border-t border-[#2a3942]/30 relative">
        <button
          onClick={() => setShowTemplatePicker(!showTemplatePicker)}
          title="Send Template"
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all active:scale-95 ${
            showTemplatePicker
              ? 'bg-[#00a884] text-[#111b21]'
              : 'bg-[#2a3942] text-[#8696a0] hover:text-[#e9edef] hover:bg-[#3b4a54]'
          }`}
        >
          <FileText size={18} />
        </button>

        <div className="flex-1 bg-[#2a3942] rounded-lg px-4 py-2.5 flex items-end">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message"
            rows={1}
            className="flex-1 bg-transparent border-none outline-none text-[14px] text-[#e9edef] placeholder:text-[#8696a0]/50 resize-none max-h-[120px]"
            style={{ minHeight: '24px' }}
          />
        </div>

        <button
          onClick={handleSend}
          disabled={sending || !inputText.trim()}
          className="w-10 h-10 rounded-full bg-[#00a884] flex items-center justify-center text-[#111b21] shrink-0 hover:bg-[#00a884]/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
        >
          {sending ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Send size={18} />
          )}
        </button>
      </div>
    </div>
  );
}

// ---- Message Bubble ----
function MessageBubble({
  message,
  onShowStatus,
  showStatus,
}: {
  message: DashMessage;
  onShowStatus: (id: string) => void;
  showStatus: boolean;
}) {
  const isMe = message.direction === 'outbound';

  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-1 px-2`}>
      <div
        className={`relative max-w-[65%] px-3 py-1.5 rounded-lg text-[14px] leading-[19px] shadow-sm ${
          isMe
            ? 'bg-[#005c4b] text-[#e9edef] rounded-tr-none'
            : 'bg-[#202c33] text-[#e9edef] rounded-tl-none'
        }`}
      >
        {/* Content */}
        <span className="whitespace-pre-wrap break-words">{message.content}</span>

        {/* Meta row: time + status */}
        <span className="float-right ml-3 mt-1 flex items-center gap-1 text-[11px] text-[#ffffff99] select-none">
          <span>{formatTime(message.created_at)}</span>
          {isMe && <StatusIcon status={message.status} onClick={() => onShowStatus(message.id)} />}
        </span>

        {/* Status Details Tooltip */}
        {showStatus && isMe && (
          <div className="absolute bottom-full right-0 mb-1 bg-[#182229] border border-[#2a3942] rounded-lg px-4 py-3 text-[12px] shadow-xl z-30 w-[220px]">
            <div className="text-[#e9edef] font-medium mb-2 flex items-center gap-1.5">
              <Info size={14} className="text-[#00a884]" /> Message Info
            </div>
            <div className="space-y-1.5 text-[#8696a0]">
              <div className="flex justify-between">
                <span>Status</span>
                <span className={`font-medium ${
                  message.status === 'read' ? 'text-[#53BDEB]' :
                  message.status === 'delivered' ? 'text-[#8696a0]' :
                  message.status === 'failed' ? 'text-[#ff5c5c]' :
                  'text-[#8696a0]'
                }`}>{message.status}</span>
              </div>
              {message.delivered_at && (
                <div className="flex justify-between">
                  <span>Delivered</span>
                  <span className="text-[#e9edef]">{formatFullDateTime(message.delivered_at)}</span>
                </div>
              )}
              {message.seen_at && (
                <div className="flex justify-between">
                  <span>Seen</span>
                  <span className="text-[#53BDEB]">{formatFullDateTime(message.seen_at)}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---- Status Ticks ----
function StatusIcon({ status, onClick }: { status: string; onClick: () => void }) {
  const baseClass = 'cursor-pointer';
  switch (status) {
    case 'read':
      return <CheckCheck size={16} className={`${baseClass} text-[#53BDEB]`} onClick={onClick} />;
    case 'delivered':
      return <CheckCheck size={16} className={`${baseClass} text-[#ffffff80]`} onClick={onClick} />;
    case 'sent':
      return <Check size={16} className={`${baseClass} text-[#ffffff80]`} onClick={onClick} />;
    case 'failed':
      return <AlertCircle size={14} className={`${baseClass} text-[#ff5c5c]`} onClick={onClick} />;
    default:
      return <Clock size={13} className={`${baseClass} text-[#ffffff60]`} onClick={onClick} />;
  }
}

// ---- Group by Date ----
function groupByDate(messages: DashMessage[]) {
  const groups: { date: string; messages: DashMessage[] }[] = [];
  let currentDate = '';

  for (const msg of messages) {
    const d = new Date(msg.created_at);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    let label: string;
    if (d.toDateString() === today.toDateString()) {
      label = 'TODAY';
    } else if (d.toDateString() === yesterday.toDateString()) {
      label = 'YESTERDAY';
    } else {
      label = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase();
    }

    if (label !== currentDate) {
      currentDate = label;
      groups.push({ date: label, messages: [msg] });
    } else {
      groups[groups.length - 1].messages.push(msg);
    }
  }

  return groups;
}
