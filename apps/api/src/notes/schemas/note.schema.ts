import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NoteDocument = Note & Document;

@Schema({ timestamps: true })
export class Note {
  @Prop({ required: true })
  title: string;

  @Prop({ default: '' })
  content: string;

  @Prop({ required: true })
  ownerId: string;

  @Prop({ type: [String], default: [] })
  collaborators: string[];
}


export const NoteSchema = SchemaFactory.createForClass(Note);
