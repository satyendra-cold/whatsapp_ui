import React from 'react';

const TypingIndicator: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-start',
        padding: '4px 12px 8px',
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--bg-bubble-received)',
          borderRadius: '12px 12px 12px 4px',
          padding: '10px 14px',
          boxShadow: 'var(--shadow-soft)',
          display: 'flex',
          alignItems: 'center',
          gap: 5,
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: 'var(--text-muted)',
              display: 'inline-block',
              animation: `typing-bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
        <style>{`
          @keyframes typing-bounce {
            0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
            30% { transform: translateY(-6px); opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
};

export default TypingIndicator;
