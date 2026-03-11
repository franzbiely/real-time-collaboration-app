import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import type { Socket } from 'socket.io';

const room = (noteId: string) => `note:${noteId}`;

@WebSocketGateway({ cors: { origin: '*' } })
export class CollaborationGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  /** noteId -> set of userIds in that note */
  private presence = new Map<string, Set<string>>();
  /** socketId -> { noteId, userId } for cleanup on disconnect */
  private socketToNote = new Map<string, { noteId: string; userId: string }>();

  handleDisconnect(client: Socket) {
    const entry = this.socketToNote.get(client.id);
    if (entry) {
      this.removePresence(entry.noteId, entry.userId);
      this.socketToNote.delete(client.id);
      this.broadcastPresence(entry.noteId);
    }
  }

  private broadcastPresence(noteId: string) {
    const set = this.presence.get(noteId);
    const userIds = set ? Array.from(set) : [];
    this.server.to(room(noteId)).emit('presence-update', { noteId, userIds });
  }

  @SubscribeMessage('join-note')
  handleJoinNote(
    @MessageBody() payload: { noteId: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { noteId, userId } = payload;
    if (!noteId || !userId) return;

    const prev = this.socketToNote.get(client.id);
    if (prev) {
      this.removePresence(prev.noteId, prev.userId);
      client.leave(room(prev.noteId));
      this.server.to(room(prev.noteId)).emit('user-left', { userId: prev.userId });
    }

    const r = room(noteId);
    client.join(r);
    this.socketToNote.set(client.id, { noteId, userId });
    this.addPresence(noteId, userId);
    this.broadcastPresence(noteId);
  }

  @SubscribeMessage('leave-note')
  handleLeaveNote(
    @MessageBody() payload: { noteId: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { noteId, userId } = payload;
    if (!noteId || !userId) return;
    client.leave(room(noteId));
    this.removePresence(noteId, userId);
    this.socketToNote.delete(client.id);
    this.broadcastPresence(noteId);
  }

  @SubscribeMessage('edit-note')
  handleEditNote(
    @MessageBody() payload: { noteId: string; [key: string]: unknown },
    @ConnectedSocket() client: Socket,
  ) {
    const { noteId, ...edit } = payload;
    if (!noteId) return;
    client.to(room(noteId)).emit('edit-note', edit);
  }

  @SubscribeMessage('cursor-position')
  handleCursorPosition(
    @MessageBody() payload: { noteId: string; userId: string; cursorPosition: number },
    @ConnectedSocket() client: Socket,
  ) {
    const { noteId, ...rest } = payload;
    if (!noteId) return;
    client.to(room(noteId)).emit('cursor-position', rest);
  }

  getPresence(): Map<string, Set<string>> {
    return new Map(this.presence);
  }

  private addPresence(noteId: string, userId: string) {
    let set = this.presence.get(noteId);
    if (!set) {
      set = new Set();
      this.presence.set(noteId, set);
    }
    set.add(userId);
  }

  private removePresence(noteId: string, userId: string) {
    const set = this.presence.get(noteId);
    if (set) {
      set.delete(userId);
      if (set.size === 0) this.presence.delete(noteId);
    }
  }
}
