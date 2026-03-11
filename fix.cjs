const fs = require('fs');

const content = fs.readFileSync('src/App.jsx', 'utf8');

const newBlock = `                                    return (
                                      <div className="flex flex-col gap-3 w-full animate-in fade-in zoom-in-95 duration-300">
                                        {/* ── 최신 UI 타임 컨트롤러 ── */}
                                        {/* 시작 & 종료 셀 */}
                                        <div className="grid grid-cols-2 gap-2 mt-1">
                                          {/* 시작 시각 셀 */}
                                          <div 
                                            onClick={(e) => { e.stopPropagation(); toggleTimeFix(dIdx, pIdx); }}
                                            className={\`cursor-pointer group relative flex flex-col items-center p-2 rounded-[20px] transition-all border-2 \${p.isTimeFixed ? 'bg-blue-50 border-[#3182F6]' : 'bg-white border-blue-50/50 hover:border-blue-100'}\`}
                                          >
                                            <span className={\`text-[9px] font-black \${p.isTimeFixed ? 'text-[#3182F6]' : 'text-slate-300'} mb-1\`}>START</span>
                                            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                              <div className="flex flex-col items-center">
                                                <button onClick={(e) => { e.stopPropagation(); updateStartHour(dIdx, pIdx, 1); }} className="text-slate-200 hover:text-blue-400"><ChevronUp size={14} /></button>
                                                <span className={\`text-[22px] font-black tabular-nums leading-none \${p.isTimeFixed ? 'text-[#3182F6]' : 'text-slate-800'}\`}>{hourStr}</span>
                                                <button onClick={(e) => { e.stopPropagation(); updateStartHour(dIdx, pIdx, -1); }} className="text-slate-200 hover:text-blue-400"><ChevronDown size={14} /></button>
                                              </div>
                                              <span className="text-slate-200 font-bold -mt-0.5">:</span>
                                              <div className="flex flex-col items-center">
                                                <button onClick={(e) => { e.stopPropagation(); updateStartMinute(dIdx, pIdx, mStep); }} className="text-slate-200 hover:text-blue-400"><ChevronUp size={14} /></button>
                                                <span className={\`text-[22px] font-black tabular-nums leading-none \${p.isTimeFixed ? 'text-[#3182F6]' : 'text-slate-800'}\`}>{minuteStr}</span>
                                                <button onClick={(e) => { e.stopPropagation(); updateStartMinute(dIdx, pIdx, -mStep); }} className="text-slate-200 hover:text-blue-400"><ChevronDown size={14} /></button>
                                              </div>
                                            </div>
                                            {p.isTimeFixed && <div className="absolute top-1 right-2"><Lock size={8} className="text-[#3182F6]" /></div>}
                                          </div>

                                          {/* 종료 시각 셀 */}
                                          <div 
                                            onClick={(e) => { e.stopPropagation(); if (isAutoLocked) return; setDurationValue(dIdx, pIdx, 0); }}
                                            className={\`cursor-pointer group relative flex flex-col items-center p-2 rounded-[20px] transition-all border-2 \${isEndTimeFixed ? 'bg-amber-50 border-amber-400' : 'bg-white border-amber-50/50 hover:border-amber-100'}\`}
                                          >
                                            <span className={\`text-[9px] font-black \${isEndTimeFixed ? 'text-amber-500' : 'text-slate-300'} mb-1\`}>END</span>
                                            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                              <div className="flex flex-col items-center">
                                                <button onClick={(e) => { e.stopPropagation(); updatePlanEndTime(dIdx, pIdx, 60); }} className="text-amber-100 hover:text-amber-400"><ChevronUp size={14} /></button>
                                                <span className={\`text-[22px] font-black tabular-nums leading-none \${isEndTimeFixed ? 'text-amber-600' : 'text-slate-800'}\`}>{endHour}</span>
                                                <button onClick={(e) => { e.stopPropagation(); updatePlanEndTime(dIdx, pIdx, -60); }} className="text-amber-100 hover:text-amber-400"><ChevronDown size={14} /></button>
                                              </div>
                                              <span className="text-amber-100 font-bold -mt-0.5">:</span>
                                              <div className="flex flex-col items-center">
                                                <button onClick={(e) => { e.stopPropagation(); updatePlanEndTime(dIdx, pIdx, mStep); }} className="text-amber-100 hover:text-amber-400"><ChevronUp size={14} /></button>
                                                <span className={\`text-[22px] font-black tabular-nums leading-none \${isEndTimeFixed ? 'text-amber-600' : 'text-slate-800'}\`}>{endMinute}</span>
                                                <button onClick={(e) => { e.stopPropagation(); updatePlanEndTime(dIdx, pIdx, -mStep); }} className="text-amber-100 hover:text-amber-400"><ChevronDown size={14} /></button>
                                              </div>
                                            </div>
                                            {isEndTimeFixed && <div className="absolute top-1 right-2"><Lock size={8} className="text-amber-500" /></div>}
                                          </div>
                                        </div>

                                        {/* DURATION 벨트 */}
                                        <div className="flex flex-col gap-2 p-3 bg-slate-50/80 rounded-[20px] border border-slate-100">
                                          <div className="flex items-center justify-between px-1">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">DURATION</span>
                                            <div 
                                              className={\`flex items-center gap-3 cursor-pointer select-none \${isDurationLocked ? 'text-blue-500' : 'text-slate-700'}\`}
                                              onClick={(e) => { e.stopPropagation(); toggleDurationFix(dIdx, pIdx); }}
                                            >
                                              <button onClick={(e) => { e.stopPropagation(); updateDuration(dIdx, pIdx, -TIME_UNIT); }} className="text-slate-300 hover:text-slate-600 active:scale-90"><Minus size={14} strokeWidth={3} /></button>
                                              <span className="text-[20px] font-black tabular-nums">{fmtDur(p.duration)}</span>
                                              <button onClick={(e) => { e.stopPropagation(); updateDuration(dIdx, pIdx, TIME_UNIT); }} className="text-slate-300 hover:text-slate-600 active:scale-90"><Plus size={14} strokeWidth={3} /></button>
                                            </div>
                                          </div>
                                          <div className="grid grid-cols-4 gap-1.5 mt-1">
                                            {[15, 30, 60, 120].map((val) => (
                                              <button
                                                key={val}
                                                onClick={(e) => { e.stopPropagation(); updateDuration(dIdx, pIdx, val); }}
                                                className="py-1.5 rounded-xl bg-white border border-slate-200/60 text-[10px] font-black text-slate-500 hover:border-[#3182F6] hover:bg-blue-50 hover:text-[#3182F6] transition-all shadow-sm"
                                              >
                                                +{val >= 60 ? \`\${val / 60}h\` : \`\${val}m\`}
                                              </button>
                                            ))}
                                          </div>
                                        </div>

                                        {/* 하단 락버튼 & 스텝 */}
                                        <div className="flex items-center gap-2 mt-1">
                                          <button
                                            onClick={(e) => { e.stopPropagation(); toggleTimeFix(dIdx, pIdx); }}
                                            className={\`h-11 flex-1 flex flex-col items-center justify-center rounded-[20px] text-[11px] font-black transition-all border-2 \${p.isTimeFixed ? 'bg-[#3182F6] text-white border-[#3182F6]' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'}\`}
                                          >
                                            <div className="flex items-center gap-1.5 leading-tight">
                                              <Lock size={12} fill={p.isTimeFixed ? "currentColor" : "none"} /> 
                                              <span>{p.isTimeFixed ? '고정 해제' : '고정'}</span>
                                            </div>
                                          </button>
                                          <div className="h-11 flex items-center gap-1 bg-slate-50 border border-slate-100 p-1.5 rounded-[20px]">
                                            {[1, 5, 10].map(s => (
                                              <button
                                                key={s}
                                                onClick={(e) => { e.stopPropagation(); setTimeControlStep(s); }}
                                                className={\`w-8 h-8 rounded-xl text-[11px] font-extrabold transition-all \${mStep === s ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200' : 'text-slate-300 hover:text-slate-500'}\`}
                                              >
                                                {s}
                                              </button>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    );`;

const lines = content.split('\n');

const startIndex = lines.findIndex(l => l.includes('return (') && lines[lines.indexOf(l) + 1]?.includes('── 최신 UI 타임 컨트롤러 ──'));

if (startIndex !== -1) {
    // Find the end index where '})()}' occurs, looking specifically for the end of the return
    // since the return was broken into multiple invalid pieces containing "</div>" we will find the exact '});})()}' block
    let endIndex = -1;
    for (let i = startIndex; i < lines.length; i++) {
        if (lines[i].includes(');') && lines[i + 1]?.includes('})()}')) {
            endIndex = i;
            break;
        }
    }

    if (endIndex !== -1) {
        const newContent = [...lines.slice(0, startIndex), newBlock, ...lines.slice(endIndex + 1)].join('\n');
        fs.writeFileSync('src/App.jsx', newContent);
        console.log('Fixed syntax error!');
    } else {
        console.log('Could not find endIndex');
    }
} else {
    console.log('Could not find startIndex');
}
