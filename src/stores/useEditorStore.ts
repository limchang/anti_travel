import { create } from 'zustand';

interface EditorState {
  editingPlaceId: string | null;
  editPlaceDraft: any;
  editingPlanTarget: any;
  editPlanDraft: any;
  isAddingPlace: boolean;
  isAddingPlaceAutoFill: boolean;
  newPlaceName: string;
  newPlaceTypes: string[];

  tagEditorTarget: any;
  businessEditorTarget: any;
  viewingPlanIdx: Record<string, any>;
  ferryEditField: any;
  expandedId: string | null;
  expandedPlaceId: string | null;
  pendingPlanMenuFocus: any;
  timeControllerTarget: any;
  timeControlStep: number;
  timelineEndTimeDraft: any;
  lodgeCheckoutDraft: any;
  isTimeWheelDragging: boolean;
  planVariantPicker: any;
  libraryTypeModal: any;

  setEditingPlaceId: (v: string | null) => void;
  setEditPlaceDraft: (v: any) => void;
  setEditingPlanTarget: (v: any) => void;
  setEditPlanDraft: (v: any) => void;
  setIsAddingPlace: (v: boolean) => void;
  setIsAddingPlaceAutoFill: (v: boolean) => void;
  setNewPlaceName: (v: string) => void;
  setNewPlaceTypes: (v: string[]) => void;
  setTagEditorTarget: (v: any) => void;
  setBusinessEditorTarget: (v: any) => void;
  setViewingPlanIdx: (v: Record<string, any>) => void;
  setFerryEditField: (v: any) => void;
  setExpandedId: (v: string | null) => void;
  setExpandedPlaceId: (v: string | null) => void;
  setPendingPlanMenuFocus: (v: any) => void;
  setTimeControllerTarget: (v: any) => void;
  setTimeControlStep: (v: number) => void;
  setTimelineEndTimeDraft: (v: any) => void;
  setLodgeCheckoutDraft: (v: any) => void;
  setIsTimeWheelDragging: (v: boolean) => void;
  setPlanVariantPicker: (v: any) => void;
  setLibraryTypeModal: (v: any) => void;
  resetNewPlaceDraft: () => void;
}

const useEditorStore = create<EditorState>((set, get) => ({
  editingPlaceId: null,
  editPlaceDraft: null,
  editingPlanTarget: null,
  editPlanDraft: null,
  isAddingPlace: false,
  isAddingPlaceAutoFill: false,
  newPlaceName: '',
  newPlaceTypes: ['food'],

  tagEditorTarget: null,
  businessEditorTarget: null,
  viewingPlanIdx: {},
  ferryEditField: null,
  expandedId: null,
  expandedPlaceId: null,
  pendingPlanMenuFocus: null,
  timeControllerTarget: null,
  timeControlStep: 1,
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
