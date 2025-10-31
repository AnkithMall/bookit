
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Slot } from '../../slots/entities/slot.entity';

@Entity('experiences')
export class Experience {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column()
  description: string;

  @Column('float')
  price: number;

  @Column()
  image: string;

  @Column()
  about: string;

  @Column({ type: 'int', default: 0 })
  capacity: number; // 0 means unlimited

  @OneToMany(() => Slot, slot => slot.experience)
  slots: Slot[];
}
