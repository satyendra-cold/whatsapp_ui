import type { Chat } from '../types';
import { chats as initialChats } from '../data/chats';

const STORAGE_KEY = 'wa-chats-state';

/**
 * Loads chats from localStorage, merging them with initial data if needed.
 */
export const getStoredChats = (): Chat[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return initialChats;
  
  try {
    const parsed = JSON.parse(stored) as Chat[];
    // Ensure all initial chats are present (matching by ID)
    const merged = initialChats.map(ic => {
      const found = parsed.find(p => p.id === ic.id);
      return found ? found : ic;
    });
    return merged;
  } catch (e) {
    console.error('Failed to parse stored chats:', e);
    return initialChats;
  }
};

/**
 * Saves the current chats state to localStorage.
 */
export const saveChats = (chats: Chat[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
};

/**
 * Handle a specific chat action (Archive, Pin, etc.)
 */
export const performChatAction = (
  chats: Chat[],
  chatId: string,
  action: 'archive' | 'unarchive' | 'pin' | 'unpin' | 'markRead' | 'markUnread' | 'favourite' | 'unfavourite' | 'clear' | 'delete'
): Chat[] => {
  let newChats = [...chats];

  switch (action) {
    case 'archive':
      newChats = newChats.map(c => c.id === chatId ? { ...c, isArchived: true } : c);
      break;
    case 'unarchive':
      newChats = newChats.map(c => c.id === chatId ? { ...c, isArchived: false } : c);
      break;
    case 'pin':
      newChats = newChats.map(c => c.id === chatId ? { ...c, isPinned: true } : c);
      break;
    case 'unpin':
      newChats = newChats.map(c => c.id === chatId ? { ...c, isPinned: false } : c);
      break;
    case 'markRead':
      newChats = newChats.map(c => c.id === chatId ? { ...c, unreadCount: 0 } : c);
      break;
    case 'markUnread':
      newChats = newChats.map(c => c.id === chatId ? { ...c, unreadCount: 1 } : c);
      break;
    case 'favourite':
      newChats = newChats.map(c => c.id === chatId ? { ...c, isStarred: true } : c);
      break;
    case 'unfavourite':
      newChats = newChats.map(c => c.id === chatId ? { ...c, isStarred: false } : c);
      break;
    case 'clear':
      newChats = newChats.map(c => c.id === chatId ? { ...c, lastMessage: '', unreadCount: 0 } : c);
      break;
    case 'delete':
      newChats = newChats.filter(c => c.id !== chatId);
      break;
  }

  saveChats(newChats);
  return newChats;
};
