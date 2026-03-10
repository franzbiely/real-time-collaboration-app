import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Note extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ default: '' })
  content: string;

  @Prop({ required: true })
  createdBy: string;

  @Prop({ type: [String], default: [] })
  participantIds: string[];
}

export const NoteSchema = SchemaFactory.createForClass(Note);
