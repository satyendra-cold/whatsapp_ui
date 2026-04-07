import React, { useRef, useEffect } from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
  theme: 'light' | 'dark';
}

const EmojiPickerPopover: React.FC<EmojiPickerProps> = ({ onSelect, onClose, theme }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
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

  return (
    <div
      ref={wrapperRef}
      style={{
        position: 'absolute',
        bottom: 70,
        left: 8,
        zIndex: 1000,
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
        animation: 'fadeIn 0.15s ease forwards',
      }}
    >
      <Picker
        data={data}
        theme={theme}
        onEmojiSelect={(emoji: { native: string }) => {
          onSelect(emoji.native);
        }}
        previewPosition="none"
        skinTonePosition="none"
        maxFrequentRows={2}
      />
    </div>
  );
};

export default EmojiPickerPopover;
