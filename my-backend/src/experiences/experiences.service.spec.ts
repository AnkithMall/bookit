import { Test } from '@nestjs/testing';
import { ExperiencesService } from './experiences.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Experience } from './entities/experience.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

function createRepoMock() {
  return {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  } as any;
}

describe('ExperiencesService', () => {
  let service: ExperiencesService;
  let repo: Partial<Repository<Experience>> & { [k: string]: jest.Mock };

  beforeEach(async () => {
    repo = createRepoMock();

    const moduleRef = await Test.createTestingModule({
      providers: [
        ExperiencesService,
        { provide: getRepositoryToken(Experience), useValue: repo },
      ],
    }).compile();

    service = moduleRef.get(ExperiencesService);
  });

  it('create should save and return experience', async () => {
    (repo.create as jest.Mock).mockReturnValue({ name: 'X' });
    (repo.save as jest.Mock).mockResolvedValue({ id: 1, name: 'X' });
    const res = await service.create({} as any);
    expect(res).toEqual({ id: 1, name: 'X' });
    expect(repo.create).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalled();
  });

  it('findAll should include slots relation', async () => {
    (repo.find as jest.Mock).mockResolvedValue([{ id: 1 }]);
    const res = await service.findAll();
    expect(res).toEqual([{ id: 1 }]);
    expect(repo.find).toHaveBeenCalledWith({ relations: ['slots'] });
  });

  it('findOne returns entity or throws', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce({ id: 2 });
    await expect(service.findOne(2)).resolves.toEqual({ id: 2 });

    (repo.findOne as jest.Mock).mockResolvedValueOnce(null);
    await expect(service.findOne(99)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('update updates and returns latest entity', async () => {
    (repo.findOne as jest.Mock)
      .mockResolvedValueOnce({ id: 3 }) // exists check
      .mockResolvedValueOnce({ id: 3, name: 'Y' }); // after update fetch
    (repo.update as jest.Mock).mockResolvedValue({});

    const res = await service.update(3, { name: 'Y' } as any);
    expect(res).toEqual({ id: 3, name: 'Y' });
    expect(repo.update).toHaveBeenCalledWith(3, { name: 'Y' });
  });

  it('remove deletes or throws NotFound', async () => {
    (repo.delete as jest.Mock).mockResolvedValue({ affected: 0 });
    await expect(service.remove(1)).rejects.toBeInstanceOf(NotFoundException);

    (repo.delete as jest.Mock).mockResolvedValue({ affected: 1 });
    await expect(service.remove(1)).resolves.toBeUndefined();
  });
});
