import { Test } from '@nestjs/testing';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';

describe('BookingsController', () => {
  let controller: BookingsController;
  const svc = { create: jest.fn() } as unknown as jest.Mocked<BookingsService>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [BookingsController],
      providers: [{ provide: BookingsService, useValue: svc }],
    }).compile();
    controller = moduleRef.get(BookingsController);
  });

  it('create forwards to service and returns booking', async () => {
    (svc.create as any).mockResolvedValue({ id: 1, user_name: 'A' });
    const res = await controller.create({ slot_id: 1, user_name: 'A', user_email: 'a@a.com' } as any);
    expect(res).toEqual({ id: 1, user_name: 'A' });
    expect(svc.create).toHaveBeenCalledWith({ slot_id: 1, user_name: 'A', user_email: 'a@a.com' });
  });
});
