import React from 'react';
import { X, RotateCcw, Trash2 } from 'lucide-react';
import useUIStore from '../../stores/useUIStore.js';
import useModalKeyboard from '../../utils/useModalKeyboard.js';

export const PlanManagerModal = ({ planList, currentPlanId, setCurrentPlanId, createNewPlan, resolvePlanMetaForCard, getRegionCoverImage, setLastAction }) => {
  const { setShowPlanManager } = useUIStore();
  useModalKeyboard(() => setShowPlanManager(false));
  return (
    <>
      <div className="fixed inset-0 z-[400] bg-black" onClick={() => setShowPlanManager(false)} />
      <div className="fixed z-[401] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(640px,94vw)] bg-white border border-slate-200 shadow-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[14px] font-black text-slate-800">일정 관리</p>
          <button className="text-slate-400 hover:text-slate-600" onClick={() => setShowPlanManager(false)}><X size={16} /></button>
        </div>
        <button onClick={() => { const r = window.prompt('새 일정 지역을 입력하세요.', '') || ''; void createNewPlan(r); }} className="w-full mb-3 py-2 bg-[#3182F6] text-white text-[11px] font-black">새 도시 일정 만들기</button>
        <div className="max-h-[52vh] overflow-y-auto">
          {(planList || []).length === 0 ? (
            <p className="text-[11px] text-slate-400 font-bold p-3">생성된 일정이 없습니다.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(planList || []).map((plan) => {
                const meta = resolvePlanMetaForCard(plan);
                return (
                  <button key={plan.id} onClick={() => { setCurrentPlanId(plan.id); setShowPlanManager(false); setLastAction(`'${meta.title}' 일정으로 전환했습니다.`); }} className={`relative overflow-hidden border text-left min-h-[170px] transition-colors hover:-translate-y-0.5 ${currentPlanId === plan.id ? 'border-[#3182F6] ring-2 ring-[#3182F6]/20' : 'border-slate-200 hover:border-slate-300'}`}>
                    <img src={getRegionCoverImage(meta.region)} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-black/55" />
                    <div className="relative z-10 p-4 flex flex-col gap-1.5 text-white">
                      <p className="text-[18px] font-black truncate">{meta.region}</p>
                      {meta.startDate && <p className="text-[11px] font-bold text-white/85">{meta.startDate.replace(/-/g, '.')}</p>}
                      {meta.code && meta.code !== 'main' && <p className="text-[11px] font-black text-white/95 tracking-wide">{meta.code}</p>}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export const PlaceTrashModal = ({ itinerary, restorePlaceFromTrash, deletePlacePermanently }) => {
  const { setShowPlaceTrash } = useUIStore();
  useModalKeyboard(() => setShowPlaceTrash(false));
  return (
    <>
      <div className="fixed inset-0 z-[400] bg-black" onClick={() => setShowPlaceTrash(false)} />
      <div className="fixed z-[401] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(460px,92vw)] bg-white border border-slate-200 shadow-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[14px] font-black text-slate-800">내 장소 휴지통</p>
            <p className="mt-1 text-[10px] font-bold text-slate-400">삭제된 장소는 여기에, 완전 삭제는 영구 제거</p>
          </div>
          <button className="text-slate-400 hover:text-slate-600" onClick={() => setShowPlaceTrash(false)}><X size={16} /></button>
        </div>
        <div className="max-h-[52vh] overflow-y-auto space-y-2">
          {(itinerary.placeTrash || []).length === 0 ? (
            <div className="border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center">
              <p className="text-[12px] font-black text-slate-500">휴지통이 비어 있습니다.</p>
            </div>
          ) : (itinerary.placeTrash || []).map((place) => (
            <div key={`trash-${place.id}`} className="border border-slate-200 bg-slate-50 px-3 py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[12px] font-black text-slate-800">{place.name || '이름 없는 장소'}</p>
                  <p className="mt-1 truncate text-[10px] font-bold text-slate-400">{place.address || place.receipt?.address || '주소 없음'}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button type="button" onClick={() => restorePlaceFromTrash(place.id)} className="flex items-center gap-1 border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-[10px] font-black text-[#3182F6] hover:bg-blue-100"><RotateCcw size={11} />복원</button>
                  <button type="button" onClick={() => deletePlacePermanently(place.id)} className="flex items-center gap-1 border border-red-200 bg-red-50 px-2.5 py-1.5 text-[10px] font-black text-red-500 hover:bg-red-100"><Trash2 size={11} />삭제</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
