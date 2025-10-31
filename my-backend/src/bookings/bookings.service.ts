import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking } from './entities/booking.entity';
import { Slot } from '../slots/entities/slot.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    @InjectRepository(Slot)
    private slotsRepository: Repository<Slot>,
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    const slot = await this.slotsRepository.findOne({
      where: { id: createBookingDto.slot_id },
      relations: ['experience'],
    });

    if (!slot) {
      throw new NotFoundException('Slot not found');
    }

    // Enforce per-slot capacity
    const slotBookingCount = await this.bookingsRepository.count({
      where: { slot: { id: slot.id } as any },
    });
    if (slot.capacity > 0 && slotBookingCount >= slot.capacity) {
      slot.is_booked = true;
      await this.slotsRepository.save(slot);
      throw new ConflictException('Slot capacity reached');
    }

    // Enforce per-experience capacity (0 means unlimited)
    if (slot.experience && (slot.experience as any).capacity > 0) {
      const experienceBookingCount = await this.bookingsRepository.count({
        where: { slot: { experience: { id: slot.experience.id } } as any },
      });
      if (experienceBookingCount >= (slot.experience as any).capacity) {
        throw new ConflictException('Experience capacity reached');
      }
    }

    // Create booking and attach relation so slot_id is persisted
    const booking = this.bookingsRepository.create({
      user_name: createBookingDto.user_name,
      user_email: createBookingDto.user_email,
    });
    booking.slot = slot;
    const savedBooking = await this.bookingsRepository.save(booking);

    // If after saving, slot has reached capacity, mark as booked
    const updatedSlotBookingCount = await this.bookingsRepository.count({
      where: { slot: { id: slot.id } as any },
    });
    if (slot.capacity > 0 && updatedSlotBookingCount >= slot.capacity && !slot.is_booked) {
      slot.is_booked = true;
      await this.slotsRepository.save(slot);
    }

    return savedBooking;
  }
}
