import { Test } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Slot } from '../slots/entities/slot.entity';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';

function createRepoMock() {
  return {
    findOne: jest.fn(),
    count: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  } as any;
}

describe('BookingsService', () => {
  let service: BookingsService;
  let bookingsRepo: Partial<Repository<Booking>> & { [k: string]: jest.Mock };
  let slotsRepo: Partial<Repository<Slot>> & { [k: string]: jest.Mock };

  beforeEach(async () => {
    bookingsRepo = createRepoMock();
    slotsRepo = createRepoMock();

    const moduleRef = await Test.createTestingModule({
      providers: [
        BookingsService,
        { provide: getRepositoryToken(Booking), useValue: bookingsRepo },
        { provide: getRepositoryToken(Slot), useValue: slotsRepo },
      ],
    }).compile();

    service = moduleRef.get(BookingsService);
  });

  it('throws NotFound when slot does not exist', async () => {
    (slotsRepo.findOne as jest.Mock).mockResolvedValue(null);
    await expect(
      service.create({ slot_id: 1, user_name: 'A', user_email: 'a@a.com' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('throws Conflict when slot capacity reached before save and marks slot booked', async () => {
    const slot: any = { id: 1, capacity: 1, is_booked: false, experience: { id: 10 } };
    (slotsRepo.findOne as jest.Mock).mockResolvedValue(slot);
    // existing bookings for slot already 1
    (bookingsRepo.count as jest.Mock).mockResolvedValueOnce(1);

    await expect(
      service.create({ slot_id: 1, user_name: 'A', user_email: 'a@a.com' }),
    ).rejects.toBeInstanceOf(ConflictException);

    expect(slot.is_booked).toBe(true);
    expect(slotsRepo.save).toHaveBeenCalledWith(slot);
  });

  it('throws Conflict when experience capacity reached', async () => {
    const slot: any = { id: 1, capacity: 0, is_booked: false, experience: { id: 10, capacity: 1 } };
    (slotsRepo.findOne as jest.Mock).mockResolvedValue(slot);
    // first count for slot capacity check
    (bookingsRepo.count as jest.Mock).mockResolvedValueOnce(0);
    // second count for experience capacity check
    (bookingsRepo.count as jest.Mock).mockResolvedValueOnce(1);

    await expect(
      service.create({ slot_id: 1, user_name: 'A', user_email: 'a@a.com' }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('creates booking successfully and does not mark slot booked when capacity not reached', async () => {
    const slot: any = { id: 1, capacity: 2, is_booked: false, experience: { id: 10, capacity: 0 } };
    (slotsRepo.findOne as jest.Mock).mockResolvedValue(slot);
    // pre-save slot bookings = 0
    (bookingsRepo.count as jest.Mock).mockResolvedValueOnce(0);

    const bookingInput = { slot_id: 1, user_name: 'A', user_email: 'a@a.com' };
    const created = { ...bookingInput } as any;
    const saved = { id: 123, ...bookingInput } as any;
    (bookingsRepo.create as jest.Mock).mockReturnValue(created);
    (bookingsRepo.save as jest.Mock).mockResolvedValue(saved);

    // after save count = 1, still below capacity 2
    (bookingsRepo.count as jest.Mock).mockResolvedValueOnce(1);

    const result = await service.create(bookingInput);
    expect(result).toEqual(saved);
    expect(slot.is_booked).toBe(false);
  });

  it('marks slot booked after save when capacity reached', async () => {
    const slot: any = { id: 1, capacity: 1, is_booked: false, experience: { id: 10, capacity: 0 } };
    (slotsRepo.findOne as jest.Mock).mockResolvedValue(slot);
    // pre-save slot bookings = 0
    (bookingsRepo.count as jest.Mock).mockResolvedValueOnce(0);

    const saved = { id: 1 } as any;
    (bookingsRepo.create as jest.Mock).mockReturnValue({} as any);
    (bookingsRepo.save as jest.Mock).mockResolvedValue(saved);

    // after save, count = 1 equals capacity
    (bookingsRepo.count as jest.Mock).mockResolvedValueOnce(1);

    const result = await service.create({ slot_id: 1, user_name: 'A', user_email: 'a@a.com' });
    expect(result).toEqual(saved);
    expect(slot.is_booked).toBe(true);
    expect(slotsRepo.save).toHaveBeenCalledWith(slot);
  });
});
