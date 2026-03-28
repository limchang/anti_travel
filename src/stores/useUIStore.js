import { create } from 'zustand';

const useUIStore = create((set) => ({
  // 모달 상태
  showPlanManager: false,
  showAiSettings: false,
  showChecklistModal: false,
  showSmartFillGuide: false,
  showUpdateModal: false,
  showDatePicker: false,
  showNavMenu: false,
  showTimelineOverlay: false,
  showPlanOptions: false,
  showBulkAddModal: false,
  showAddPlaceMenu: false,
  showPlaceMenu: false,
  showPlaceCategoryManager: false,

  // 패널 상태
  navFloatingExpanded: typeof window !== 'undefined' && window.innerWidth >= 1100,
  bottomPanelExpanded: typeof window !== 'undefined' && window.innerWidth >= 1100,

  // UI 강조
  highlightedPlaceId: null,

  // 토글 헬퍼
  setShowPlanManager: (v) => set({ showPlanManager: typeof v === 'function' ? v(useUIStore.getState().showPlanManager) : v }),
  setShowAiSettings: (v) => set({ showAiSettings: typeof v === 'function' ? v(useUIStore.getState().showAiSettings) : v }),
  setShowChecklistModal: (v) => set({ showChecklistModal: typeof v === 'function' ? v(useUIStore.getState().showChecklistModal) : v }),
  setShowSmartFillGuide: (v) => set({ showSmartFillGuide: typeof v === 'function' ? v(useUIStore.getState().showSmartFillGuide) : v }),
  setShowUpdateModal: (v) => set({ showUpdateModal: typeof v === 'function' ? v(useUIStore.getState().showUpdateModal) : v }),
  setShowDatePicker: (v) => set({ showDatePicker: typeof v === 'function' ? v(useUIStore.getState().showDatePicker) : v }),
  setShowNavMenu: (v) => set({ showNavMenu: typeof v === 'function' ? v(useUIStore.getState().showNavMenu) : v }),
  setShowTimelineOverlay: (v) => set({ showTimelineOverlay: typeof v === 'function' ? v(useUIStore.getState().showTimelineOverlay) : v }),
  setShowPlanOptions: (v) => set({ showPlanOptions: typeof v === 'function' ? v(useUIStore.getState().showPlanOptions) : v }),
  setShowBulkAddModal: (v) => set({ showBulkAddModal: typeof v === 'function' ? v(useUIStore.getState().showBulkAddModal) : v }),
  setShowAddPlaceMenu: (v) => set({ showAddPlaceMenu: typeof v === 'function' ? v(useUIStore.getState().showAddPlaceMenu) : v }),
  setShowPlaceMenu: (v) => set({ showPlaceMenu: typeof v === 'function' ? v(useUIStore.getState().showPlaceMenu) : v }),
  setShowPlaceCategoryManager: (v) => set({ showPlaceCategoryManager: typeof v === 'function' ? v(useUIStore.getState().showPlaceCategoryManager) : v }),
  setNavFloatingExpanded: (v) => set({ navFloatingExpanded: typeof v === 'function' ? v(useUIStore.getState().navFloatingExpanded) : v }),
  setBottomPanelExpanded: (v) => set({ bottomPanelExpanded: typeof v === 'function' ? v(useUIStore.getState().bottomPanelExpanded) : v }),
  setHighlightedPlaceId: (v) => set({ highlightedPlaceId: v }),
}));

export default useUIStore;
