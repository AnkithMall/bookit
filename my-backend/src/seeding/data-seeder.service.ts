import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Experience } from '../experiences/entities/experience.entity';
import { Slot } from '../slots/entities/slot.entity';
import { Promo } from '../promo/entities/promo.entity';

@Injectable()
export class DataSeederService implements OnApplicationBootstrap {
  private readonly logger = new Logger(DataSeederService.name);

  constructor(
    @InjectRepository(Experience) private readonly expRepo: Repository<Experience>,
    @InjectRepository(Slot) private readonly slotRepo: Repository<Slot>,
    @InjectRepository(Promo) private readonly promoRepo: Repository<Promo>,
  ) {}

  async onApplicationBootstrap() {
    // ensure tables exist: with TypeORM synchronize true, entities create tables
    await this.seedIfEmpty();
  }

  private async seedIfEmpty() {
    const [expCount, slotCount, promoCount] = await Promise.all([
      this.expRepo.count(),
      this.slotRepo.count(),
      this.promoRepo.count(),
    ]);

    if (expCount === 0) {
      await this.seedExperiencesAndSlots();
    }

    if (promoCount === 0) {
      await this.seedPromos();
    }

    const [finalExp, finalSlot, finalPromo] = await Promise.all([
      this.expRepo.count(),
      this.slotRepo.count(),
      this.promoRepo.count(),
    ]);

    this.logger.log(`Seeding summary -> experiences: ${finalExp}, slots: ${finalSlot}, promos: ${finalPromo}`);
  }

  private async seedPromos() {
    const promos: Partial<Promo>[] = [
      { code: 'SAVE10', discountType: 'percent', amount: 10, active: true },
      { code: 'FLAT100', discountType: 'flat', amount: 100, active: true },
    ];
    await this.promoRepo.save(promos);
    this.logger.log(`Inserted ${promos.length} promo codes`);
  }

  private async seedExperiencesAndSlots() {
    const experiences = [
      {
        name: 'Mountain Hiking Adventure',
        location: 'Himalayas',
        description:
          'Experience the thrill of hiking through breathtaking mountain trails with experienced guides.',
        price: 199.99,
        image:
          'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop',
        about:
          'A full-day guided hiking adventure through scenic mountain trails. Includes lunch and equipment.',
        slots: [
          { start_time: '2025-11-10 06:00:00', end_time: '2025-11-10 18:00:00', is_booked: false },
          { start_time: '2025-11-11 06:00:00', end_time: '2025-11-11 18:00:00', is_booked: false },
        ],
      },
      {
        name: 'Beachside Yoga Retreat',
        location: 'Goa',
        description:
          'Relax and rejuvenate with daily yoga sessions by the beach at sunrise and sunset.',
        price: 149.99,
        image:
          'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=1600&auto=format&fit=crop',
        about:
          '3-day retreat with professional yoga instructors. Includes accommodation and meals.',
        slots: [
          { start_time: '2025-11-15 06:00:00', end_time: '2025-11-15 07:30:00', is_booked: false },
          { start_time: '2025-11-15 17:00:00', end_time: '2025-11-15 18:30:00', is_booked: false },
        ],
      },
      {
        name: 'City Food Tour',
        location: 'Mumbai',
        description: 'Explore the diverse culinary scene with a local food expert.',
        price: 79.99,
        image:
          'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=1600&auto=format&fit=crop',
        about:
          '4-hour walking tour to sample the best street food in the city.',
        slots: [
          { start_time: '2025-11-20 11:00:00', end_time: '2025-11-20 15:00:00', is_booked: false },
          { start_time: '2025-11-21 11:00:00', end_time: '2025-11-21 15:00:00', is_booked: false },
        ],
      },
      {
        name: 'Wildlife Safari',
        location: 'Ranthambore',
        description: 'Spot tigers and other wildlife in their natural habitat.',
        price: 249.99,
        image:
          'https://images.unsplash.com/photo-1546182990-dffeafbe841d?q=80&w=1600&auto=format&fit=crop',
        about:
          'Full-day safari with experienced naturalist guide. Includes transportation and meals.',
        slots: [
          { start_time: '2025-11-25 05:30:00', end_time: '2025-11-25 19:00:00', is_booked: false },
        ],
      },
      {
        name: 'Heritage Walk',
        location: 'Delhi',
        description: 'Discover the rich history and architecture of Old Delhi.',
        price: 49.99,
        image:
          'https://images.unsplash.com/photo-1599661046289-b9e25af4f8a4?q=80&w=1600&auto=format&fit=crop',
        about:
          '3-hour guided walking tour covering major historical landmarks.',
        slots: [
          { start_time: '2025-11-30 09:00:00', end_time: '2025-11-30 12:00:00', is_booked: false },
          { start_time: '2025-12-01 09:00:00', end_time: '2025-12-01 12:00:00', is_booked: false },
        ],
      },
    ];

    for (const e of experiences) {
      const exp = this.expRepo.create({
        name: e.name,
        location: e.location,
        description: e.description,
        price: e.price,
        image: e.image,
        about: e.about,
      });
      const saved = await this.expRepo.save(exp);
      const slots = e.slots.map((s) => this.slotRepo.create({ ...s, experience: saved }));
      await this.slotRepo.save(slots);
    }

    this.logger.log(`Inserted ${experiences.length} experiences with slots`);
  }
}
