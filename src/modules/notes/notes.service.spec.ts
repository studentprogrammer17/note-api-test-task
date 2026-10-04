import { Test, TestingModule } from '@nestjs/testing';
import { NotesService } from './notes.service';
import { getModelToken } from '@nestjs/mongoose';
import { Note, NoteSchema } from './notes.schema';
import { BadRequestException } from '@nestjs/common';
import mongoose, { Types } from 'mongoose';

describe('NotesService', () => {
  let service: NotesService;
  let model: any;

  beforeEach(async () => {
    const mockModel = {
      create: jest.fn(),
      find: jest.fn().mockReturnValue({ exec: jest.fn() }),
      findById: jest.fn().mockReturnValue({ exec: jest.fn() }),
      findByIdAndUpdate: jest.fn().mockReturnValue({ exec: jest.fn() }),
      findByIdAndDelete: jest.fn().mockReturnValue({ exec: jest.fn() }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesService,
        {
          provide: getModelToken(Note.name),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<NotesService>(NotesService);
    model = module.get(getModelToken(Note.name));
  });

  it('should create a note', async () => {
    const dto = { title: 'Test' };
    model.create.mockResolvedValue(dto);

    const result = await service.create(dto);
    expect(result).toEqual(dto);
    expect(model.create).toHaveBeenCalledWith(dto);
  });

  it('should return notes list', async () => {
    const result = [{ title: 'Note 1' }];
    model.find.mockReturnValue({ exec: jest.fn().mockResolvedValue(result) });

    const notes = await service.findAll();
    expect(notes).toEqual(result);
    expect(model.find).toHaveBeenCalledWith({});
  });

  it('should return a single note by ID', async () => {
    const id = new Types.ObjectId().toHexString();
    const note = { title: 'Note 1' };
    model.findById.mockReturnValue({ exec: jest.fn().mockResolvedValue(note) });

    const found = await service.findOne(id);
    expect(found).toEqual(note);
    expect(model.findById).toHaveBeenCalledWith(id);
  });

  it('should update a note', async () => {
    const id = new Types.ObjectId().toHexString();
    const dto = { title: 'Updated' };
    const updatedNote = { _id: id, ...dto };
    model.findByIdAndUpdate.mockReturnValue({
      exec: jest.fn().mockResolvedValue(updatedNote),
    });

    const result = await service.update(id, dto);
    expect(result).toEqual(updatedNote);
    expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
      id,
      dto,
      expect.objectContaining({ new: true, runValidators: true }),
    );
  });

  it('should return a descriptive 400 when update fails validation', async () => {
    const id = new Types.ObjectId().toHexString();
    const NoteModel = mongoose.model('NoteValidationSpec', NoteSchema);
    const validationError = new NoteModel({
      title: 'Test',
      tags: { invalid: true },
    }).validateSync();
    expect(validationError).toBeDefined();
    model.findByIdAndUpdate.mockReturnValue({
      exec: jest.fn().mockRejectedValue(validationError),
    });

    const promise = service.update(id, { tags: 'work' as any });
    await expect(promise).rejects.toBeInstanceOf(BadRequestException);
    await expect(promise).rejects.toThrow(/tags/);
  });

  it('should delete a note', async () => {
    const id = new Types.ObjectId().toHexString();
    const deletedNote = { _id: id, title: 'To Delete' };
    model.findByIdAndDelete.mockReturnValue({
      exec: jest.fn().mockResolvedValue(deletedNote),
    });

    const result = await service.delete(id);
    expect(result).toEqual(deletedNote);
    expect(model.findByIdAndDelete).toHaveBeenCalledWith(id);
  });
});
