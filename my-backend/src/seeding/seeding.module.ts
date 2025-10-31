import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSeederService } from './data-seeder.service';
import { Experience } from '../experiences/entities/experience.entity';
import { Slot } from '../slots/entities/slot.entity';
import { Promo } from '../promo/entities/promo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Experience, Slot, Promo])],
  providers: [DataSeederService],
})
export class SeedingModule {}
