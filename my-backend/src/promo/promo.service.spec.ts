import { Test } from '@nestjs/testing';
import { PromoService } from './promo.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Promo } from './entities/promo.entity';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

describe('PromoService', () => {
  let service: PromoService;
  let repo: Partial<Repository<Promo>>;

  beforeEach(async () => {
    repo = {
      // cast to any so we can use jest mock helpers
      findOne: jest.fn() as any,
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        PromoService,
        {
          provide: getRepositoryToken(Promo),
          useValue: repo,
        },
      ],
    }).compile();

    service = moduleRef.get(PromoService);
  });

  it('returns discount details when code is valid and active', async () => {
    (repo.findOne as jest.Mock).mockResolvedValue({
      code: 'SAVE10',
      active: true,
      discountType: 'percent',
      amount: 10,
      usageCount: 0,
    } as Promo);

    const res = await service.validate({ code: 'SAVE10' });
    expect(res).toMatchObject({ code: 'SAVE10', discountType: 'percent', amount: 10 });
  });

  it('throws when code is missing', () => {
    expect(() => service.validate({ code: '' as any })).toThrow(BadRequestException);
  });

  it('throws when code is not found or inactive', async () => {
    (repo.findOne as jest.Mock).mockResolvedValue(null as any);
    await expect(service.validate({ code: 'NOPE' })).rejects.toBeInstanceOf(BadRequestException);

    (repo.findOne as jest.Mock).mockResolvedValue({ code: 'X', active: false } as any);
    await expect(service.validate({ code: 'X' })).rejects.toBeInstanceOf(BadRequestException);
  });

  it('throws when not yet active', async () => {
    const future = new Date(Date.now() + 24 * 60 * 60 * 1000);
    (repo.findOne as jest.Mock).mockResolvedValue({ code: 'LATER', active: true, validFrom: future } as any);
    await expect(service.validate({ code: 'LATER' })).rejects.toBeInstanceOf(BadRequestException);
  });

  it('throws when expired', async () => {
    const past = new Date(Date.now() - 24 * 60 * 60 * 1000);
    (repo.findOne as jest.Mock).mockResolvedValue({ code: 'OLD', active: true, validTo: past } as any);
    await expect(service.validate({ code: 'OLD' })).rejects.toBeInstanceOf(BadRequestException);
  });

  it('throws when usage limit reached', async () => {
    (repo.findOne as jest.Mock).mockResolvedValue({ code: 'USED', active: true, usageLimit: 1, usageCount: 1 } as any);
    await expect(service.validate({ code: 'USED' })).rejects.toBeInstanceOf(BadRequestException);
  });
});
