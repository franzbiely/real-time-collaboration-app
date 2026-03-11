'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { useNote, useUpdateNote } from '@/lib/hooks/use-notes';
import { useSocket } from '@/hooks/useSocket';
import { PresenceIndicator } from './PresenceIndicator';
import { Toolbar } from './Toolbar';

export interface NoteEditorProps {
  noteId: string;
  userId: string;
}

export function NoteEditor({ noteId, userId }: NoteEditorProps) {
  const { data: note, isLoading, error } = useNote(noteId);
  const updateNote = useUpdateNote();
  const { emit, subscribe } = useSocket();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (note) {
      setTitle(note.title ?? '');
      setContent(note.content ?? '');
    }
  }, [note?._id, note?.title, note?.content]);

  useEffect(() => {
    const unsub = subscribe<{ title?: string; content?: string }>(
      'edit-note',
      (edit) => {
        if (edit.title !== undefined) setTitle(edit.title);
        if (edit.content !== undefined) setContent(edit.content);
      }
    );
    return unsub;
  }, [subscribe]);

  const persist = useCallback(
    (updates: { title?: string; content?: string }) => {
      if (!noteId) return;
      updateNote.mutate({ id: noteId, dto: updates });
    },
    [noteId, updateNote]
  );

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = e.target.value;
      setTitle(next);
      emit('edit-note', { noteId, title: next });
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => persist({ title: next }), 400);
    },
    [emit, noteId, persist]
  );

  const handleContentChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const next = e.target.value;
      setContent(next);
      emit('edit-note', { noteId, content: next });
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => persist({ content: next }), 400);
    },
    [emit, noteId, persist]
  );

  useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    },
    []
  );

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Toolbar />
        <div className="flex-1 animate-pulse p-6">
          <div className="mb-4 h-10 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-64 rounded bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="flex min-h-screen flex-col">
        <Toolbar />
        <div className="flex flex-1 items-center justify-center p-6">
          <p className="text-red-600 dark:text-red-400">Note not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Toolbar />
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-2 dark:border-slate-700">
        <PresenceIndicator noteId={noteId} userId={userId} />
      </div>
      <div className="flex-1 p-6">
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Title"
          className="mb-4 w-full border-0 bg-transparent text-2xl font-semibold outline-none placeholder:text-slate-400 focus:ring-0 dark:placeholder:text-slate-500"
        />
        <textarea
          value={content}
          onChange={handleContentChange}
          placeholder="Write your note…"
          className="min-h-[40rem] w-full resize-none border-0 bg-transparent text-slate-700 outline-none placeholder:text-slate-400 focus:ring-0 dark:text-slate-300 dark:placeholder:text-slate-500"
        />
      </div>
    </div>
  );
}
