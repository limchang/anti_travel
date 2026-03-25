import React from 'react';
import { X } from 'lucide-react';

const OverviewMapModal = (props) => {
  const p = props;
  if (!p.visible) return null;
  return (
            <div className="fixed inset-0 z-[180] flex items-center justify-center bg-slate-950/42 px-4 py-6 backdrop-blur-sm" onClick={() => setShowOverviewMapModal(false)}>
              <div
                className="w-full max-w-[980px] rounded-[28px] border border-white/70 bg-white/96 p-4 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.4)]"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-black tracking-tight text-slate-900">동선 지도 크게 보기</p>
                    <p className="mt-1 text-[11px] font-bold text-slate-400 truncate">
                      {`일정 ${overviewTimelinePoints.length} · 내 장소 ${libraryMapPoints.length} · 추천 ${recommendationMapPoints.length}`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowOverviewMapModal(false)}
                    className="shrink-0 rounded-2xl border border-slate-200 bg-white p-2 text-slate-500 transition-colors hover:border-[#3182F6] hover:text-[#3182F6]"
                    title="지도 크게 보기 닫기"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="mt-3 overflow-hidden rounded-[22px] border border-slate-200 bg-white">
                  <RoutePreviewCanvas
                    routePreviewMap={overviewFilteredRoutePreviewMap}
                    libraryPoints={[]}
                    recommendationPoints={[]}
                    focusedTarget={focusedMapTarget}
                    onMarkerClick={handleOverviewMapMarkerClick}
                    onBackgroundClick={clearOverviewMapFocus}
                    onSegmentLabelClick={(toItemId) => {
                      let found = null;
                      (itinerary.days || []).forEach((day, dI) => {
                        (day.plan || []).forEach((item, pI) => {
                          if (item?.id === toItemId) found = { dIdx: dI, pIdx: pI };
                        });
                      });
                      if (found) {
                        document.getElementById(`travel-chip-${found.dIdx}-${found.pIdx}`)
                          ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }
                    }}
                    interactive
                    height={isMobileLayout ? 460 : 620}
                    showTimelineMarkers
                    showRouteLines
                    showOverlayMarkers={false}
                    scopeKey={`${overviewMapScope}:${overviewMapDayFilter ?? 'all'}`}
                  />
                </div>
              </div>
            </div>

  );
};

export default OverviewMapModal;
