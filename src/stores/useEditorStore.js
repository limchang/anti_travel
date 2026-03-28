import { create } from 'zustand';

const useEditorStore = create((set, get) => ({
  // Place editor
  editingPlaceId: null,
  editPlaceDraft: null,
  editingPlanTarget: null,
  editPlanDraft: null,
  isAddingPlace: false,
  isAddingPlaceAutoFill: false,
  newPlaceName: '',
  newPlaceTypes: ['place'],

  // Editor targets
  tagEditorTarget: null,
  businessEditorTarget: null,
  viewingPlanIdx: null,
  ferryEditField: null,
  expandedId: null,
  expandedPlaceId: null,
  pendingPlanMenuFocus: null,
  timeControllerTarget: null,
  timeControlStep: 5,
  timelineEndTimeDraft: null,
  lodgeCheckoutDraft: null,
  isTimeWheelDragging: false,
  planVariantPicker: null,
  libraryTypeModal: null,

  setEditingPlaceId: (v) => set({ editingPlaceId: v }),
  setEditPlaceDraft: (v) => set(typeof v === 'function' ? { editPlaceDraft: v(get().editPlaceDraft) } : { editPlaceDraft: v }),
  setEditingPlanTarget: (v) => set({ editingPlanTarget: v }),
  setEditPlanDraft: (v) => set(typeof v === 'function' ? { editPlanDraft: v(get().editPlanDraft) } : { editPlanDraft: v }),
  setIsAddingPlace: (v) => set({ isAddingPlace: v }),
  setIsAddingPlaceAutoFill: (v) => set({ isAddingPlaceAutoFill: v }),
  setNewPlaceName: (v) => set({ newPlaceName: v }),
  setNewPlaceTypes: (v) => set({ newPlaceTypes: v }),
  setTagEditorTarget: (v) => set({ tagEditorTarget: v }),
  setBusinessEditorTarget: (v) => set({ businessEditorTarget: v }),
  setViewingPlanIdx: (v) => set({ viewingPlanIdx: v }),
  setFerryEditField: (v) => set({ ferryEditField: v }),
  setExpandedId: (v) => set({ expandedId: v }),
  setExpandedPlaceId: (v) => set({ expandedPlaceId: v }),
  setPendingPlanMenuFocus: (v) => set({ pendingPlanMenuFocus: v }),
  setTimeControllerTarget: (v) => set({ timeControllerTarget: v }),
  setTimeControlStep: (v) => set({ timeControlStep: v }),
  setTimelineEndTimeDraft: (v) => set({ timelineEndTimeDraft: v }),
  setLodgeCheckoutDraft: (v) => set({ lodgeCheckoutDraft: v }),
  setIsTimeWheelDragging: (v) => set({ isTimeWheelDragging: v }),
  setPlanVariantPicker: (v) => set({ planVariantPicker: v }),
  setLibraryTypeModal: (v) => set({ libraryTypeModal: v }),

  resetNewPlaceDraft: () => set({
    isAddingPlace: false,
    isAddingPlaceAutoFill: false,
  }),
}));

export default useEditorStore;
