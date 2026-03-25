import React from 'react';
import { X } from 'lucide-react';

const MAP_CATEGORY_OPTIONS = [
  { label: '전체', value: null, color: '#64748B' },
  { label: '식당', value: 'food', color: '#F43F5E' },
  { label: '카페', value: 'cafe', color: '#D97706' },
  { label: '관광', value: 'tour', color: '#8B5CF6' },
  { label: '숙소', value: 'lodge', color: '#4F46E5' },
  { label: '체험', value: 'experience', color: '#10B981' },
  { label: '기념품', value: 'souvenir', color: '#0D9488' },
  { label: '뷰맛집', value: 'view', color: '#0EA5E9' },
  { label: '픽업', value: 'pickup', color: '#F97316' },
  { label: '장소', value: 'place', color: '#94A3B8' },
];

const LibraryCategoryModal = ({
  showLibraryCategoryModal,
  setShowLibraryCategoryModal,
  libraryCategoryModalPos,
  showOverviewLibraryPoints,
  setShowOverviewLibraryPoints,
  placeFilterTags,
  setPlaceFilterTags,
}) => {
  if (!showLibraryCategoryModal) return null;
  return (
    <>
      <div className="fixed inset-0 z-[598]" onClick={() => setShowLibraryCategoryModal(false)} />
      <div className="fixed z-[599] w-52 rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_8px_32px_-8px_rgba(15,23,42,0.3)]" style={{ top: libraryCategoryModalPos.top, left: libraryCategoryModalPos.left, right: libraryCategoryModalPos.right }}>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] font-black text-slate-700">내 장소 카테고리</span>
          <button type="button" onClick={() => setShowLibraryCategoryModal(false)} className="rounded-lg p-0.5 text-slate-400 hover:text-slate-600"><X size={12} /></button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {MAP_CATEGORY_OPTIONS.map((opt) => {
            const isAll = opt.value === null;
            const isActive = isAll
              ? (showOverviewLibraryPoints && placeFilterTags.length === 0)
              : (showOverviewLibraryPoints && !placeFilterTags.includes(opt.value));
            return (
              <button
                key={opt.value ?? 'all'}
                type="button"
                onClick={() => {
                  if (isAll) {
                    setPlaceFilterTags([]);
                    setShowOverviewLibraryPoints(true);
                  } else if (isActive) {
                    const next = placeFilterTags.filter((t) => t !== opt.value);
                    setPlaceFilterTags(next);
                    if (next.length === 0) setShowOverviewLibraryPoints(false);
                  } else {
                    setPlaceFilterTags((prev) => [...prev.filter((t) => t !== opt.value), opt.value]);
                    setShowOverviewLibraryPoints(true);
                  }
                  setShowLibraryCategoryModal(false);
                }}
                className="flex items-center gap-1 rounded-full border px-2 py-1 text-[9px] font-black transition-all"
                style={isActive ? { background: opt.color, borderColor: opt.color, color: '#fff' } : { background: '#F8FAFC', borderColor: '#E2E8F0', color: '#64748B' }}
              >
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: opt.color, display: 'inline-block', flexShrink: 0 }} />
                {opt.label}
              </button>
            );
          })}
        </div>
        {showOverviewLibraryPoints && (
          <button
            type="button"
            onClick={() => { setShowOverviewLibraryPoints(false); setPlaceFilterTags([]); setShowLibraryCategoryModal(false); }}
            className="mt-2 w-full rounded-xl border border-slate-200 py-1 text-[9px] font-black text-slate-500 hover:bg-slate-50"
          >지도에서 숨기기</button>
        )}
      </div>
    </>
  );
};

export default LibraryCategoryModal;
