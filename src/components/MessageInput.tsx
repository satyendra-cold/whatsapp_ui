import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Smile, Plus, Mic, Send, Trash2 } from 'lucide-react';
import EmojiPickerPopover from './EmojiPicker';

interface MessageInputProps {
  onSend: (text: string) => void;
  theme: 'light' | 'dark';
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend, theme }) => {
  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<number | null>(null);

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText('');
    setShowEmojiPicker(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = '42px';
    }
    textareaRef.current?.focus();
  }, [text, onSend]);

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    timerRef.current = window.setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopRecording = (send = true) => {
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (send && recordingTime > 0) {
      onSend(`🎤 Voice message (${formatTime(recordingTime)})`);
    }
    setRecordingTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setText((prev) => prev + emoji);
    textareaRef.current?.focus();
  };

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = '42px';
    ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`;
  }, [text]);

  return (
    <div className="relative flex items-center px-4 py-2 bg-[var(--bg-secondary)] shrink-0 min-h-[62px] gap-2 border-t border-[var(--bg-hover)]/10">
      {showEmojiPicker && (
        <EmojiPickerPopover
          onSelect={handleEmojiSelect}
          onClose={() => setShowEmojiPicker(false)}
          theme={theme}
        />
      )}

      {isRecording ? (
        <div className="flex-1 flex items-center gap-4 animate-fade-in">
          <button onClick={() => stopRecording(false)} className="text-[#ff5c5c] p-2 hover:bg-[var(--bg-hover)] rounded-full transition-colors">
            <Trash2 size={24} />
          </button>
          
          <div className="flex-1 flex items-center gap-3 bg-[var(--bg-secondary)] py-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5c5c] animate-pulse" />
            <span className="text-[15px] font-medium text-[var(--text-primary)] min-w-[40px] tracking-tight">
              {formatTime(recordingTime)}
            </span>
            <span className="text-[14px] text-[var(--text-secondary)] ml-auto">Slide to cancel</span>
          </div>

          <button onClick={() => stopRecording(true)} className="w-[42px] h-[42px] rounded-full flex items-center justify-center bg-[var(--wa-green)] text-[var(--bg-primary)] hover:scale-105 transition-transform">
            <Send size={20} />
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center">
            <InputIconBtn
              icon={<Smile size={26} />}
              title="Emoji"
              active={showEmojiPicker}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            />
            <InputIconBtn icon={<Plus size={26} />} title="Attach" onClick={() => {}} />
          </div>

          <div className="flex-1 bg-[var(--bg-input)] rounded-lg px-3 py-1 flex items-center min-h-[42px] ml-1">
            <textarea
              ref={textareaRef}
              rows={1}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message"
              className="flex-1 bg-transparent border-none outline-none resize-none text-[15px] text-[var(--text-primary)] placeholder-[var(--text-secondary)] leading-[20px] max-h-[160px] overflow-y-auto font-sans py-1.5 no-scrollbar"
            />
          </div>

          <div className="flex items-center w-[44px] justify-center ml-1">
            {text.trim() ? (
              <button 
                onClick={handleSend}
                className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors active:scale-95"
                title="Send"
              >
                <Send size={26} />
              </button>
            ) : (
              <button 
                onClick={startRecording}
                className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors active:scale-95"
                title="Voice Message"
              >
                <Mic size={26} />
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const InputIconBtn: React.FC<{
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
  active?: boolean;
}> = ({ icon, title, onClick, active }) => (
  <button
    title={title}
    onClick={onClick}
    className={`p-2 rounded-full transition-all flex items-center justify-center ${
      active ? 'text-[var(--wa-green)] bg-[var(--bg-hover)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
    }`}
  >
    {icon}
  </button>
);

export default MessageInput;
