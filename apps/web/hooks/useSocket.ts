'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, type Socket } from 'socket.io-client';

export type SocketStatus = 'connecting' | 'connected' | 'reconnecting' | 'disconnected' | 'error';

export interface UseSocketOptions {
  url?: string;
  enabled?: boolean;
  reconnection?: boolean;
  reconnectionAttempts?: number;
  reconnectionDelay?: number;
}

export function useSocket(options: UseSocketOptions = {}) {
  const {
    url = process.env.NEXT_PUBLIC_WS_URL ?? 'http://localhost:3001',
    enabled = true,
    reconnection = true,
    reconnectionAttempts = Infinity,
    reconnectionDelay = 1000,
  } = options;

  const socketRef = useRef<Socket | null>(null);
  const [status, setStatus] = useState<SocketStatus>('disconnected');

  useEffect(() => {
    if (!enabled) {
      setStatus('disconnected');
      return;
    }

    const socket = io(url, {
      reconnection,
      reconnectionAttempts,
      reconnectionDelay,
    });
    socketRef.current = socket;

    setStatus('connecting');

    socket.on('connect', () => setStatus('connected'));
    socket.on('disconnect', () => setStatus('disconnected'));
    socket.on('reconnect', () => setStatus('connected'));
    socket.on('reconnect_attempt', () => setStatus('reconnecting'));
    socket.on('reconnect_error', () => setStatus('error'));
    socket.on('connect_error', () => setStatus('error'));

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
      setStatus('disconnected');
    };
  }, [url, enabled, reconnection, reconnectionAttempts, reconnectionDelay]);

  const emit = useCallback(<T>(event: string, data?: T) => {
    socketRef.current?.emit(event, data);
  }, []);

  const subscribe = useCallback(<T>(event: string, handler: (data: T) => void) => {
    const socket = socketRef.current;
    if (!socket) return () => {};
    socket.on(event, handler);
    return () => socket.off(event, handler);
  }, []);

  return { socket: socketRef.current, status, emit, subscribe };
}
