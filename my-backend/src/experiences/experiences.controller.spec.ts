import { Test } from '@nestjs/testing';
import { ExperiencesController } from './experiences.controller';
import { ExperiencesService } from './experiences.service';

describe('ExperiencesController', () => {
  let controller: ExperiencesController;
  const svc = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  } as unknown as jest.Mocked<ExperiencesService>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ExperiencesController],
      providers: [{ provide: ExperiencesService, useValue: svc }],
    }).compile();
    controller = moduleRef.get(ExperiencesController);
  });

  it('create delegates to service', async () => {
    (svc.create as any).mockResolvedValue({ id: 1 });
    const res = await controller.create({} as any);
    expect(res).toEqual({ id: 1 });
    expect(svc.create).toHaveBeenCalled();
  });

  it('findAll returns list', async () => {
    (svc.findAll as any).mockResolvedValue([{ id: 1 }]);
    await expect(controller.findAll()).resolves.toEqual([{ id: 1 }]);
  });

  it('findOne returns entity', async () => {
    (svc.findOne as any).mockResolvedValue({ id: 2 });
    await expect(controller.findOne('2')).resolves.toEqual({ id: 2 });
    expect(svc.findOne).toHaveBeenCalledWith(2);
  });

  it('update returns updated', async () => {
    (svc.update as any).mockResolvedValue({ id: 3 });
    await expect(controller.update('3', {} as any)).resolves.toEqual({ id: 3 });
    expect(svc.update).toHaveBeenCalledWith(3, {});
  });

  it('remove returns result', async () => {
    (svc.remove as any).mockResolvedValue({ affected: 1 });
    await expect(controller.remove('4')).resolves.toEqual({ affected: 1 });
    expect(svc.remove).toHaveBeenCalledWith(4);
  });
});
