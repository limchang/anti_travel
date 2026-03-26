import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

// 범용 태그 선택 팝오버 — 클릭 위치 근처에 표시
const TagPickerModal = ({ show, types, tagOptions, onTypesChange, onConfirm, onClose, position }) => {
  if (!show) return null;

  const longPressRef = { current: null, _fired: false };
  const selectedTypes = types || ['place'];

  // 팝오버 위치 계산 (화면 밖으로 안 나가게)
  const panelW = 320;
  const panelH = 280;
  const pos = position || {};
  const left = Math.max(12, Math.min(window.innerWidth - panelW - 12, (pos.x || window.innerWidth / 2) - panelW / 2));
  const top = Math.max(12, Math.min(window.innerHeight - panelH - 12, (pos.y || window.innerHeight / 2) + 8));

  return createPortal(
    <div
      className="fixed inset-0 z-[99999]"
      onClick={onClose}
    >
      <div
        className="fixed z-[99999] rounded-[20px] border border-slate-200 bg-white p-4 shadow-[0_20px_50px_-16px_rgba(15,23,42,0.35)]"
        style={{ left, top, width: panelW }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[12px] font-black text-slate-800">카테고리 선택</span>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
          ><X size={12} /></button>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {tagOptions.map(t => {
            const active = selectedTypes.includes(t.value);
            return (
              <button
                key={t.value}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  longPressRef._fired = false;
                  longPressRef.current = setTimeout(() => {
                    longPressRef._fired = true;
                    onTypesChange([t.value]);
                  }, 250);
                }}
                onMouseUp={() => clearTimeout(longPressRef.current)}
                onMouseLeave={() => clearTimeout(longPressRef.current)}
                onTouchStart={(e) => {
                  e.stopPropagation();
                  longPressRef._fired = false;
                  longPressRef.current = setTimeout(() => {
                    longPressRef._fired = true;
                    onTypesChange([t.value]);
                  }, 250);
                }}
                onTouchEnd={() => clearTimeout(longPressRef.current)}
                onClick={(e) => {
                  e.stopPropagation();
                  if (longPressRef._fired) return;
                  const cur = selectedTypes;
                  const removed = cur.filter(v => v !== t.value);
                  const next = active ? (removed.length ? removed : cur) : [...cur.filter(v => v !== 'place'), t.value];
                  onTypesChange(next);
                }}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-black border transition-all ${active ? 'bg-[#3182F6] text-white border-[#3182F6]' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}
              >{t.label}</button>
            );
          })}
        </div>
        <p className="text-[8px] text-slate-400 font-bold mb-3 text-center">길게 누르면 단독 선택</p>
        <button
          onClick={onConfirm}
          className="w-full rounded-xl bg-[#3182F6] py-2 text-[11px] font-black text-white"
        >완료</button>
      </div>
    </div>,
    document.body
  );
};

// 내 장소 카드용 래퍼 (기존 호환)
const LibraryTypeModal = ({ libraryTypeModal, setLibraryTypeModal, POPUP_TAG_OPTIONS, itinerary, updatePlace }) => {
  if (!libraryTypeModal) return null;
  return (
    <TagPickerModal
      show={!!libraryTypeModal}
      types={libraryTypeModal.types}
      tagOptions={POPUP_TAG_OPTIONS}
      position={libraryTypeModal.position}
      onTypesChange={(next) => setLibraryTypeModal(prev => ({ ...prev, types: next }))}
      onConfirm={() => {
        const place = (itinerary.places || []).find(p => p?.id === libraryTypeModal.placeId);
        if (place) updatePlace(libraryTypeModal.placeId, { ...place, types: libraryTypeModal.types });
        setLibraryTypeModal(null);
      }}
      onClose={() => setLibraryTypeModal(null)}
    />
  );
};

export { TagPickerModal };
export default LibraryTypeModal;
