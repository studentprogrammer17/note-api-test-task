import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Note, NoteDocument } from './notes.schema';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(@InjectModel(Note.name) private noteModel: Model<NoteDocument>) {}

  async create(dto: CreateNoteDto) {
    try {
      return await this.noteModel.create(dto);
    } catch (err) {
      throw new BadRequestException('Failed to create note: ', err);
    }
  }

  async findAll(tag?: string) {
    try {
      const filter = tag ? { tags: tag } : {};
      return await this.noteModel.find(filter).exec();
    } catch (err) {
      throw new InternalServerErrorException('Failed to get notes: ', err);
    }
  }

  async findOne(id: string) {
    try {
      this.validateObjectId(id);
      const note = await this.noteModel.findById(id).exec();
      if (!note) {
        throw new NotFoundException(`Note with ID "${id}" not found`);
      }
      return note;
    } catch (err) {
      if (
        err instanceof BadRequestException ||
        err instanceof NotFoundException
      ) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to get note: ', err);
    }
  }

  async update(id: string, dto: UpdateNoteDto) {
    try {
      this.validateObjectId(id);
      const updated = await this.noteModel
        .findByIdAndUpdate(id, dto, {
          new: true,
          runValidators: true,
        })
        .exec();
      if (!updated) {
        throw new NotFoundException(`Note with ID "${id}" not found`);
      }
      return updated;
    } catch (err) {
      if (
        err instanceof BadRequestException ||
        err instanceof NotFoundException
      ) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to update note: ', err);
    }
  }

  async delete(id: string) {
    try {
      this.validateObjectId(id);
      const deleted = await this.noteModel.findByIdAndDelete(id).exec();
      if (!deleted) {
        throw new NotFoundException(`Note with ID "${id}" not found`);
      }
      return deleted;
    } catch (err) {
      if (
        err instanceof BadRequestException ||
        err instanceof NotFoundException
      ) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to delete note: ', err);
    }
  }

  private validateObjectId(id: string) {
    if (!id || !isValidObjectId(id)) {
      throw new BadRequestException(`Invalid or missing MongoDB ObjectId`);
    }
  }
}
