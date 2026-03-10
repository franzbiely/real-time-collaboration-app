import { Module } from '@nestjs/common';
import { NotesModule } from '../notes/notes.module';
import { NotesGateway } from './notes.gateway';

@Module({
  imports: [NotesModule],
  providers: [NotesGateway],
})
export class GatewayModule {}
