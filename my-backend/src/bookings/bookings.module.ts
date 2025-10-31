import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Booking } from './entities/booking.entity';
import { Slot } from '../slots/entities/slot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Slot])],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
