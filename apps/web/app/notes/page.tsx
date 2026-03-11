import Link from 'next/link';
import { NotesList } from '@/components/NotesList';

export default function NotesPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="border-b border-slate-200 bg-white px-4 py-4 dark:border-slate-700 dark:bg-slate-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Notes
          </h1>
          <Link
            href="/"
            className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
          >
            Home
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-6xl p-6">
        <NotesList />
      </main>
    </div>
  );
}
