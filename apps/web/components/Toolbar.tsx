'use client';

import Link from 'next/link';

export interface ToolbarProps {
  saveStatus?: 'saving' | 'saved' | null;
}

export function Toolbar({ saveStatus = null }: ToolbarProps) {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
      <Link
        href="/notes"
        className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
      >
        ← Notes
      </Link>
      <div className="flex items-center gap-2">
        {saveStatus === 'saving' && (
          <>
            <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Saving...
            </span>
          </>
        )}
        {saveStatus === 'saved' && (
          <>
            <span className="h-2 w-2 rounded-full bg-emerald-500" title="Saved" />
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Saved
            </span>
          </>
        )}
      </div>
    </header>
  );
}
