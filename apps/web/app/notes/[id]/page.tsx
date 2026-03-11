'use client';

import { useParams } from 'next/navigation';
import { NoteEditor } from '@/components/NoteEditor';

const FALLBACK_USER_ID = 'anonymous';

export default function NotePage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : null;

  if (!id) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-500 dark:text-slate-400">Invalid note.</p>
      </div>
    );
  }

  return <NoteEditor noteId={id} userId={FALLBACK_USER_ID} />;
}
