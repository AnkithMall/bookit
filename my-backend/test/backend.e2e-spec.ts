import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExperiencesModule } from '../src/experiences/experiences.module';
import { SlotsModule } from '../src/slots/slots.module';
import { BookingsModule } from '../src/bookings/bookings.module';
import { PromoModule } from '../src/promo/promo.module';
import { Experience } from '../src/experiences/entities/experience.entity';
import { Slot } from '../src/slots/entities/slot.entity';
import { Booking } from '../src/bookings/entities/booking.entity';
import { Promo } from '../src/promo/entities/promo.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('Backend E2E', () => {
  let app: INestApplication;
  let expRepo: Repository<Experience>;
  let slotRepo: Repository<Slot>;
  let promoRepo: Repository<Promo>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [Experience, Slot, Booking, Promo],
          synchronize: true,
          logging: false,
        }),
        TypeOrmModule.forFeature([Experience, Slot, Booking, Promo]),
        ExperiencesModule,
        SlotsModule,
        BookingsModule,
        PromoModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    expRepo = moduleFixture.get<Repository<Experience>>(getRepositoryToken(Experience));
    slotRepo = moduleFixture.get<Repository<Slot>>(getRepositoryToken(Slot));
    promoRepo = moduleFixture.get<Repository<Promo>>(getRepositoryToken(Promo));

    // seed minimal data
    const exp = await expRepo.save(
      expRepo.create({
        name: 'Test Experience',
        location: 'Test City',
        description: 'Desc',
        price: 100,
        image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
        about: 'About',
      }),
    );
    await slotRepo.save(
      slotRepo.create({ start_time: '2025-11-10 06:00:00', end_time: '2025-11-10 07:00:00', is_booked: false, experience: exp }),
    );
    await promoRepo.save([
      promoRepo.create({ code: 'SAVE10', discountType: 'percent', amount: 10, active: true }),
      promoRepo.create({ code: 'FLAT100', discountType: 'flat', amount: 100, active: true }),
    ]);
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /experiences should return list', async () => {
    const res = await request(app.getHttpServer()).get('/experiences').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('GET /experiences/:id should return details', async () => {
    const listRes = await request(app.getHttpServer()).get('/experiences').expect(200);
    const first = listRes.body[0];
    const res = await request(app.getHttpServer()).get(`/experiences/${first.id}`).expect(200);
    expect(res.body).toHaveProperty('id', first.id);
  });

  it('POST /promo/validate should accept valid code', async () => {
    const res = await request(app.getHttpServer())
      .post('/promo/validate')
      .send({ code: 'SAVE10' })
      .expect(201);
    expect(res.body).toMatchObject({ code: 'SAVE10', discountType: 'percent' });
  });

  it('POST /promo/validate should reject invalid code', async () => {
    await request(app.getHttpServer())
      .post('/promo/validate')
      .send({ code: 'NOPE' })
      .expect(400);
  });

  it('POST /bookings should create booking', async () => {
    const listRes = await request(app.getHttpServer()).get('/experiences').expect(200);
    const exp = listRes.body[0];
    const slotId = exp.slots?.[0]?.id;
    const res = await request(app.getHttpServer())
      .post('/bookings')
      .send({ slot_id: slotId, user_name: 'John', user_email: 'john@example.com' })
      .expect(201);
    expect(res.body).toHaveProperty('id');
  });
});
