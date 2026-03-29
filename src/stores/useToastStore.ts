import { create } from 'zustand';

interface ToastState {
  undoToast: boolean;
  undoMessage: string;
  infoToast: string;
  infoToastAction: (() => void) | null;

  setUndoToast: (v: boolean) => void;
  setUndoMessage: (v: string) => void;
  setInfoToast: (v: string) => void;
  setInfoToastAction: (v: (() => void) | null) => void;
  showInfoToast: (msg: string, action?: (() => void) | null) => void;
  triggerUndoToast: (msg?: string) => void;
}

const useToastStore = create<ToastState>((set) => ({
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
