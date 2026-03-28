import { create } from 'zustand';

const useDragStore = create((set, get) => ({
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
