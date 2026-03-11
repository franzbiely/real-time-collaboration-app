'use client';

import Link from 'next/link';
import { useNotes } from '@/lib/hooks/use-notes';
import type { Note } from '@/lib/types/note';

function NoteItem({ note }: { note: Note }) {
  return (
    <Link
      href={`/notes/${note._id}`}
      className="block rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600"
    >
      <h3 className="font-semibold text-slate-900 dark:text-slate-100">
        {note.title || 'Untitled'}
      </h3>
      <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
        {note.content || 'No content'}
      </p>
    </Link>
  );
}

export function NotesList() {
  const { data: notes, isLoading, error } = useNotes();

  if (isLoading) {
    return (
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <li
            key={i}
            className="h-24 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700"
          />
        ))}
      </ul>
    );
  }

  if (error) {
    return (
      <p className="rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-400">
        Failed to load notes.
      </p>
    );
  }

  if (!notes?.length) {
    return (
      <p className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-500 dark:border-slate-600 dark:text-slate-400">
        No notes yet.
      </p>
    );
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {notes.map((note) => (
        <li key={note._id}>
          <NoteItem note={note} />
        </li>
      ))}
    </ul>
  );
}
