import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Socket } from 'socket.io';
import { NotesService } from '../notes/notes.service';

@WebSocketGateway({
  cors: { origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000' },
})
export class NotesGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly notesService: NotesService) {}

  @SubscribeMessage('note:join')
  handleJoin(
    @MessageBody() payload: { noteId: string; user: { id: string; name: string } },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(payload.noteId);
    this.server.to(payload.noteId).emit('note:joined', payload);
    return { event: 'note:join', data: payload };
  }

  @SubscribeMessage('note:edit')
  async handleEdit(
    @MessageBody() payload: { noteId: string; content: string; userId: string },
  ) {
    await this.notesService.updateContent(payload.noteId, payload.content);
    this.server.to(payload.noteId).emit('note:updated', payload);
    return { event: 'note:edit', data: payload };
  }

  @SubscribeMessage('cursor:move')
  handleCursor(@MessageBody() payload: unknown) {
    return { event: 'cursor:move', data: payload };
  }
}
