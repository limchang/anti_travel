import { create } from 'zustand';

interface DragState {
  draggingFromLibrary: any;
  draggingFromTimeline: any;
  isDroppingOnDeleteZone: boolean;
  dragBottomTarget: string;
  dropTarget: any;
  dropOnItem: any;
  isDragCopy: boolean;
  dragCoord: { x: number; y: number };
  touchDragLock: boolean;

  setDraggingFromLibrary: (v: any) => void;
  setDraggingFromTimeline: (v: any) => void;
  setIsDroppingOnDeleteZone: (v: boolean) => void;
  setDragBottomTarget: (v: string) => void;
  setDropTarget: (v: any) => void;
  setDropOnItem: (v: any) => void;
  setIsDragCopy: (v: boolean) => void;
  setDragCoord: (v: { x: number; y: number }) => void;
  setTouchDragLock: (v: boolean) => void;
  resetDrag: () => void;
}

const useDragStore = create<DragState>((set) => ({
  draggingFromLibrary: null,
  draggingFromTimeline: null,
  isDroppingOnDeleteZone: false,
  dragBottomTarget: '',
  dropTarget: null,
  dropOnItem: null,
  isDragCopy: false,
  dragCoord: { x: 0, y: 0 },
  touchDragLock: false,

  setDraggingFromLibrary: (v) => set({ draggingFromLibrary: v }),
  setDraggingFromTimeline: (v) => set({ draggingFromTimeline: v }),
  setIsDroppingOnDeleteZone: (v) => set({ isDroppingOnDeleteZone: v }),
  setDragBottomTarget: (v) => set({ dragBottomTarget: v }),
  setDropTarget: (v) => set({ dropTarget: v }),
  setDropOnItem: (v) => set({ dropOnItem: v }),
  setIsDragCopy: (v) => set({ isDragCopy: v }),
  setDragCoord: (v) => set({ dragCoord: v }),
  setTouchDragLock: (v) => set({ touchDragLock: v }),

  resetDrag: () => set({
    draggingFromLibrary: null,
    draggingFromTimeline: null,
    dropTarget: null,
    dropOnItem: null,
    isDragCopy: false,
    dragCoord: { x: 0, y: 0 },
  }),
}));

export default useDragStore;
