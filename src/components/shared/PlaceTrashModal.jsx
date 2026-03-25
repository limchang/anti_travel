import React from 'react';
import { X } from 'lucide-react';

const PlaceTrashModal = (props) => {
  const p = props;
  if (!p.visible) return null;
  return (
            <>
              <div className="fixed inset-0 z-[291] bg-black/20" onClick={() => setShowPlaceTrash(false)} />
              <div className="fixed z-[292] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(460px,92vw)] bg-white border border-slate-200 rounded-2xl shadow-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-[14px] font-black text-slate-800">내 장소 휴지통</p>
                    <p className="mt-1 text-[10px] font-bold text-slate-400">삭제된 장소는 여기로 이동하고, 여기서 삭제하면 완전 삭제됩니다.</p>
                  </div>
                  <button className="text-slate-400 hover:text-slate-600" onClick={() => setShowPlaceTrash(false)}><X size={16} /></button>
                </div>
                <div className="max-h-[52vh] overflow-y-auto space-y-2">
                  {(itinerary.placeTrash || []).length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center">
                      <p className="text-[12px] font-black text-slate-500">휴지통이 비어 있습니다.</p>
                    </div>
                  ) : (
                    (itinerary.placeTrash || []).map((place) => (
                      <div key={`trash-${place.id}`} className="rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-[12px] font-black text-slate-800">{place.name || '이름 없는 장소'}</p>
                            <p className="mt-1 truncate text-[10px] font-bold text-slate-400">{place.address || place.receipt?.address || '주소 없음'}</p>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => restorePlaceFromTrash(place.id)}
                              className="flex items-center gap-1 rounded-xl border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-[10px] font-black text-[#3182F6] hover:bg-blue-100"
                            >
                              <RotateCcw size={11} />
                              복원
                            </button>
                            <button
                              type="button"
                              onClick={() => deletePlacePermanently(place.id)}
                              className="flex items-center gap-1 rounded-xl border border-red-200 bg-red-50 px-2.5 py-1.5 text-[10px] font-black text-red-500 hover:bg-red-100"
                            >
                              <Trash2 size={11} />
                              완전삭제
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>

  );
};

export default PlaceTrashModal;
