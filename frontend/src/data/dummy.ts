export interface Slot {
  id: number;
  start_time: string;
  end_time: string;
  isBooked: boolean;
}

export interface Experience {
  id: number;
  name: string;
  location: string;
  description: string;
  price: number;
  image: string;
  about: string;
  slots: Slot[];
}

export const dummyExperiences: Experience[] = [
  {
    id: 1,
    name: "Mountain Hiking Adventure",
    location: "Swiss Alps",
    description:
      "A thrilling hike through the scenic mountains of the Swiss Alps. This adventure is perfect for nature lovers and thrill-seekers.",
    price: 150,
    image:
      "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    about:
      "This guided hike takes you through some of the most breathtaking trails in the Swiss Alps. We provide all the necessary gear and a professional guide to ensure a safe and memorable experience.",
    slots: [
      { id: 1, start_time: "09:00", end_time: "11:00", isBooked: false },
      { id: 2, start_time: "11:00", end_time: "13:00", isBooked: true },
      { id: 3, start_time: "13:00", end_time: "15:00", isBooked: false },
      { id: 4, start_time: "15:00", end_time: "17:00", isBooked: false },
      { id: 5, start_time: "17:00", end_time: "19:00", isBooked: false },
    ],
  },
  {
    id: 2,
    name: "Beach Paradise Getaway",
    location: "Maldives",
    description:
      "Relax and unwind on the beautiful sandy beaches of the Maldives. Enjoy the crystal clear water and the stunning sunsets.",
    price: 300,
    image:
      "https://images.unsplash.com/photo-1507525428034-b723a9ce6890?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    about:
      "This package includes a stay at a luxury resort, access to private beaches, and a variety of water sports. It is the perfect getaway for couples and families.",
    slots: [
      { id: 6, start_time: "10:00", end_time: "12:00", isBooked: false },
      { id: 7, start_time: "12:00", end_time: "14:00", isBooked: false },
      { id: 8, start_time: "14:00", end_time: "16:00", isBooked: true },
      { id: 9, start_time: "16:00", end_time: "18:00", isBooked: false },
      { id: 10, start_time: "18:00", end_time: "20:00", isBooked: false },
    ],
  },
  {
    id: 3,
    name: "City Exploration Tour",
    location: "Tokyo",
    description:
      "Discover the hidden gems of Tokyo with our guided tour. From ancient temples to modern skyscrapers, this tour has it all.",
    price: 100,
    image:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    about:
      "Our experienced guides will take you to the most iconic landmarks of Tokyo, as well as some hidden gems that only locals know about. This tour is perfect for first-time visitors.",
    slots: [
      { id: 11, start_time: "09:00", end_time: "11:00", isBooked: false },
      { id: 12, start_time: "11:00", end_time: "13:00", isBooked: false },
      { id: 13, start_time: "13:00", end_time: "15:00", isBooked: false },
      { id: 14, start_time: "15:00", end_time: "17:00", isBooked: true },
      { id: 15, start_time: "17:00", end_time: "19:00", isBooked: false },
    ],
  },
];
