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
    const unsubJoin = subscribe<{ userId: string }>('user-joined', (data) => {
      setUserIds((prev) =>
        prev.includes(data.userId) ? prev : [...prev, data.userId]
      );
    });
    const unsubLeft = subscribe<{ userId: string }>('user-left', (data) => {
      setUserIds((prev) => prev.filter((id) => id !== data.userId));
    });
    return () => {
      unsubJoin();
      unsubLeft();
    };
  }, [subscribe]);

  const displayIds = userIds.filter((id) => id !== userId);
  if (displayIds.length === 0) return null;

  return (
    <div className="flex items-center gap-1">
      <span className="text-xs text-slate-500 dark:text-slate-400">
        Viewing:
      </span>
      <div className="flex -space-x-2">
        {displayIds.slice(0, 5).map((id) => (
          <div
            key={id}
            className={`h-6 w-6 rounded-full border-2 border-white ring-1 ring-slate-200 dark:border-slate-800 dark:ring-slate-700 ${AVATAR_COLORS[hashUserId(id) % AVATAR_COLORS.length]}`}
            title={id}
          />
        ))}
        {displayIds.length > 5 && (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs dark:bg-slate-600">
            +{displayIds.length - 5}
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
