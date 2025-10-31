
import { Controller, Post, Body } from '@nestjs/common';
import { PromoService } from './promo.service';
import { ValidatePromoDto } from './dto/validate-promo.dto';

@Controller('promo')
export class PromoController {
  constructor(private readonly promoService: PromoService) {}

  @Post('validate')
  validate(@Body() validatePromoDto: ValidatePromoDto) {
    return this.promoService.validate(validatePromoDto);
  }
}
