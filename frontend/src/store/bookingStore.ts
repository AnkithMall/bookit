import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface BookingState {
  experienceId: number | null;
  date: string | null;
  time: string | null;
  slotId: number | null;
  quantity: number;
  setExperienceId: (id: number) => void;
  setDate: (date: string) => void;
  setTime: (time: string) => void;
  setSlotId: (slotId: number) => void;
  setQuantity: (quantity: number) => void;
}

export const useBookingStore = create<BookingState>()(
  immer((set) => ({
    experienceId: null,
    date: null,
    time: null,
    slotId: null,
    quantity: 1,
    setExperienceId: (id) => set({ experienceId: id }),
    setDate: (date) => set({ date }),
    setTime: (time) => set({ time }),
    setSlotId: (slotId) => set({ slotId }),
    setQuantity: (quantity) => set({ quantity }),
  }))
);
