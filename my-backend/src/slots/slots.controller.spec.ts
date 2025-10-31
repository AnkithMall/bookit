import { Test } from '@nestjs/testing';
import { SlotsController } from './slots.controller';
import { SlotsService } from './slots.service';

describe('SlotsController', () => {
  let controller: SlotsController;
  const svc = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  } as any;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [SlotsController],
      providers: [{ provide: SlotsService, useValue: svc }],
    }).compile();
    controller = moduleRef.get(SlotsController);
  });

  it('create delegates to service', async () => {
    svc.create.mockResolvedValue('ok');
    await expect(controller.create({} as any)).resolves.toBe('ok');
  });

  it('findAll', async () => {
    svc.findAll.mockResolvedValue('all');
    await expect(controller.findAll()).resolves.toBe('all');
  });

  it('findOne', async () => {
    svc.findOne.mockResolvedValue('one');
    await expect(controller.findOne('3')).resolves.toBe('one');
    expect(svc.findOne).toHaveBeenCalledWith(3);
  });

  it('update', async () => {
    svc.update.mockResolvedValue('upd');
    await expect(controller.update('2', {} as any)).resolves.toBe('upd');
    expect(svc.update).toHaveBeenCalledWith(2, {});
  });

  it('remove', async () => {
    svc.remove.mockResolvedValue('rem');
    await expect(controller.remove('5')).resolves.toBe('rem');
    expect(svc.remove).toHaveBeenCalledWith(5);
  });
});
