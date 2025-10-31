
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Experience } from './experiences/entities/experience.entity';
import { Slot } from './slots/entities/slot.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const experienceRepository = app.get(getRepositoryToken(Experience));
  const slotRepository = app.get(getRepositoryToken(Slot));

  const experiences_data = [
        {
            name: "Mountain Hiking Adventure",
            location: "Swiss Alps",
            description: "A thrilling hike through the scenic mountains of the Swiss Alps. This adventure is perfect for nature lovers and thrill-seekers.",
            price: 150,
            image: "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            about: "This guided hike takes you through some of the most breathtaking trails in the Swiss Alps. We provide all the necessary gear and a professional guide to ensure a safe and memorable experience.",
            slots: [
                {start_time: "09:00", end_time: "11:00", is_booked: false},
                {start_time: "11:00", end_time: "13:00", is_booked: true},
                {start_time: "13:00", end_time: "15:00", is_booked: false},
                {start_time: "15:00", end_time: "17:00", is_booked: false},
                {start_time: "17:00", end_time: "19:00", is_booked: false},
            ],
        },
        {
            name: "Beach Paradise Getaway",
            location: "Maldives",
            description: "Relax and unwind on the beautiful sandy beaches of the Maldives. Enjoy the crystal clear water and the stunning sunsets.",
            price: 300,
            image: "https://images.unsplash.com/photo-1507525428034-b723a9ce6890?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            about: "This package includes a stay at a luxury resort, access to private beaches, and a variety of water sports. It is the perfect getaway for couples and families.",
            slots: [
                {start_time: "10:00", end_time: "12:00", is_booked: false},
                {start_time: "12:00", end_time: "14:00", is_booked: false},
                {start_time: "14:00", end_time: "16:00", is_booked: true},
                {start_time: "16:00", end_time: "18:00", is_booked: false},
                {start_time: "18:00", end_time: "20:00", is_booked: false},
            ],
        },
        {
            name: "City Exploration Tour",
            location: "Tokyo",
            description: "Discover the hidden gems of Tokyo with our guided tour. From ancient temples to modern skyscrapers, this tour has it all.",
            price: 100,
            image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            about: "Our experienced guides will take you to the most iconic landmarks of Tokyo, as well as some hidden gems that only locals know about. This tour is perfect for first-time visitors.",
            slots: [
                {start_time: "09:00", end_time: "11:00", is_booked: false},
                {start_time: "11:00", end_time: "13:00", is_booked: false},
                {start_time: "13:00", end_time: "15:00", is_booked: false},
                {start_time: "15:00", end_time: "17:00", is_booked: true},
                {start_time: "17:00", end_time: "19:00", is_booked: false},
            ],
        },
    ];

  for (const exp_data of experiences_data) {
    const experience = experienceRepository.create(exp_data);
    const savedExperience = await experienceRepository.save(experience);

    for (const slot_data of exp_data.slots) {
      const slot = slotRepository.create({...slot_data, experience: savedExperience });
      await slotRepository.save(slot);
    }
  }

  await app.close();
}

bootstrap();
