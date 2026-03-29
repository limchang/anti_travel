import React from 'react';

const OverviewWidget = ({ heroStats, itinerary }) => {
  const { usedPct, visitPerHour, travelIntensity } = heroStats;
  const totalDays = itinerary.days?.length || 0;
  const totalItems = (itinerary.days || []).reduce((s, d) => s + (d.plan || []).filter(p => p.type !== 'backup').length, 0);

  return (
    <div
      className="absolute left-0 right-0 z-[1] bg-white rounded-2xl border border-slate-200/50 shadow-[0_12px_32px_-12px_rgba(15,23,42,0.18)]"
      style={{ top: 'calc(100% + 8px)' }}
      data-no-map-clear="true"
    >
      <div className="grid grid-cols-4 gap-0 divide-x divide-slate-100">
        <div className="px-2 py-2 text-center">
          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">일정</p>
          <p className="text-[12px] font-black text-slate-700 mt-0.5">{totalDays}일 {totalItems}개</p>
        </div>
        <div className="px-2 py-2 text-center">
          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">예산</p>
          <p className="text-[12px] font-black text-slate-700 mt-0.5">{usedPct}%</p>
        </div>
        <div className="px-2 py-2 text-center">
          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">강도</p>
          <p className="text-[12px] font-black text-slate-700 mt-0.5">{travelIntensity.label}</p>
        </div>
        <div className="px-2 py-2 text-center">
          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">밀도</p>
          <p className="text-[12px] font-black text-slate-700 mt-0.5">{visitPerHour.toFixed(1)}/h</p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(OverviewWidget);
