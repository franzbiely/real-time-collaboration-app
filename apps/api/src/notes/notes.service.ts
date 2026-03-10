import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note } from './schemas/note.schema';

@Injectable()
export class NotesService {
  constructor(@InjectModel(Note.name) private noteModel: Model<Note>) {}

  async findAll() {
    return this.noteModel.find().sort({ updatedAt: -1 }).lean().exec();
  }

  async findOne(id: string) {
    const note = await this.noteModel.findById(id).lean().exec();
    if (!note) throw new NotFoundException('Note not found');
    return note;
  }

  async create(title: string, createdBy: string) {
    const note = await this.noteModel.create({
      title: title || 'Untitled',
      content: '',
      createdBy,
      participantIds: [createdBy],
    });
    return note.toObject();
  }

  async updateContent(id: string, content: string) {
    const note = await this.noteModel
      .findByIdAndUpdate(id, { content, updatedAt: new Date() }, { new: true })
      .lean()
      .exec();
    if (!note) throw new NotFoundException('Note not found');
    return note;
  }
}
