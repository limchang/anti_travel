import React from 'react';
import { X } from 'lucide-react';
import { parseChecklistLines, toggleChecklistLine, hasChecklistItems } from './SharedComponents.jsx';
import useUIStore from '../../stores/useUIStore.js';
import useModalKeyboard from '../../utils/useModalKeyboard.js';
const ChecklistPanel = ({ itinerary, updateMemo }) => {
  const { setShowChecklistModal } = useUIStore();
  useModalKeyboard(() => setShowChecklistModal(false));

  const checklistGroups = [];
  (itinerary.days || []).forEach((day, dI) => {
    (day.plan || []).forEach((item, pI) => {
      if (!item || item.type === 'backup') return;
      const memo = String(item.memo || '');
      if (!hasChecklistItems(memo)) return;
      const lines = parseChecklistLines(memo);
      const items = lines.filter(l => l.isCheckItem);
      checklistGroups.push({ dIdx: dI, pIdx: pI, day: day.day || dI + 1, activity: item.activity || '일정', items, memo });
    });
  });
  const totalCount = checklistGroups.reduce((s, g) => s + g.items.length, 0);
  const checkedCount = checklistGroups.reduce((s, g) => s + g.items.filter(i => i.checked).length, 0);

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center bg-slate-950 px-4 py-8" onClick={() => setShowChecklistModal(false)}>
      <div className="relative w-full max-w-[420px] max-h-[80vh] flex flex-col border border-white/70 bg-white shadow-[0_30px_80px_-20px_rgba(15,23,42,0.4)]" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-5 pt-5 pb-3 border-b border-slate-100">
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-black text-slate-900">체크리스트</p>
            <p className="text-[11px] font-bold text-slate-400 mt-0.5">{checkedCount}/{totalCount} 완료</p>
          </div>
          <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#3182F6] rounded-full transition-colors" style={{ width: totalCount ? `${(checkedCount / totalCount) * 100}%` : '0%' }} />
          </div>
          <button onClick={() => setShowChecklistModal(false)} className="shrink-0 w-7 h-7 flex items-center justify-center border border-slate-200 text-slate-400 hover:text-slate-600 transition-colors"><X size={14} /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {checklistGroups.length === 0 ? (
            <div className="py-10 text-center text-[12px] font-bold text-slate-300">
              <p>체크리스트 항목이 없습니다.</p>
              <p className="mt-1 text-[10px] font-medium text-slate-200">메모에 <code className="bg-slate-100 px-1 text-slate-400">- [ ] 항목명</code> 형식으로 추가하세요.</p>
            </div>
          ) : checklistGroups.map((group) => (
            <div key={`${group.dIdx}-${group.pIdx}`} className="border border-slate-100 bg-slate-50 px-3.5 py-3">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-[9px] font-black text-slate-400 bg-slate-200 px-1.5 py-0.5">Day {group.day}</span>
                <span className="text-[12px] font-black text-slate-700 truncate">{group.activity}</span>
                <span className="ml-auto text-[9px] font-bold text-slate-300">{group.items.filter(i => i.checked).length}/{group.items.length}</span>
              </div>
              <div className="space-y-1">
                {group.items.map((line) => (
                  <label key={line.idx} className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" checked={line.checked} onChange={() => { const next = toggleChecklistLine(group.memo, line.idx); updateMemo(group.dIdx, group.pIdx, next); }} className="w-3.5 h-3.5 accent-[#3182F6] shrink-0" />
                    <span className={`text-[12px] font-medium leading-snug transition-colors ${line.checked ? 'line-through text-slate-300' : 'text-slate-700'}`}>{line.text}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        {checklistGroups.length > 0 && (
          <div className="flex gap-2 px-4 pb-4 pt-3 border-t border-slate-100">
            <button onClick={() => { checklistGroups.forEach(group => { const lines = String(group.memo).split('\n'); const next = lines.map(l => /^-\s*\[\s*\]/.test(l) ? l.replace(/^(-\s*)\[\s*\]/, '$1[x]') : l).join('\n'); if (next !== group.memo) updateMemo(group.dIdx, group.pIdx, next); }); }} className="flex-1 py-2 bg-[#3182F6] text-white text-[12px] font-black hover:bg-blue-600 transition-colors">전체 완료</button>
            <button onClick={() => { checklistGroups.forEach(group => { const lines = String(group.memo).split('\n'); const next = lines.map(l => /^-\s*\[x\]/i.test(l) ? l.replace(/^(-\s*)\[x\]/i, '$1[ ]') : l).join('\n'); if (next !== group.memo) updateMemo(group.dIdx, group.pIdx, next); }); }} className="flex-1 py-2 border border-slate-200 text-slate-500 text-[12px] font-black hover:bg-slate-50 transition-colors">전체 초기화</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(ChecklistPanel);
