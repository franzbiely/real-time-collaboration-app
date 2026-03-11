'use client';

import { useEffect, useState } from 'react';
import { useSocket } from '@/hooks/useSocket';

const AVATAR_COLORS = [
  'bg-amber-500',
  'bg-blue-500',
  'bg-emerald-500',
  'bg-rose-500',
  'bg-violet-500',
];

function hashUserId(userId: string): number {
  let h = 0;
  for (let i = 0; i < userId.length; i++) {
    h = (h << 5) - h + userId.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export interface PresenceIndicatorProps {
  noteId: string;
  userId: string;
}

export function PresenceIndicator({ noteId, userId }: PresenceIndicatorProps) {
  const { emit, subscribe, status } = useSocket();
  const [userIds, setUserIds] = useState<string[]>([]);

  useEffect(() => {
    emit('join-note', { noteId, userId });
    return () => {
      emit('leave-note', { noteId, userId });
    };
  }, [noteId, userId, emit]);

  useEffect(() => {
    return subscribe<{ noteId: string; userIds: string[] }>(
      'presence-update',
      (payload) => {
        if (payload.noteId === noteId) setUserIds(payload.userIds);
      }
    );
  }, [subscribe, noteId]);

  if (userIds.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-500 dark:text-slate-400">
        Active:
      </span>
      <div className="flex -space-x-2">
        {userIds.slice(0, 6).map((id) => (
          <div
            key={id}
            className={`h-7 w-7 rounded-full border-2 border-white ring-1 ring-slate-200 dark:border-slate-800 dark:ring-slate-700 ${AVATAR_COLORS[hashUserId(id) % AVATAR_COLORS.length]} ${id === userId ? 'ring-2 ring-emerald-400' : ''}`}
            title={id === userId ? `${id} (you)` : id}
          />
        ))}
        {userIds.length > 6 && (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-xs dark:bg-slate-600">
            +{userIds.length - 6}
          </span>
        )}
      </div>
      {status !== 'connected' && (
        <span className="ml-1 text-xs text-amber-600 dark:text-amber-400">
          reconnecting…
        </span>
      )}
    </div>
  );
}
