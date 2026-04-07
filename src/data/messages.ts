import type { Message } from '../types';

// Messages indexed by chatId
export const messages: Record<string, Message[]> = {
  'c-group': [
    { id: 'gm1', chatId: 'c-group', content: 'Hey everyone, check this out!', timestamp: '2024-01-15T11:10:00Z', senderId: 'u1', status: 'read', type: 'text' },
    { 
      id: 'gm2', 
      chatId: 'c-group', 
      content: 'WhatsApp UI Clone screenshots', 
      timestamp: '2024-01-15T11:11:00Z', 
      senderId: 'u2', 
      status: 'read', 
      type: 'image', 
      mediaUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800' 
    },
    { id: 'gm3', chatId: 'c-group', content: 'Welcome to the community!', timestamp: '2024-01-15T11:15:00Z', senderId: 'u1', status: 'delivered', type: 'text' },
  ],

  c1: [
    { id: 'm1', chatId: 'c1', content: 'Hey bro, what\'s up?', timestamp: '2024-01-15T08:00:00Z', senderId: 'u1', status: 'read', type: 'text' },
    { id: 'm2', chatId: 'c1', content: 'Sab theek hai! Tu bata?', timestamp: '2024-01-15T08:02:00Z', senderId: 'me', status: 'read', type: 'text' },
    { id: 'm3', chatId: 'c1', content: 'Aaj gym jaana hai kya?', timestamp: '2024-01-15T08:05:00Z', senderId: 'u1', status: 'read', type: 'text' },
    { id: 'm4', chatId: 'c1', content: 'Haan! 6 baje chalein?', timestamp: '2024-01-15T08:10:00Z', senderId: 'me', status: 'read', type: 'text' },
    { id: 'm5', chatId: 'c1', content: 'Done! Aur dinner baad mein?', timestamp: '2024-01-15T09:00:00Z', senderId: 'u1', status: 'read', type: 'text' },
    { id: 'm6', chatId: 'c1', content: 'Sure, koi acha restaurant dhundhte hain 🍕', timestamp: '2024-01-15T09:05:00Z', senderId: 'me', status: 'read', type: 'text' },
    { id: 'm7', chatId: 'c1', content: 'Bhai aaj ka plan kya hai?', timestamp: '2024-01-15T10:42:00Z', senderId: 'u1', status: 'delivered', type: 'text' },
  ],

  c2: [
    { id: 'm1', chatId: 'c2', content: 'Hi Gautam!', timestamp: '2024-01-15T07:00:00Z', senderId: 'u2', status: 'read', type: 'text' },
    { id: 'm2', chatId: 'c2', content: 'Hey Priya! How are you?', timestamp: '2024-01-15T07:05:00Z', senderId: 'me', status: 'read', type: 'text' },
    { id: 'm3', chatId: 'c2', content: 'Good, thanks! Did you finish the assignment?', timestamp: '2024-01-15T07:10:00Z', senderId: 'u2', status: 'read', type: 'text' },
    { 
      id: 'm4_img', 
      chatId: 'c2', 
      content: 'Working on it! Check this out.', 
      timestamp: '2024-01-15T07:15:00Z', 
      senderId: 'me', 
      status: 'read', 
      type: 'image', 
      mediaUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800' 
    },
    { 
      id: 'm5_voice', 
      chatId: 'c2', 
      content: 'Voice Message', 
      timestamp: '2024-01-15T08:00:00Z', 
      senderId: 'u2', 
      status: 'read', 
      type: 'audio', 
      duration: '0:45' 
    },
    { id: 'm6', chatId: 'c2', content: 'Great idea!', timestamp: '2024-01-15T08:02:00Z', senderId: 'me', status: 'read', type: 'text' },
    { 
      id: 'm7_doc', 
      chatId: 'c2', 
      content: 'Can you share the notes? 📚', 
      timestamp: '2024-01-15T09:15:00Z', 
      senderId: 'u2', 
      status: 'read', 
      type: 'document', 
      fileName: 'Project_Notes.pdf', 
      fileSize: '1.2 MB' 
    },
  ],

  c3: [
    { id: 'm1', chatId: 'c3', content: 'Rohit, can you help me with that project?', timestamp: '2024-01-14T10:00:00Z', senderId: 'me', status: 'read', type: 'text' },
    { id: 'm2', chatId: 'c3', content: 'Sure man, what do you need?', timestamp: '2024-01-14T10:30:00Z', senderId: 'u3', status: 'read', type: 'text' },
    { id: 'm3', chatId: 'c3', content: 'The React component is giving errors.', timestamp: '2024-01-14T10:35:00Z', senderId: 'me', status: 'read', type: 'text' },
    { id: 'm4', chatId: 'c3', content: 'Share the code, I\'ll take a look.', timestamp: '2024-01-14T11:00:00Z', senderId: 'u3', status: 'read', type: 'text' },
    { id: 'm5', chatId: 'c3', content: 'Sent! It\'s in the shared folder.', timestamp: '2024-01-14T11:05:00Z', senderId: 'me', status: 'read', type: 'text' },
    { id: 'm6', chatId: 'c3', content: 'Ok sure, will do it tomorrow.', timestamp: '2024-01-14T18:00:00Z', senderId: 'u3', status: 'read', type: 'text' },
  ],

  c4: [
    { id: 'm1', chatId: 'c4', content: 'Hey Sneha! Check out this song 🎵', timestamp: '2024-01-14T08:00:00Z', senderId: 'me', status: 'read', type: 'text' },
    { id: 'm2', chatId: 'c4', content: 'OMG this is amazing! 😍', timestamp: '2024-01-14T09:00:00Z', senderId: 'u4', status: 'read', type: 'text' },
    { id: 'm3', chatId: 'c4', content: 'Right? I\'ve been playing it on loop.', timestamp: '2024-01-14T09:05:00Z', senderId: 'me', status: 'read', type: 'text' },
    { id: 'm4', chatId: 'c4', content: 'Send me more like this please!', timestamp: '2024-01-14T09:10:00Z', senderId: 'u4', status: 'read', type: 'text' },
    { id: 'm5', chatId: 'c4', content: 'Loved the song you sent! 🎵', timestamp: '2024-01-14T14:30:00Z', senderId: 'u4', status: 'delivered', type: 'text' },
  ],

  c5: [
    { id: 'm1', chatId: 'c5', content: 'Yo Karan! Long time no see.', timestamp: '2024-01-12T09:00:00Z', senderId: 'me', status: 'read', type: 'text' },
    { id: 'm2', chatId: 'c5', content: 'Yeah man! Been super busy with work.', timestamp: '2024-01-12T09:30:00Z', senderId: 'u5', status: 'read', type: 'text' },
    { id: 'm3', chatId: 'c5', content: 'Same here. We should meet up soon.', timestamp: '2024-01-12T09:35:00Z', senderId: 'me', status: 'read', type: 'text' },
    { id: 'm4', chatId: 'c5', content: 'Let\'s catch up this weekend?', timestamp: '2024-01-12T11:00:00Z', senderId: 'u5', status: 'read', type: 'text' },
  ],

  c6: [
    { id: 'm1', chatId: 'c6', content: 'Neha, I just wanted to say thank you for your help last week!', timestamp: '2024-01-11T19:00:00Z', senderId: 'me', status: 'read', type: 'text' },
    { id: 'm2', chatId: 'c6', content: 'Of course! Anytime 😊', timestamp: '2024-01-11T19:30:00Z', senderId: 'u6', status: 'read', type: 'text' },
    { id: 'm3', chatId: 'c6', content: 'It really meant a lot.', timestamp: '2024-01-11T19:32:00Z', senderId: 'me', status: 'read', type: 'text' },
    { id: 'm4', chatId: 'c6', content: 'Thank you so much! 🙏', timestamp: '2024-01-11T20:00:00Z', senderId: 'u6', status: 'read', type: 'text' },
  ],

  c7: [
    { id: 'm1', chatId: 'c7', content: 'Vikram, did you get the email I sent?', timestamp: '2024-01-10T14:00:00Z', senderId: 'me', status: 'read', type: 'text' },
    { id: 'm2', chatId: 'c7', content: 'Yes, will go through it shortly.', timestamp: '2024-01-10T14:30:00Z', senderId: 'u7', status: 'read', type: 'text' },
    { id: 'm3', chatId: 'c7', content: 'Cool, let me know if you have questions.', timestamp: '2024-01-10T14:32:00Z', senderId: 'me', status: 'read', type: 'text' },
    { id: 'm4', chatId: 'c7', content: 'Will check and let you know.', timestamp: '2024-01-10T16:00:00Z', senderId: 'u7', status: 'read', type: 'text' },
  ],

  c8: [
    { id: 'm1', chatId: 'c8', content: 'Anjali! How\'s the trip going?', timestamp: '2024-01-10T06:00:00Z', senderId: 'me', status: 'read', type: 'text' },
    { id: 'm2', chatId: 'c8', content: 'Absolutely fantastic! Goa is beautiful 🏖️', timestamp: '2024-01-10T06:30:00Z', senderId: 'u8', status: 'read', type: 'text' },
    { id: 'm3', chatId: 'c8', content: 'Send some pics!', timestamp: '2024-01-10T06:32:00Z', senderId: 'me', status: 'read', type: 'text' },
    { id: 'm4', chatId: 'c8', content: 'Just landed in Goa! 🏖️', timestamp: '2024-01-10T08:00:00Z', senderId: 'u8', status: 'delivered', type: 'text' },
  ],
};
