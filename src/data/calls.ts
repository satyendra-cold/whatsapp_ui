import type { CallRecord } from '../types';
import { users } from './chats';

export const calls: CallRecord[] = [
  {
    id: 'call1',
    participant: users[0],
    direction: 'incoming',
    type: 'audio',
    timestamp: '2024-01-15T10:00:00Z',
    duration: '5:23',
  },
  {
    id: 'call2',
    participant: users[1],
    direction: 'missed',
    type: 'video',
    timestamp: '2024-01-15T08:30:00Z',
  },
  {
    id: 'call3',
    participant: users[2],
    direction: 'outgoing',
    type: 'audio',
    timestamp: '2024-01-14T20:00:00Z',
    duration: '12:07',
  },
  {
    id: 'call4',
    participant: users[3],
    direction: 'incoming',
    type: 'video',
    timestamp: '2024-01-14T15:45:00Z',
    duration: '2:55',
  },
  {
    id: 'call5',
    participant: users[4],
    direction: 'missed',
    type: 'audio',
    timestamp: '2024-01-13T09:00:00Z',
  },
  {
    id: 'call6',
    participant: users[5],
    direction: 'outgoing',
    type: 'audio',
    timestamp: '2024-01-12T18:00:00Z',
    duration: '7:14',
  },
  {
    id: 'call7',
    participant: users[6],
    direction: 'incoming',
    type: 'video',
    timestamp: '2024-01-11T11:00:00Z',
    duration: '1:30',
  },
  {
    id: 'call8',
    participant: users[7],
    direction: 'outgoing',
    type: 'audio',
    timestamp: '2024-01-10T08:00:00Z',
    duration: '3:42',
  },
];
