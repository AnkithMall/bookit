import { Test } from '@nestjs/testing';
import { SlotsService } from './slots.service';

describe('SlotsService', () => {
  let service: SlotsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [SlotsService],
    }).compile();
    service = moduleRef.get(SlotsService);
  });

  it('create returns expected string', () => {
    expect(service.create({} as any)).toBe('This action adds a new slot');
  });

  it('findAll returns expected string', () => {
    expect(service.findAll()).toBe('This action returns all slots');
  });

  it('findOne returns expected string with id', () => {
    expect(service.findOne(5)).toBe('This action returns a #5 slot');
  });

  it('update returns expected string with id', () => {
    expect(service.update(7, {} as any)).toBe('This action updates a #7 slot');
  });

  it('remove returns expected string with id', () => {
    expect(service.remove(9)).toBe('This action removes a #9 slot');
  });
});
