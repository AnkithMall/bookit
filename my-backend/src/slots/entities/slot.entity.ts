
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Experience } from '../../experiences/entities/experience.entity';
import { Booking } from '../../bookings/entities/booking.entity';

@Entity('slots')
export class Slot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  start_time: string;

  @Column()
  end_time: string;

  @Column({ default: false })
  is_booked: boolean;

  @Column({ type: 'int', default: 1 })
  capacity: number;

  @ManyToOne(() => Experience, experience => experience.slots)
  experience: Experience;

  @OneToMany(() => Booking, (booking) => booking.slot)
  bookings: Booking[];
}
