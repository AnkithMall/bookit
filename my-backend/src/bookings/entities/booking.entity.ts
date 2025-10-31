
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Slot } from '../../slots/entities/slot.entity';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_name: string;

  @Column()
  user_email: string;

  @ManyToOne(() => Slot, (slot) => slot.bookings, { eager: false })
  @JoinColumn()
  slot: Slot;
}
