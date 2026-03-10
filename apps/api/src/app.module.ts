import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { NotesModule } from './notes/notes.module';
import { CollaborationModule } from './collaboration/collaboration.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI ?? 'mongodb://localhost:27017/collab'),
    UsersModule,
    NotesModule,
    CollaborationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
