import { Module } from '@nestjs/common';
import { PromoService } from './promo.service';
import { PromoController } from './promo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Promo } from './entities/promo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Promo])],
  controllers: [PromoController],
  providers: [PromoService],
})
export class PromoModule {}
