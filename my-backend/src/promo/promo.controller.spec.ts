import { Test } from '@nestjs/testing';
import { PromoController } from './promo.controller';
import { PromoService } from './promo.service';

describe('PromoController', () => {
  let controller: PromoController;
  const svc = { validate: jest.fn() } as unknown as jest.Mocked<PromoService>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [PromoController],
      providers: [{ provide: PromoService, useValue: svc }],
    }).compile();
    controller = moduleRef.get(PromoController);
  });

  it('validate forwards to service and returns result', async () => {
    (svc.validate as any).mockResolvedValue({ code: 'SAVE10', amount: 10, discountType: 'percent' });
    const res = await controller.validate({ code: 'SAVE10' });
    expect(res).toEqual({ code: 'SAVE10', amount: 10, discountType: 'percent' });
    expect(svc.validate).toHaveBeenCalledWith({ code: 'SAVE10' });
  });
});
