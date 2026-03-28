import { create } from 'zustand';

const useMapStore = create((set, get) => ({
  mapEditMode: true,
  mapTileStyle: 0,
  overviewMapScope: 'all',
  overviewMapDayFilter: null,
  overviewMapRouteVisible: true,
  showOverviewLibraryPoints: false,
  hideLongRouteSegments: false,
  hiddenRoutePreviewEndpoints: {},
  focusedMapTarget: null,
  focusedLibraryMarkerId: null,
  mapQuickViewItem: null,
  qvDragOffset: { x: 0, y: 0 },
  panelMapScope: 'all',
  panelMapDayFilter: null,
  mapExpanded: false,

  setMapEditMode: (v) => set({ mapEditMode: typeof v === 'function' ? v(get().mapEditMode) : v }),
  setMapTileStyle: (v) => set({ mapTileStyle: typeof v === 'function' ? v(get().mapTileStyle) : v }),
  setOverviewMapScope: (v) => set({ overviewMapScope: v }),
  setOverviewMapDayFilter: (v) => set({ overviewMapDayFilter: v }),
  setOverviewMapRouteVisible: (v) => set({ overviewMapRouteVisible: typeof v === 'function' ? v(get().overviewMapRouteVisible) : v }),
  setShowOverviewLibraryPoints: (v) => set({ showOverviewLibraryPoints: typeof v === 'function' ? v(get().showOverviewLibraryPoints) : v }),
  setHideLongRouteSegments: (v) => set({ hideLongRouteSegments: typeof v === 'function' ? v(get().hideLongRouteSegments) : v }),
  setHiddenRoutePreviewEndpoints: (v) => set({ hiddenRoutePreviewEndpoints: typeof v === 'function' ? v(get().hiddenRoutePreviewEndpoints) : v }),
  setFocusedMapTarget: (v) => set({ focusedMapTarget: typeof v === 'function' ? v(get().focusedMapTarget) : v }),
  setFocusedLibraryMarkerId: (v) => set({ focusedLibraryMarkerId: v }),
  setMapQuickViewItem: (v) => set({ mapQuickViewItem: v }),
  setQvDragOffset: (v) => set({ qvDragOffset: v }),
  setPanelMapScope: (v) => set({ panelMapScope: v }),
  setPanelMapDayFilter: (v) => set({ panelMapDayFilter: v }),
  setMapExpanded: (v) => set({ mapExpanded: typeof v === 'function' ? v(get().mapExpanded) : v }),
}));

export default useMapStore;
