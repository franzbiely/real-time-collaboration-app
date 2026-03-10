// Shared types for Real-Time Collaborative Notes app

export interface User {
  id: string;
  name: string;
  color?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  participantIds: string[];
}

export interface CursorPosition {
  userId: string;
  noteId: string;
  x: number;
  y: number;
  selection?: { start: number; end: number };
}

// Socket event payloads (for real-time features to be built)
export type SocketEvents = {
  'note:join': { noteId: string; user: User };
  'note:leave': { noteId: string; userId: string };
  'note:edit': { noteId: string; content: string; userId: string };
  'cursor:move': CursorPosition;
  'presence:update': { noteId: string; users: User[] };
};
