import React from 'react';
import { X } from 'lucide-react';

const LibraryTypeModal = ({ libraryTypeModal, setLibraryTypeModal, POPUP_TAG_OPTIONS, itinerary, updatePlace }) => {
  if (!libraryTypeModal) return null;

  const longPressRef = { current: null, _fired: false };
  const selectedTypes = libraryTypeModal.types;

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-end justify-center"
      style={{ background: 'rgba(15,23,42,0.45)' }}
      onClick={() => setLibraryTypeModal(null)}
    >
      <div
        className="w-full max-w-sm rounded-t-[24px] bg-white px-5 pt-5 pb-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <span className="text-[13px] font-black text-slate-800">카테고리 선택</span>
          <button
            onClick={() => setLibraryTypeModal(null)}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
          ><X size={14} /></button>
        </div>
        <div className="flex flex-wrap gap-2 mb-5">
          {POPUP_TAG_OPTIONS.map(t => {
            const active = selectedTypes.includes(t.value);
            return (
              <button
                key={t.value}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  longPressRef._fired = false;
                  longPressRef.current = setTimeout(() => {
                    longPressRef._fired = true;
                    setLibraryTypeModal(prev => ({ ...prev, types: [t.value] }));
                  }, 500);
                }}
                onMouseUp={() => clearTimeout(longPressRef.current)}
                onMouseLeave={() => clearTimeout(longPressRef.current)}
                onTouchStart={(e) => {
                  e.stopPropagation();
                  longPressRef._fired = false;
                  longPressRef.current = setTimeout(() => {
                    longPressRef._fired = true;
                    setLibraryTypeModal(prev => ({ ...prev, types: [t.value] }));
                  }, 500);
                }}
                onTouchEnd={() => clearTimeout(longPressRef.current)}
                onClick={(e) => {
                  e.stopPropagation();
                  if (longPressRef._fired) return;
                  setLibraryTypeModal(prev => {
                    const cur = prev.types;
                    const removed = cur.filter(v => v !== t.value);
                    const next = active ? (removed.length ? removed : cur) : [...cur.filter(v => v !== 'place'), t.value];
                    return { ...prev, types: next };
                  });
                }}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-black border transition-all ${active ? 'bg-[#3182F6] text-white border-[#3182F6]' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}
              >{t.label}</button>
            );
          })}
        </div>
        <p className="text-[9px] text-slate-400 font-bold mb-4 text-center">길게 누르면 단독 선택</p>
        <button
          onClick={() => {
            const place = (itinerary.places || []).find(p => p?.id === libraryTypeModal.placeId);
            if (place) updatePlace(libraryTypeModal.placeId, { ...place, types: libraryTypeModal.types });
            setLibraryTypeModal(null);
          }}
          className="w-full rounded-2xl bg-[#3182F6] py-3 text-[13px] font-black text-white"
        >완료</button>
      </div>
    </div>
  );
};

export default LibraryTypeModal;
