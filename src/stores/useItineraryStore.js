import { create } from 'zustand';

const useItineraryStore = create((set, get) => ({
  itinerary: { days: [], places: [], placeTrash: [] },
  activeDay: 1,
  activeItemId: null,
  isEditMode: true,
  isDirty: false,
  tripRegion: typeof window !== 'undefined' ? (localStorage.getItem('trip_region_hint') || '제주시') : '제주시',
  tripStartDate: typeof window !== 'undefined' ? (localStorage.getItem('trip_start_date') || '') : '',
  tripEndDate: typeof window !== 'undefined' ? (localStorage.getItem('trip_end_date') || '') : '',

  setItinerary: (v) => set((state) => ({
    itinerary: typeof v === 'function' ? v(state.itinerary) : v,
  })),
  setActiveDay: (v) => set({ activeDay: v }),
  setActiveItemId: (v) => set({ activeItemId: v }),
  setIsEditMode: (v) => set((state) => ({ isEditMode: typeof v === 'function' ? v(state.isEditMode) : v })),
  setIsDirty: (v) => set({ isDirty: v }),
  setTripRegion: (v) => set({ tripRegion: v }),
  setTripStartDate: (v) => set({ tripStartDate: v }),
  setTripEndDate: (v) => set({ tripEndDate: v }),
}));

export default useItineraryStore;
