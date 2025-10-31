import { Injectable, BadRequestException } from '@nestjs/common';
import { ValidatePromoDto } from './dto/validate-promo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Promo } from './entities/promo.entity';

@Injectable()
export class PromoService {
  constructor(
    @InjectRepository(Promo) private readonly promoRepo: Repository<Promo>,
  ) {}

  validate(validatePromoDto: ValidatePromoDto) {
    const { code } = validatePromoDto;
    if (!code) throw new BadRequestException('Promo code is required');

    return this.promoRepo.findOne({ where: { code } }).then((promo) => {
      if (!promo || !promo.active) {
        throw new BadRequestException('Invalid promo code');
      }
      const now = new Date();
      if (promo.validFrom && now < new Date(promo.validFrom)) {
        throw new BadRequestException('Promo code not yet active');
      }
      if (promo.validTo && now > new Date(promo.validTo)) {
        throw new BadRequestException('Promo code expired');
      }
      if (promo.usageLimit != null && promo.usageCount >= promo.usageLimit) {
        throw new BadRequestException('Promo code usage limit reached');
      }

      return {
        message: 'Promo code is valid',
        discountType: promo.discountType,
        amount: promo.amount,
        code: promo.code,
      };
    });
  }
}
