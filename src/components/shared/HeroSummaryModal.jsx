import React from 'react';
import { X } from 'lucide-react';
import useModalKeyboard from '../../utils/useModalKeyboard.js';

const HeroSummaryModal = ({ show, onClose, newPct, newCount, revisitPct, revisitCount, categorySpendRows }) => {
  useModalKeyboard(onClose, show);
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[297] flex items-center justify-center bg-slate-950 px-4 py-6 m" onClick={onClose}>
      <div className="w-full max-w-[560px] rounded-[28px] border border-white/70 bg-white/96 p-4 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.4)]" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[15px] font-black tracking-tight text-slate-900">여행 요약</p>
            <p className="mt-1 text-[11px] font-bold text-slate-400">일정 흐름과 예산 분포를 한 번에 확인</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-2xl border border-slate-200 bg-white p-2 text-slate-500 transition-colors hover:border-[#3182F6] hover:text-[#3182F6]"
            title="여행 요약 닫기"
          >
            <X size={16} />
          </button>
        </div>
        <div className="mt-4 w-full rounded-[24px] border border-slate-200 bg-white/92 p-4 text-left shadow-[0_16px_32px_-24px_rgba(15,23,42,0.24)]">
          <p className="text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">신규 / 재방문 비율 비교</p>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden flex">
            <div className="h-full bg-emerald-400" style={{ width: `${newPct}%` }} />
            <div className="h-full bg-blue-400" style={{ width: `${revisitPct}%` }} />
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-2.5 py-2">
              <p className="text-[9px] font-black text-emerald-600">신규</p>
              <p className="text-[14px] font-black text-emerald-700 tabular-nums">{newCount}개 ({newPct}%)</p>
            </div>
            <div className="rounded-xl border border-blue-200 bg-blue-50 px-2.5 py-2">
              <p className="text-[9px] font-black text-blue-600">재방문</p>
              <p className="text-[14px] font-black text-blue-700 tabular-nums">{revisitCount}개 ({revisitPct}%)</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-200">
            <p className="text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">카테고리별 지출 비율</p>
            {categorySpendRows.length === 0 ? (
              <p className="text-[10px] font-bold text-slate-400">지출 데이터가 없습니다.</p>
            ) : (
              <div className="space-y-1.5">
                {categorySpendRows.map((row) => (
                  <div key={row.key} className="rounded-xl border border-slate-200 bg-white px-2.5 py-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-black text-slate-700">{row.label}</span>
                      <span className="text-[10px] font-black text-[#3182F6] tabular-nums">₩{row.amount.toLocaleString()} · {row.pct}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-[#3182F6] to-indigo-500" style={{ width: `${row.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSummaryModal;
