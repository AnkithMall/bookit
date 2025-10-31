import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export type DiscountType = 'percent' | 'flat';

@Entity('promos')
export class Promo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column({ type: 'varchar' })
  discountType: DiscountType; // 'percent' | 'flat'

  @Column({ type: 'float' })
  amount: number; // percentage (0-100) or flat amount

  @Column({ default: true })
  active: boolean;

  @Column({ type: 'timestamp', nullable: true })
  validFrom?: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  validTo?: Date | null;

  @Column({ type: 'int', nullable: true })
  usageLimit?: number | null;

  @Column({ type: 'int', default: 0 })
  usageCount: number;
}
