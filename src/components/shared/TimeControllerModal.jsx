import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { timeToMinutes, minutesToTime, fmtDurCompact } from '../../utils/time.js';
import { isLodgeStay, isOvernightLodgeTimelineItem } from '../../utils/helpers.js';
import { TimeWheelColumn } from './BusinessComponents.jsx';

const TimeControllerModal = ({
  timeControllerTarget,
  itinerary,
  setStartTimeValue,
  setPlanEndTimeValue,
  setPlanEndAbsoluteMinutes,
  toggleTimeFix,
  toggleDurationFix,
  toggleEndTimeFix,
  setDurationHourValue,
  setDurationMinuteValue,
  bumpTimeControllerAutoClose,
  setIsTimeWheelDragging,
}) => {
  if (timeControllerTarget?.kind !== 'plan-time') return null;
  if (timeControllerTarget?.inline) return null;

  const dayIdx = timeControllerTarget.dayIdx;
  const pIdx = timeControllerTarget.pIdx;
  const item = itinerary.days?.[dayIdx]?.plan?.[pIdx];
  if (!item || item.type === 'backup' || item.types?.includes('ship') || isLodgeStay(item.types)) return null;

  const startMinutes = timeToMinutes(item.time || '00:00');
  const durationMinutes = Math.max(0, Number(item.duration) || 0);
  const endMinutesAbsolute = startMinutes + durationMinutes;
  const currentEndMinutes = ((endMinutesAbsolute % 1440) + 1440) % 1440;
  const replaceMode = !!timeControllerTarget.replaceMode;
  const triggerWidth = Number(timeControllerTarget.width || 0);
  const triggerHeight = Number(timeControllerTarget.height || 0);
  const desiredWidth = replaceMode ? triggerWidth : (triggerWidth + 520);
  const panelWidth = replaceMode
    ? Math.min(window.innerWidth - 24, Math.max(420, desiredWidth))
    : Math.min(window.innerWidth - 24, Math.max(560, desiredWidth));
  const panelHeight = replaceMode
    ? Math.max(178, triggerHeight - 8)
    : 220;
  const left = Math.max(12, Math.min(window.innerWidth - panelWidth - 12, Number(timeControllerTarget.left || 0)));
  const top = replaceMode
    ? Math.max(12, Math.min(window.innerHeight - panelHeight - 12, Number(timeControllerTarget.top || 0) + 4))
    : Math.max(12, Math.min(window.innerHeight - panelHeight - 12, Number(timeControllerTarget.top || 0) - 6));
  const isAutoLocked = item.types?.includes('ship') || item._isBufferCoordinated;
  const isEndTimeFixed = !!item.isEndTimeFixed;
  const startHourValues = Array.from({ length: 24 }, (_, idx) => idx);
  const currentStartHour = Math.floor(startMinutes / 60);
  const currentStartMinute = startMinutes % 60;
  const canWrapEndBeforeStart = isOvernightLodgeTimelineItem(item);
  const currentDurationHour = Math.floor(durationMinutes / 60);
  const currentDurationMinute = durationMinutes % 60;
  const durationHourValues = Array.from({ length: canWrapEndBeforeStart ? 25 : 24 }, (_, idx) => idx);
  const overnightEndAbsolute = Math.max(startMinutes, Math.min(startMinutes + 1440, endMinutesAbsolute));
  const endHourValues = Array.from({ length: canWrapEndBeforeStart ? 48 : 24 }, (_, idx) => idx);
  const currentEndHour = Math.floor((canWrapEndBeforeStart ? overnightEndAbsolute : currentEndMinutes) / 60);
  const currentEndMinute = currentEndMinutes % 60;

  const buildWrappedTotalMinutes = (baseHour, baseMinute, nextMinute) => {
    let nextHour = baseHour;
    const delta = nextMinute - baseMinute;
    if (delta >= 30) nextHour -= 1;
    if (delta <= -30) nextHour += 1;
    return (nextHour * 60) + nextMinute;
  };
  const normalizeDayMinute = (value) => ((value % 1440) + 1440) % 1440;
  const clampEndNotBeforeStart = (candidateMinutes) => {
    if (canWrapEndBeforeStart) {
      const raw = Math.max(0, Math.min(2879, Number(candidateMinutes) || 0));
      const absolute = raw < startMinutes ? raw + 1440 : raw;
      return Math.max(startMinutes, Math.min(startMinutes + 1440, absolute));
    }
    const normalized = normalizeDayMinute(candidateMinutes);
    return Math.max(startMinutes, normalized);
  };
  const formatEndHourValue = (nextHour) => {
    if (!canWrapEndBeforeStart) return String(nextHour).padStart(2, '0');
    const clockHour = ((Number(nextHour) || 0) % 24 + 24) % 24;
    return `${String(clockHour).padStart(2, '0')}${nextHour >= 24 ? '+' : ''}`;
  };

  return (
    <div
      data-time-modal="true"
      data-no-drag="true"
      className={`fixed z-[291] rounded-[24px] border border-slate-200 bg-white/96 p-2.5 l animate-in ${replaceMode ? 'shadow-[0_12px_26px_-18px_rgba(15,23,42,0.26)]' : 'shadow-[0_24px_50px_-24px_rgba(15,23,42,0.45)]'}`}
      style={{ left, top, width: panelWidth, height: panelHeight }}
      onClick={(e) => e.stopPropagation()}
      onPointerDown={bumpTimeControllerAutoClose}
      onPointerMove={bumpTimeControllerAutoClose}
      onTouchStart={bumpTimeControllerAutoClose}
      onTouchMove={bumpTimeControllerAutoClose}
      onWheel={bumpTimeControllerAutoClose}
    >
      <div className="grid h-full grid-cols-3 gap-1.5 items-stretch">
        <div className="rounded-[20px] border border-slate-200 bg-slate-50/75 px-1.5 py-2">
          <div className="flex h-full w-full flex-col items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => toggleTimeFix(dayIdx, pIdx, { skipHistory: true })}
              className={`w-full rounded-[12px] border px-2 py-1.5 text-center text-[11px] font-black transition-colors ${item.isTimeFixed ? 'border-[#3182F6] bg-[#3182F6] text-white' : 'border-slate-300 bg-white text-slate-700'}`}
            >
              시작시간 잠금
            </button>
            <div className="flex w-full items-center justify-center gap-1">
              <TimeWheelColumn
                label=""
                value={currentStartHour}
                values={startHourValues}
                onInteract={bumpTimeControllerAutoClose}
                onDragStateChange={setIsTimeWheelDragging}
                onChange={(nextHour) => setStartTimeValue(dayIdx, pIdx, minutesToTime(normalizeDayMinute(nextHour * 60 + currentStartMinute)), { skipHistory: true })}
                accentClass="text-slate-800"
              />
              <TimeWheelColumn
                label=""
                value={currentStartMinute}
                values={Array.from({ length: 60 }, (_, idx) => idx)}
                cyclic
                liveOnDrag
                onInteract={bumpTimeControllerAutoClose}
                onDragStateChange={setIsTimeWheelDragging}
                onChange={(nextMinute) => {
                  const wrapped = buildWrappedTotalMinutes(currentStartHour, currentStartMinute, nextMinute);
                  setStartTimeValue(dayIdx, pIdx, minutesToTime(normalizeDayMinute(wrapped)), { skipHistory: true });
                }}
                accentClass="text-slate-800"
              />
            </div>
          </div>
        </div>

        <div className="rounded-[20px] border border-slate-200 bg-slate-50/75 px-1.5 py-2">
          <div className="flex h-full w-full flex-col items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => toggleDurationFix(dayIdx, pIdx, { skipHistory: true })}
              className={`w-full rounded-[12px] border px-2 py-1.5 text-center text-[11px] font-black transition-colors ${item.isDurationFixed ? 'border-slate-700 bg-slate-700 text-white' : 'border-slate-300 bg-white text-slate-700'}`}
            >
              소요시간 잠금
            </button>
            <div className="flex w-full items-center justify-center gap-1">
              <TimeWheelColumn
                label=""
                value={currentDurationHour}
                values={durationHourValues}
                liveOnDrag
                onInteract={bumpTimeControllerAutoClose}
                onDragStateChange={setIsTimeWheelDragging}
                onChange={(nextHour) => setDurationHourValue(dayIdx, pIdx, nextHour, { skipHistory: true })}
                accentClass="text-slate-800"
              />
              <TimeWheelColumn
                label=""
                value={currentDurationMinute}
                values={Array.from({ length: 60 }, (_, idx) => idx)}
                cyclic
                liveOnDrag
                onInteract={bumpTimeControllerAutoClose}
                onDragStateChange={setIsTimeWheelDragging}
                onChange={(nextMinute) => setDurationMinuteValue(dayIdx, pIdx, nextMinute, { skipHistory: true })}
                accentClass="text-slate-800"
              />
            </div>
          </div>
        </div>

        <div className="rounded-[20px] border border-slate-200 bg-slate-50/75 px-1.5 py-2">
          <div className="flex h-full w-full flex-col items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => { if (!isAutoLocked) toggleEndTimeFix(dayIdx, pIdx, { skipHistory: true }); }}
              disabled={isAutoLocked}
              className={`w-full rounded-[12px] border px-2 py-1.5 text-center text-[11px] font-black transition-colors disabled:opacity-50 ${isEndTimeFixed ? 'border-violet-500 bg-violet-500 text-white' : 'border-slate-300 bg-white text-slate-700'}`}
            >
              종료시간 잠금
            </button>
            <div className="flex w-full items-center justify-center gap-1">
              <TimeWheelColumn
                label=""
                value={currentEndHour}
                values={endHourValues}
                formatter={formatEndHourValue}
                onInteract={bumpTimeControllerAutoClose}
                onDragStateChange={setIsTimeWheelDragging}
                onChange={(nextHour) => {
                  const nextTotal = clampEndNotBeforeStart((nextHour * 60) + currentEndMinute);
                  if (canWrapEndBeforeStart) {
                    setPlanEndAbsoluteMinutes(dayIdx, pIdx, nextTotal, { skipHistory: true });
                  } else {
                    setPlanEndTimeValue(dayIdx, pIdx, minutesToTime(nextTotal), { skipHistory: true });
                  }
                }}
                accentClass="text-slate-800"
              />
              <TimeWheelColumn
                label=""
                value={currentEndMinute}
                values={Array.from({ length: 60 }, (_, idx) => idx)}
                cyclic
                liveOnDrag
                onInteract={bumpTimeControllerAutoClose}
                onDragStateChange={setIsTimeWheelDragging}
                onChange={(nextMinute) => {
                  const wrapped = buildWrappedTotalMinutes(currentEndHour, currentEndMinute, nextMinute);
                  const nextTotal = clampEndNotBeforeStart(wrapped);
                  if (canWrapEndBeforeStart) {
                    setPlanEndAbsoluteMinutes(dayIdx, pIdx, nextTotal, { skipHistory: true });
                  } else {
                    setPlanEndTimeValue(dayIdx, pIdx, minutesToTime(nextTotal), { skipHistory: true });
                  }
                }}
                accentClass="text-slate-800"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const InlineTimeController = ({
  p, dIdx, pIdx,
  isTimeCellExpanded, isAutoLocked, isDurationLocked, isEndTimeFixed,
  setTimeControllerTarget,
  setStartTimeValue, setPlanEndTimeValue, setPlanEndAbsoluteMinutes,
  toggleTimeFix, toggleDurationFix, toggleEndTimeFix,
  setDurationHourValue, setDurationMinuteValue,
  updateDuration,
  bumpTimeControllerAutoClose, setIsTimeWheelDragging,
}) => {
  const startMinutes = timeToMinutes(p.time || '00:00');
  const durationMinutes = Math.max(0, Number(p.duration) || 0);
  const endMinutesAbsolute = startMinutes + durationMinutes;
  const currentEndMinutes = ((endMinutesAbsolute % 1440) + 1440) % 1440;
  const [hh, mm] = minutesToTime(startMinutes).split(':');
  const [ehh, emm] = minutesToTime(currentEndMinutes).split(':');
  const currentStartHour = Math.floor(startMinutes / 60);
  const currentStartMinute = startMinutes % 60;
  const currentDurationHour = Math.floor(durationMinutes / 60);
  const currentDurationMinute = durationMinutes % 60;
  const canWrapEndBeforeStart = isOvernightLodgeTimelineItem(p);
  const durationHourValues = Array.from({ length: canWrapEndBeforeStart ? 25 : 24 }, (_, idx) => idx);
  const overnightEndAbsolute = Math.max(startMinutes, Math.min(startMinutes + 1440, endMinutesAbsolute));
  const currentEndHour = Math.floor((canWrapEndBeforeStart ? overnightEndAbsolute : currentEndMinutes) / 60);
  const currentEndMinute = currentEndMinutes % 60;
  const endHourValues = Array.from({ length: canWrapEndBeforeStart ? 48 : 24 }, (_, idx) => idx);

  const buildWrappedTotalMinutes = (baseHour, baseMinute, nextMinute) => {
    let nextHour = baseHour;
    const delta = nextMinute - baseMinute;
    if (delta >= 30) nextHour -= 1;
    if (delta <= -30) nextHour += 1;
    return (nextHour * 60) + nextMinute;
  };
  const normalizeDayMinute = (value) => ((value % 1440) + 1440) % 1440;
  const clampEndNotBeforeStart = (candidateMinutes) => {
    if (canWrapEndBeforeStart) {
      const raw = Math.max(0, Math.min(2879, Number(candidateMinutes) || 0));
      const absolute = raw < startMinutes ? raw + 1440 : raw;
      return Math.max(startMinutes, Math.min(startMinutes + 1440, absolute));
    }
    return Math.max(startMinutes, normalizeDayMinute(candidateMinutes));
  };
  const formatEndHourValue = (nextHour) => {
    if (!canWrapEndBeforeStart) return String(nextHour).padStart(2, '0');
    const clockHour = ((Number(nextHour) || 0) % 24 + 24) % 24;
    return `${String(clockHour).padStart(2, '0')}${nextHour >= 24 ? '+' : ''}`;
  };
  const toggleInline = (event) => {
    event.stopPropagation();
    setTimeControllerTarget((prev) => (
      prev?.kind === 'plan-time' && prev?.dayIdx === dIdx && prev?.pIdx === pIdx
        ? null
        : { kind: 'plan-time', dayIdx: dIdx, pIdx, inline: true }
    ));
  };

  return (
    <>
      {!isTimeCellExpanded && (
        <div data-time-trigger="true" data-no-drag="true" onTouchStart={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()} onDragStart={(e) => e.preventDefault()} className="relative z-10 w-full select-none">
          <div className="flex w-full items-stretch gap-1.5 px-1 py-1.5">
            <div className="flex flex-1 flex-col items-center gap-0.5">
              <span className="text-[9px] font-bold tracking-widest uppercase text-slate-400">Start</span>
              <button type="button" onClick={toggleInline} className={`flex w-full h-[40px] items-center justify-center rounded-[12px] border px-2 transition-colors ${p.isTimeFixed ? 'border-[#3182F6]/60 bg-blue-50 shadow-[0_0_0_2px_rgba(49,130,246,0.12)]' : 'border-slate-200 bg-white/92 hover:border-slate-300'}`}>
                <span className={`text-[22px] font-black tabular-nums tracking-[-0.06em] leading-none ${p.isTimeFixed ? 'text-[#3182F6]' : 'text-slate-900'}`}>{hh}<span className="mx-[1px] opacity-70">:</span>{mm}</span>
              </button>
            </div>
            <div className="flex flex-1 flex-col items-center gap-0.5">
              <span className="text-[9px] font-bold tracking-widest uppercase text-slate-400">Duration</span>
              <div className={`relative z-10 flex w-full h-[40px] items-center justify-center rounded-[12px] border shadow-[0_10px_24px_-14px_rgba(15,23,42,0.25)] transition-colors overflow-hidden ${isAutoLocked ? 'border-red-400 bg-red-500 text-white' : isDurationLocked ? 'border-[#ff8a1a] bg-[#ff8a1a] text-white' : 'border-slate-200 bg-white text-slate-700'}`}>
                <button type="button" onClick={(e) => { e.stopPropagation(); updateDuration(dIdx, pIdx, -1); }} className="flex items-center justify-center px-1.5 h-full hover:bg-black/10 active:bg-black transition-colors"><ChevronLeft size={10} /></button>
                <button type="button" onClick={toggleInline} className="flex-1 flex items-center justify-center h-full"><span className="font-black tabular-nums text-[11px] tracking-[0.04em] whitespace-nowrap">{fmtDurCompact(p.duration)}</span></button>
                <button type="button" onClick={(e) => { e.stopPropagation(); updateDuration(dIdx, pIdx, 1); }} className="flex items-center justify-center px-1.5 h-full hover:bg-black/10 active:bg-black transition-colors"><ChevronRight size={10} /></button>
              </div>
            </div>
            <div className="flex flex-1 flex-col items-center gap-0.5">
              <span className="text-[9px] font-bold tracking-widest uppercase text-slate-400">End</span>
              <button type="button" onClick={toggleInline} className={`flex w-full h-[40px] items-center justify-center rounded-[12px] border px-2 transition-colors ${isEndTimeFixed ? 'border-violet-400/60 bg-violet-50 shadow-[0_0_0_2px_rgba(139,92,246,0.12)]' : 'border-slate-200 bg-slate-50/95 hover:border-slate-300'}`}>
                <span className={`text-[22px] font-black tabular-nums tracking-[-0.06em] leading-none ${isEndTimeFixed ? 'text-violet-500' : 'text-slate-400'}`}>{ehh}<span className="mx-[1px] opacity-65">:</span>{emm}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {isTimeCellExpanded && (
        <div data-time-modal="true" data-no-drag="true" onClick={(e) => e.stopPropagation()} onPointerDown={(e) => { e.stopPropagation(); bumpTimeControllerAutoClose(e); }} onPointerMove={(e) => { e.stopPropagation(); bumpTimeControllerAutoClose(e); }} onTouchStart={(e) => { e.stopPropagation(); bumpTimeControllerAutoClose(e); }} onTouchMove={(e) => { e.stopPropagation(); bumpTimeControllerAutoClose(e); }} onWheel={bumpTimeControllerAutoClose} onDragStart={(e) => e.preventDefault()} className="mt-1 w-full z-30">
          <div className="grid h-full grid-cols-3 gap-2 items-stretch p-1">
            <div className="rounded-[16px] border border-slate-200 bg-slate-50/80 px-1.5 py-2">
              <div className="flex h-full w-full flex-col items-center justify-center gap-2">
                <button type="button" onClick={() => toggleTimeFix(dIdx, pIdx, { skipHistory: true })} className={`w-full rounded-[12px] border px-2 py-1.5 text-center text-[11px] font-black transition-colors ${p.isTimeFixed ? 'border-[#3182F6] bg-[#3182F6] text-white' : 'border-slate-300 bg-white text-slate-700'}`}>시작시간 잠금</button>
                <div className="flex w-full items-center justify-center gap-1">
                  <TimeWheelColumn label="" value={currentStartHour} values={Array.from({ length: 24 }, (_, idx) => idx)} onInteract={bumpTimeControllerAutoClose} onDragStateChange={setIsTimeWheelDragging} onChange={(nextHour) => setStartTimeValue(dIdx, pIdx, minutesToTime(normalizeDayMinute(nextHour * 60 + currentStartMinute)), { skipHistory: true, keepLockState: true })} accentClass="text-slate-800" />
                  <TimeWheelColumn label="" value={currentStartMinute} values={Array.from({ length: 60 }, (_, idx) => idx)} cyclic liveOnDrag onInteract={bumpTimeControllerAutoClose} onDragStateChange={setIsTimeWheelDragging} onChange={(nextMinute) => { const wrapped = buildWrappedTotalMinutes(currentStartHour, currentStartMinute, nextMinute); setStartTimeValue(dIdx, pIdx, minutesToTime(normalizeDayMinute(wrapped)), { skipHistory: true, keepLockState: true }); }} accentClass="text-slate-800" />
                </div>
              </div>
            </div>
            <div className="rounded-[16px] border border-slate-200 bg-slate-50/80 px-1.5 py-2">
              <div className="flex h-full w-full flex-col items-center justify-center gap-2">
                <button type="button" onClick={() => toggleDurationFix(dIdx, pIdx, { skipHistory: true })} className={`w-full rounded-[12px] border px-2 py-1.5 text-center text-[11px] font-black transition-colors ${p.isDurationFixed ? 'border-slate-700 bg-slate-700 text-white' : 'border-slate-300 bg-white text-slate-700'}`}>소요시간 잠금</button>
                <div className="flex w-full items-center justify-center gap-1">
                  <TimeWheelColumn label="" value={currentDurationHour} values={durationHourValues} liveOnDrag onInteract={bumpTimeControllerAutoClose} onDragStateChange={setIsTimeWheelDragging} onChange={(nextHour) => setDurationHourValue(dIdx, pIdx, nextHour, { skipHistory: true })} accentClass="text-slate-800" />
                  <TimeWheelColumn label="" value={currentDurationMinute} values={Array.from({ length: 60 }, (_, idx) => idx)} cyclic liveOnDrag onInteract={bumpTimeControllerAutoClose} onDragStateChange={setIsTimeWheelDragging} onChange={(nextMinute) => setDurationMinuteValue(dIdx, pIdx, nextMinute, { skipHistory: true })} accentClass="text-slate-800" />
                </div>
              </div>
            </div>
            <div className="rounded-[16px] border border-slate-200 bg-slate-50/80 px-1.5 py-2">
              <div className="flex h-full w-full flex-col items-center justify-center gap-2">
                <button type="button" onClick={() => { if (!isAutoLocked) toggleEndTimeFix(dIdx, pIdx, { skipHistory: true }); }} disabled={isAutoLocked} className={`w-full rounded-[12px] border px-2 py-1.5 text-center text-[11px] font-black transition-colors disabled:opacity-50 ${isEndTimeFixed ? 'border-violet-500 bg-violet-500 text-white' : 'border-slate-300 bg-white text-slate-700'}`}>종료시간 잠금</button>
                <div className="flex w-full items-center justify-center gap-1">
                  <TimeWheelColumn label="" value={currentEndHour} values={endHourValues} formatter={formatEndHourValue} onInteract={bumpTimeControllerAutoClose} onDragStateChange={setIsTimeWheelDragging} onChange={(nextHour) => { const nextTotal = clampEndNotBeforeStart((nextHour * 60) + currentEndMinute); if (canWrapEndBeforeStart) { setPlanEndAbsoluteMinutes(dIdx, pIdx, nextTotal, { skipHistory: true }); } else { setPlanEndTimeValue(dIdx, pIdx, minutesToTime(nextTotal), { skipHistory: true }); } }} accentClass="text-slate-800" />
                  <TimeWheelColumn label="" value={currentEndMinute} values={Array.from({ length: 60 }, (_, idx) => idx)} cyclic liveOnDrag onInteract={bumpTimeControllerAutoClose} onDragStateChange={setIsTimeWheelDragging} onChange={(nextMinute) => { const wrapped = buildWrappedTotalMinutes(currentEndHour, currentEndMinute, nextMinute); const nextTotal = clampEndNotBeforeStart(wrapped); if (canWrapEndBeforeStart) { setPlanEndAbsoluteMinutes(dIdx, pIdx, nextTotal, { skipHistory: true }); } else { setPlanEndTimeValue(dIdx, pIdx, minutesToTime(nextTotal), { skipHistory: true }); } }} accentClass="text-slate-800" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TimeControllerModal;
