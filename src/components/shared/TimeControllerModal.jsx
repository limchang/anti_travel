import React from 'react';
import { timeToMinutes, minutesToTime } from '../../utils/time.js';
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
      className={`fixed z-[291] rounded-[24px] border border-slate-200 bg-white/96 p-2.5 backdrop-blur-xl animate-in ${replaceMode ? 'shadow-[0_12px_26px_-18px_rgba(15,23,42,0.26)]' : 'shadow-[0_24px_50px_-24px_rgba(15,23,42,0.45)]'}`}
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

export default TimeControllerModal;
