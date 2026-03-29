import React from 'react';
import { Pencil, Clock, Package, Eye, Anchor, RotateCcw, Map as MapIcon } from 'lucide-react';
import useUIStore from '../../stores/useUIStore.js';
import useMapStore from '../../stores/useMapStore.js';
const MapOverlayBar = ({ mapDayOptions, routePreviewEndpointActions, routePreviewManualRefreshing, refreshRoutePreviewMap, getActiveRefContext, tripStartDate, itinerary, activeDay }) => {
  const { showTimelineOverlay, setShowTimelineOverlay } = useUIStore();
  const {
    overviewMapScope, setOverviewMapScope,
    overviewMapDayFilter, setOverviewMapDayFilter,
    overviewMapRouteVisible, setOverviewMapRouteVisible,
    showOverviewLibraryPoints, setShowOverviewLibraryPoints,
    hideLongRouteSegments, setHideLongRouteSegments,
    hiddenRoutePreviewEndpoints, setHiddenRoutePreviewEndpoints,
    mapTileStyle, setMapTileStyle,
  } = useMapStore();

  return (
    <div className="absolute top-14 left-1/2 -translate-x-1/2 z-[500] flex items-center gap-1 flex-wrap px-2 py-1.5 bg-white shadow-lg border border-slate-200/50 max-w-[calc(100vw-32px)]" data-no-map-clear="true">
      {/* 상세 일정 편집 */}
      <button
        type="button"
        onClick={() => setShowTimelineOverlay(prev => !prev)}
        className={`flex items-center gap-1 h-8 px-2.5 border text-[11px] font-black transition-colors shrink-0 ${showTimelineOverlay ? 'border-[#3182F6] bg-[#3182F6] text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-[#3182F6] hover:text-[#3182F6]'}`}
      >
        <Pencil size={11} />
        <span className="hidden sm:inline">{showTimelineOverlay ? '닫기' : '일정'}</span>
      </button>
      {/* 기준시 */}
      {(() => {
        const { refTime } = getActiveRefContext();
        if (!refTime) return null;
        const wdMap = { sun: '일', mon: '월', tue: '화', wed: '수', thu: '목', fri: '금', sat: '토' };
        const { todayKey: tk } = getActiveRefContext();
        const dl = wdMap[tk] || '';
        let datePart = '';
        if (tripStartDate) {
          const ad = itinerary.days?.find(dd => dd.day === activeDay);
          if (ad) {
            const dt = new Date(tripStartDate);
            dt.setDate(dt.getDate() + (ad.day - 1));
            datePart = `${String(dt.getMonth() + 1).padStart(2, '0')}/${String(dt.getDate()).padStart(2, '0')}`;
          }
        }
        return (
          <span className="flex items-center gap-1 h-8 px-2.5 border border-slate-200 bg-white text-[11px] font-black text-slate-500 shrink-0">
            <Clock size={11} />
            기준 {datePart} {refTime}
          </span>
        );
      })()}
      {/* 경로 표시 전체/Day */}
      <button
        type="button"
        onClick={() => {
          if (overviewMapScope === 'all') {
            setOverviewMapRouteVisible((v) => !v);
          } else {
            setOverviewMapScope('all');
            setOverviewMapDayFilter(null);
            setOverviewMapRouteVisible(true);
          }
        }}
        className={`shrink-0 border h-8 px-2.5 text-[11px] font-black transition-colors flex items-center ${overviewMapScope === 'all' && overviewMapRouteVisible ? 'border-[#3182F6]/50 bg-[#3182F6] text-white' : overviewMapScope === 'all' && !overviewMapRouteVisible ? 'border-slate-200 bg-slate-100 text-slate-300 line-through' : 'border-slate-200 bg-white text-slate-600 hover:text-[#3182F6]'}`}
      >전체</button>
      {mapDayOptions.map((option) => {
        const active = overviewMapScope === 'day' && Number(overviewMapDayFilter) === Number(option.day);
        return (
          <button
            key={`lib-map-day-ov-${option.day}`}
            type="button"
            onClick={() => { setOverviewMapScope('day'); setOverviewMapDayFilter(option.day); setOverviewMapRouteVisible(true); }}
            className={`shrink-0 border h-8 px-2.5 text-[11px] font-black transition-colors flex items-center ${active ? 'border-[#3182F6]/50 bg-[#3182F6] text-white' : 'border-slate-200 bg-white text-slate-600 hover:text-[#3182F6]'}`}
          >{option.label}</button>
        );
      })}
      {/* 토글 버튼들 */}
      <button type="button" onClick={() => setShowOverviewLibraryPoints((v) => !v)} className={`flex items-center gap-0.5 h-8 px-2 border text-[11px] font-black transition-colors ${showOverviewLibraryPoints ? 'border-[#3182F6] bg-[#3182F6] text-white' : 'border-slate-200 bg-white text-slate-600 hover:text-[#3182F6]'}`} title="내장소">
        <Package size={10} />
      </button>
      <button type="button" onClick={() => setHideLongRouteSegments((v) => !v)} className={`flex items-center gap-0.5 h-8 px-2 border text-[11px] font-black transition-colors ${hideLongRouteSegments ? 'border-orange-400 bg-orange-500 text-white' : 'border-slate-200 bg-white text-slate-600 hover:text-[#3182F6]'}`} title={hideLongRouteSegments ? '장거리 숨김' : '장거리 표시'}>
        <Eye size={10} />
      </button>
      {routePreviewEndpointActions.map((action) => (
        <button key={action.id} type="button" onClick={() => setHiddenRoutePreviewEndpoints((prev) => ({ ...prev, [action.id]: !prev[action.id] }))} className={`flex items-center gap-0.5 h-8 px-2 border text-[11px] font-black transition-colors ${action.hidden ? 'border-orange-400 bg-orange-500 text-white' : 'border-slate-200 bg-white text-slate-600 hover:text-[#3182F6]'}`} title={action.id.endsWith('ship-start') ? '출발' : '도착'}>
          <Anchor size={10} />
        </button>
      ))}
      <button type="button" onClick={() => setMapTileStyle(prev => (prev + 1) % 3)} className="flex items-center gap-0.5 h-8 px-2 border text-[11px] font-black transition-colors border-slate-200 bg-white text-slate-600 hover:text-[#3182F6]" title="지도 스타일 변경">
        <MapIcon size={10} />
      </button>
      <button type="button" onClick={refreshRoutePreviewMap} disabled={routePreviewManualRefreshing} className={`flex items-center justify-center h-8 w-8 border text-[11px] font-black transition-colors ${routePreviewManualRefreshing ? 'border-blue-400 bg-blue-500 text-white' : 'border-slate-200 bg-white text-slate-600 hover:text-[#3182F6]'}`} title="새로고침">
        <RotateCcw size={10} className={routePreviewManualRefreshing ? 'animate-spin' : ''} />
      </button>
    </div>
  );
};

export default React.memo(MapOverlayBar);
