import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { useAuth } from '../context/AuthContext';
import { me } from '../data/chats';

const QRLogin: React.FC = () => {
  const { login } = useAuth();
  const [qrValue, setQrValue] = useState('https://whatsapp.com/scan/' + Math.random().toString(36).substring(7));

  useEffect(() => {
    // Refresh QR code every 20 seconds
    const interval = setInterval(() => {
      setQrValue('https://whatsapp.com/scan/' + Math.random().toString(36).substring(7));
    }, 20000);

    // Simulate auto-scan after 8 seconds for demo purposes
    const autoLogin = setTimeout(() => {
      login(me);
    }, 8000);

    return () => {
      clearInterval(interval);
      clearTimeout(autoLogin);
    };
  }, [login]);

  const QRCodeComp = (QRCode as any).default || QRCode;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, padding: 20 }}>
      <div style={{ backgroundColor: '#fff', padding: 16, borderRadius: 12, boxShadow: 'var(--shadow-soft)' }}>
        <QRCodeComp value={qrValue} size={200} level="H" />
      </div>
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
          Log in with QR Code
        </h3>
        <ol style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'left', lineHeight: 1.6, paddingLeft: 20 }}>
          <li>Open WhatsApp on your phone</li>
          <li>Tap Menu <strong>⋮</strong> or Settings <strong>⚙</strong> and select <strong>Linked Devices</strong></li>
          <li>Point your phone to this screen to capture the code</li>
        </ol>
      </div>
      <div style={{ fontSize: 12, color: 'var(--wa-green)', fontWeight: 500 }}>
        ⏳ Code refreshes automatically
      </div>
    </div>
  );
};

export default QRLogin;
