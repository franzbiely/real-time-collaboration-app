'use client';

import { useLayoutEffect, useRef, useState } from 'react';

const CURSOR_COLORS = [
  '#f59e0b', // amber
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f43f5e', // rose
  '#8b5cf6', // violet
];

function hashUserId(userId: string): number {
  let h = 0;
  for (let i = 0; i < userId.length; i++) {
    h = (h << 5) - h + userId.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export interface RemoteCursorsProps {
  content: string;
  remoteCursors: Record<string, number>;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  className?: string;
}

function getCaretRect(
  mirrorRef: HTMLDivElement,
  offset: number
): { top: number; left: number } | null {
  const text = mirrorRef.querySelector('[data-cursor-text]');
  if (!text?.firstChild) return null;
  const len = (text.textContent ?? '').length;
  const safeOffset = Math.min(Math.max(0, offset), len);
  try {
    const range = document.createRange();
    range.setStart(text.firstChild, safeOffset);
    range.collapse(true);
    const rect = range.getBoundingClientRect();
    const mirrorRect = mirrorRef.getBoundingClientRect();
    return {
      top: rect.top - mirrorRect.top + mirrorRef.scrollTop,
      left: rect.left - mirrorRect.left + mirrorRef.scrollLeft,
    };
  } catch {
    return null;
  }
}

export function RemoteCursors({
  content,
  remoteCursors,
  textareaRef,
  className = '',
}: RemoteCursorsProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const mirrorRef = useRef<HTMLDivElement>(null);
  const [cursorPositions, setCursorPositions] = useState<
    Record<string, { top: number; left: number }>
  >({});
  const [contentHeight, setContentHeight] = useState(0);

  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    const mirror = mirrorRef.current;
    if (!textarea || !mirror) return;

    mirror.style.width = `${textarea.offsetWidth}px`;
    setContentHeight(mirror.scrollHeight);

    const entries = Object.entries(remoteCursors);
    if (entries.length === 0) {
      setCursorPositions({});
      return;
    }

    const next: Record<string, { top: number; left: number }> = {};
    for (const [userId, offset] of entries) {
      const pos = getCaretRect(mirror, offset);
      if (pos) next[userId] = pos;
    }
    setCursorPositions(next);
  }, [content, remoteCursors, textareaRef]);

  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    const overlay = overlayRef.current;
    if (!textarea || !overlay) return;

    const sync = () => {
      overlay.scrollTop = textarea.scrollTop;
      overlay.scrollLeft = textarea.scrollLeft;
    };
    sync();
    textarea.addEventListener('scroll', sync);
    return () => textarea.removeEventListener('scroll', sync);
  }, [textareaRef]);

  const entries = Object.entries(cursorPositions);
  if (entries.length === 0) return null;

  return (
    <>
      <div
        ref={mirrorRef}
        aria-hidden
        className="pointer-events-none invisible absolute left-[-9999px] top-0 overflow-hidden whitespace-pre-wrap break-words font-sans text-base"
        style={{
          padding: '0.75rem',
          lineHeight: 1.5,
        }}
      >
        <span data-cursor-text>{content || '\u00a0'}</span>
      </div>
      <div
        ref={overlayRef}
        className={`pointer-events-none absolute inset-0 overflow-auto ${className}`}
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          padding: '0.75rem',
          font: 'inherit',
        }}
      >
        <div
          className="relative whitespace-pre-wrap break-words"
          style={{ minHeight: contentHeight || '100%' }}
        >
          {entries.map(([userId, pos]) => (
            <div
              key={userId}
              className="absolute w-0.5 animate-pulse"
              style={{
                top: pos.top,
                left: pos.left,
                height: '1.25em',
                backgroundColor: CURSOR_COLORS[hashUserId(userId) % CURSOR_COLORS.length],
              }}
              title={userId}
            />
          ))}
        </div>
      </div>
    </>
  );
}
