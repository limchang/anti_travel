import React from 'react';
import { Package, Trash2, PlusCircle, Move, CalendarDays, Map as MapIcon } from 'lucide-react';

export const MobileTabBar = ({ isMobileLayout, col1Collapsed, col2Collapsed, setCol1Collapsed, setCol2Collapsed }) => {
  if (!isMobileLayout) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-[230] flex h-14 items-stretch border-t border-slate-200 bg-white/97 backdrop-blur-xl shadow-[0_-6px_20px_-10px_rgba(15,23,42,0.12)]">
      <button
        type="button"
        onClick={() => { setCol1Collapsed(true); setCol2Collapsed(true); }}
        className={`flex flex-1 flex-col items-center justify-center gap-0.5 transition-colors ${col1Collapsed && col2Collapsed ? 'text-[#3182F6]' : 'text-slate-400 hover:text-slate-600'}`}
      >
        <CalendarDays size={18} strokeWidth={col1Collapsed && col2Collapsed ? 2.5 : 2} />
        <span className={`text-[10px] font-black ${col1Collapsed && col2Collapsed ? 'text-[#3182F6]' : 'text-slate-400'}`}>일정</span>
        {col1Collapsed && col2Collapsed && <span className="absolute bottom-1 h-1 w-1 rounded-full bg-[#3182F6]" />}
      </button>
      <button
        type="button"
        onClick={() => { setCol1Collapsed(false); setCol2Collapsed(true); }}
        className={`flex flex-1 flex-col items-center justify-center gap-0.5 transition-colors ${!col1Collapsed ? 'text-[#3182F6]' : 'text-slate-400 hover:text-slate-600'}`}
      >
        <MapIcon size={18} strokeWidth={!col1Collapsed ? 2.5 : 2} />
        <span className={`text-[10px] font-black ${!col1Collapsed ? 'text-[#3182F6]' : 'text-slate-400'}`}>네비</span>
        {!col1Collapsed && <span className="absolute bottom-1 h-1 w-1 rounded-full bg-[#3182F6]" />}
      </button>
      <button
        type="button"
        onClick={() => { setCol1Collapsed(true); setCol2Collapsed(false); }}
        className={`flex flex-1 flex-col items-center justify-center gap-0.5 transition-colors ${!col2Collapsed ? 'text-[#3182F6]' : 'text-slate-400 hover:text-slate-600'}`}
      >
        <Package size={18} strokeWidth={!col2Collapsed ? 2.5 : 2} />
        <span className={`text-[10px] font-black ${!col2Collapsed ? 'text-[#3182F6]' : 'text-slate-400'}`}>내 장소</span>
        {!col2Collapsed && <span className="absolute bottom-1 h-1 w-1 rounded-full bg-[#3182F6]" />}
      </button>
    </div>
  );
};

export const DragActionBar = ({
  draggingFromTimeline,
  dragBottomTarget,
  setDragBottomTarget,
  getActiveTimelineDragPayload,
  applyTimelineBottomAction,
  triggerUndoToast,
  setDraggingFromTimeline,
  desktopDragRef,
}) => {
  if (!draggingFromTimeline) return null;

  const handleDrop = (action) => (e) => {
    e.preventDefault();
    const payload = getActiveTimelineDragPayload();
    if (!payload) return;
    const changed = applyTimelineBottomAction(action, payload);
    if (changed) triggerUndoToast();
    setDragBottomTarget('');
    setDraggingFromTimeline(null);
    desktopDragRef.current = null;
  };

  const actions = [
    { key: 'move_to_library', icon: <Package size={13} />, label: '내장소로 이동', activeClass: 'border-[#3182F6] bg-blue-50 text-[#3182F6]' },
    { key: 'delete', icon: <Trash2 size={13} />, label: '삭제', activeClass: 'border-red-400 bg-red-50 text-red-500' },
    { key: 'copy_to_library', icon: <PlusCircle size={13} />, label: '내장소로 복제', activeClass: 'border-emerald-400 bg-emerald-50 text-emerald-600' },
  ];

  return (
    <div className="fixed left-1/2 -translate-x-1/2 bottom-16 z-[231] w-[min(680px,94vw)]">
      <div className="grid grid-cols-3 gap-2">
        {actions.map(({ key, icon, label, activeClass }) => (
          <div
            key={key}
            data-drag-action={key}
            onDragOver={(e) => { e.preventDefault(); setDragBottomTarget(key); }}
            onDragLeave={() => setDragBottomTarget(prev => (prev === key ? '' : prev))}
            onDrop={handleDrop(key)}
            className={`h-16 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-1 text-[11px] font-black transition-all ${dragBottomTarget === key ? activeClass : 'border-slate-200 bg-white text-slate-500'}`}
          >
            {icon}
            <span>{label}</span>
            <span className="text-[9px] font-bold opacity-70">여기에 드래그</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const DragGhost = ({ draggingFromLibrary, draggingFromTimeline, dragCoord, dragGhostRef, itinerary }) => {
  if (!draggingFromLibrary && !draggingFromTimeline) return null;
  return (
    <div
      ref={dragGhostRef}
      className="fixed pointer-events-none z-[9999] bg-white/96 backdrop-blur-xl border border-[#3182F6]/25 rounded-full px-3.5 py-2 shadow-[0_12px_28px_rgba(49,130,246,0.22)] flex items-center gap-2.5 animate-in fade-in zoom-in duration-150"
      style={{
        left: 0,
        top: 0,
        transform: `translate3d(${dragCoord.x}px, ${dragCoord.y}px, 0) translate(-50%, -120%)`,
        willChange: 'transform'
      }}
    >
      <Move size={12} className="text-[#3182F6] shrink-0" />
      <span className="text-[12px] font-black text-slate-800 truncate max-w-[180px]">
        {draggingFromLibrary?.name ||
          (itinerary.days?.[draggingFromTimeline?.dayIdx]?.plan?.[draggingFromTimeline?.pIdx]?.activity) ||
          '일정 이동 중'}
      </span>
    </div>
  );
};
