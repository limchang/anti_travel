import React from 'react';
import { Map as MapIcon, ChevronDown, Calendar, SlidersHorizontal, Lock, Unlock } from 'lucide-react';
import useUIStore from '../../stores/useUIStore.js';
import useItineraryStore from '../../stores/useItineraryStore.js';

const TopMenuBar = ({
  user, tripNights, saveItineraryManually, handleLogin, handleLogout,
  autoCalculateAllRoutes, isCalculatingAllRoutes, routeCalcProgress,
  setShowShareManager,
}) => {
  const { tripRegion, tripStartDate, isDirty, isEditMode, setIsEditMode } = useItineraryStore();
  const {
    setShowPlanManager, setShowDatePicker, setShowPlanOptions,
    showNavMenu, setShowNavMenu,
    setShowAiSettings, setShowChecklistModal, setShowSmartFillGuide,
  } = useUIStore();

  return (
    <>
      <div className="fixed top-0 inset-x-0 z-[310] h-12 bg-white border-b border-slate-200 flex items-center px-2 sm:px-4 gap-1.5 sm:gap-3 shadow-sm">
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center shrink-0">
            <MapIcon size={14} className="text-white" />
          </div>
          <button type="button" onClick={() => setShowPlanManager(true)} className="flex items-center gap-1 text-left hover:opacity-80 transition-opacity min-w-0">
            <span className="text-[13px] sm:text-[14px] font-black text-slate-800 tracking-tight truncate max-w-[80px] sm:max-w-none">{tripRegion || 'AP'}</span>
            <ChevronDown size={10} className="text-slate-400 shrink-0" />
          </button>
          {tripStartDate && (
            <button type="button" onClick={() => setShowDatePicker(v => !v)} className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors shrink-0">
              <Calendar size={10} />
              <span className="hidden sm:inline">{tripStartDate} ·</span> {tripNights}박
            </button>
          )}
          <button type="button" onClick={() => setShowPlanOptions(true)} className="w-8 h-8 flex items-center justify-center border border-slate-200 bg-white text-slate-500 hover:border-slate-300 transition-colors shrink-0" title="일정 옵션">
            <SlidersHorizontal size={14} />
          </button>
        </div>
        <div className="flex-1" />
        <button
          type="button"
          onClick={() => setIsEditMode(prev => !prev)}
          className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-colors shrink-0 ${isEditMode ? 'border-amber-300 bg-amber-50 text-amber-600' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`}
          title={isEditMode ? '편집 잠금' : '드래그 편집 활성화'}
        >
          {isEditMode ? <Unlock size={14} /> : <Lock size={14} />}
        </button>
        {user && !user.isGuest && (
          <button
            type="button"
            onClick={() => saveItineraryManually()}
            className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-colors shrink-0 ${isDirty ? 'border-amber-300 bg-amber-50 text-amber-600 hover:bg-amber-100' : 'border-slate-200 bg-white text-slate-400'}`}
            title={isDirty ? '저장' : '저장됨'}
          >
            {isDirty ? <span className="text-[10px] font-black">저장</span> : <span className="text-[10px]">✓</span>}
          </button>
        )}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNavMenu(prev => !prev)}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:border-slate-300 transition-colors"
          >
            <SlidersHorizontal size={14} />
          </button>
          {showNavMenu && (
            <>
              <div className="fixed inset-0 z-[9980]" onClick={() => setShowNavMenu(false)} />
              <div className="absolute right-0 top-10 z-[9990] w-[200px] rounded-[14px] border border-slate-200 bg-white p-1.5 shadow-[0_16px_32px_-16px_rgba(15,23,42,0.35)]">
                <button onClick={() => { setShowPlanManager(true); setShowNavMenu(false); }} className="w-full px-3 py-2 rounded-[10px] text-left text-[11px] font-black text-slate-700 hover:bg-slate-50">일정 목록</button>
                <button onClick={() => { setShowPlanOptions(true); setShowNavMenu(false); }} className="w-full px-3 py-2 rounded-[10px] text-left text-[11px] font-black text-slate-700 hover:bg-slate-50">일정 옵션</button>
                <button onClick={() => { setShowShareManager(true); setShowNavMenu(false); }} className="w-full px-3 py-2 rounded-[10px] text-left text-[11px] font-black text-slate-700 hover:bg-slate-50">공유 설정</button>
                <button onClick={() => { autoCalculateAllRoutes(); setShowNavMenu(false); }} disabled={isCalculatingAllRoutes} className="w-full px-3 py-2 rounded-[10px] text-left text-[11px] font-black text-slate-700 hover:bg-slate-50">{isCalculatingAllRoutes ? `경로 계산 ${routeCalcProgress}%` : '전체 경로 재계산'}</button>
                <button onClick={() => { setShowAiSettings(true); setShowNavMenu(false); }} className="w-full px-3 py-2 rounded-[10px] text-left text-[11px] font-black text-slate-700 hover:bg-slate-50">AI 설정</button>
                <button onClick={() => { setShowChecklistModal(true); setShowNavMenu(false); }} className="w-full px-3 py-2 rounded-[10px] text-left text-[11px] font-black text-slate-700 hover:bg-slate-50">체크리스트</button>
                <button onClick={() => { setShowSmartFillGuide(true); setShowNavMenu(false); }} className="w-full px-3 py-2 rounded-[10px] text-left text-[11px] font-black text-slate-700 hover:bg-slate-50">학습 지침</button>
                <div className="h-px bg-slate-100 my-1" />
                {user ? (
                  <button onClick={() => { handleLogout(); setShowNavMenu(false); }} className="w-full px-3 py-2 rounded-[10px] text-left text-[11px] font-black text-red-500 hover:bg-red-50">로그아웃</button>
                ) : (
                  <button onClick={() => { handleLogin(); setShowNavMenu(false); }} className="w-full px-3 py-2 rounded-[10px] text-left text-[11px] font-black text-[#3182F6] hover:bg-blue-50">로그인</button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <div className="h-12 shrink-0" />
    </>
  );
};

export default React.memo(TopMenuBar);
