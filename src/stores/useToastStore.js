import { create } from 'zustand';

const useToastStore = create((set) => ({
  undoToast: false,
  undoMessage: '',
  infoToast: '',
  infoToastAction: null,

  setUndoToast: (v) => set({ undoToast: v }),
  setUndoMessage: (v) => set({ undoMessage: v }),
  setInfoToast: (v) => set({ infoToast: v }),
  setInfoToastAction: (v) => set({ infoToastAction: v }),

  showInfoToast: (msg, action = null) => {
    set({ infoToast: msg, infoToastAction: action });
  },
  triggerUndoToast: (msg = '') => {
    set({ undoToast: true, undoMessage: msg });
  },
}));

export default useToastStore;
