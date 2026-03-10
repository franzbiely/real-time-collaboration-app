import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note, NoteDocument } from './schemas/note.schema';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(@InjectModel(Note.name) private noteModel: Model<NoteDocument>) {}

  async create(dto: CreateNoteDto): Promise<NoteDocument> {
    const created = new this.noteModel({
      ...dto,
      collaborators: dto.collaborators ?? [],
    });
    return created.save();
  }

  async findOne(id: string): Promise<NoteDocument> {
    const note = await this.noteModel.findById(id).exec();
    if (!note) throw new NotFoundException(`Note ${id} not found`);
    return note;
  }

  async update(id: string, dto: UpdateNoteDto): Promise<NoteDocument> {
    const note = await this.noteModel
      .findByIdAndUpdate(id, { $set: dto }, { new: true })
      .exec();
    if (!note) throw new NotFoundException(`Note ${id} not found`);
    return note;
  }

  async remove(id: string): Promise<void> {
    const result = await this.noteModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Note ${id} not found`);
  }
}
