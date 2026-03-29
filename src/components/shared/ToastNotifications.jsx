import React from 'react';
import { Unlock } from 'lucide-react';
import useToastStore from '../../stores/useToastStore.js';

const ToastNotifications = ({ handleUndo, handleInfoToastAction, clearInfoToast }) => {
  const { undoToast, setUndoToast, undoMessage, infoToast, infoToastAction } = useToastStore();

  return (
    <>
      {infoToast && (
        <div className="fixed inset-x-0 bottom-20 z-[320] flex justify-center px-4">
          <div className="flex items-center gap-3 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-2xl shadow-[0_14px_30px_-16px_rgba(15,23,42,0.45)]">
            <span className="text-[12px] font-bold">{infoToast}</span>
            {infoToastAction && (
              <button
                type="button"
                onClick={handleInfoToastAction}
                className="inline-flex items-center gap-1 rounded-lg border border-blue-100 bg-blue-50 px-2.5 py-1 text-[11px] font-black text-[#3182F6] transition-colors hover:bg-blue-100"
              >
                <Unlock size={11} />
                {infoToastAction.label}
              </button>
            )}
            <button onClick={clearInfoToast} className="text-slate-300 hover:text-slate-500 transition-colors ml-1">✕</button>
          </div>
        </div>
      )}
      {undoToast && (
        <div className="fixed inset-x-0 bottom-20 z-[320] flex justify-center px-4">
          <div className="flex items-center gap-3 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-2xl shadow-[0_14px_30px_-16px_rgba(15,23,42,0.45)]">
            <span className="text-[12px] font-bold">{undoMessage || "변경 사항이 저장되었습니다"}</span>
            <button
              onClick={() => { handleUndo(); setUndoToast(false); }}
              className="text-[11px] font-black text-[#3182F6] bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-colors border border-blue-100"
            >되돌리기</button>
            <button onClick={() => setUndoToast(false)} className="text-slate-300 hover:text-slate-500 transition-colors ml-1">✕</button>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(ToastNotifications);
