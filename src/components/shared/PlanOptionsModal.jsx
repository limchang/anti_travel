import React from 'react';
import { X, Plus, Minus, CheckSquare, Square } from 'lucide-react';

const PlanOptionsModal = (props) => {
  // All state/handlers passed via props
  const p = props;
  if (!p.visible) return null;
  return (
            <>
              <div className="fixed inset-0 z-[291] bg-black/20" onClick={() => setShowPlanOptions(false)} />
              <div className="fixed z-[292] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(460px,92vw)] bg-white border border-slate-200 rounded-2xl shadow-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[14px] font-black text-slate-800">일정 옵션</p>
                  <button className="text-slate-400 hover:text-slate-600" onClick={() => setShowPlanOptions(false)}><X size={16} /></button>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 mb-1">여행지</p>
                    <input
                      value={planOptionRegion}
                      onChange={(e) => setPlanOptionRegion(e.target.value)}
                      placeholder="여행지"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-[11px] font-bold text-slate-700 outline-none focus:border-[#3182F6]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 mb-1">시작일</p>
                      <input
                        type="date"
                        value={planOptionStartDate}
                        onChange={(e) => setPlanOptionStartDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-[11px] font-bold text-slate-700 outline-none focus:border-[#3182F6]"
                      />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 mb-1">종료일</p>
                      <input
                        type="date"
                        value={planOptionEndDate}
                        onChange={(e) => setPlanOptionEndDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-[11px] font-bold text-slate-700 outline-none focus:border-[#3182F6]"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 mb-1">총 예산</p>
                    <input
                      type="number"
                      value={planOptionBudget}
                      onChange={(e) => setPlanOptionBudget(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-[11px] font-bold text-slate-700 outline-none focus:border-[#3182F6]"
                    />
                  </div>
                </div>

                {/* ── 공동 편집자 ── */}
                {canManagePlan && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[11px] font-black text-slate-700">공동 편집자</p>
                      <span className="text-[9px] font-bold text-slate-400">Gmail 계정만 지원</span>
                    </div>
                    <div className="flex gap-1.5 mb-2">
                      <input
                        value={collaboratorInput}
                        onChange={(e) => setCollaboratorInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const email = collaboratorInput.trim().toLowerCase();
                            if (!email || !email.includes('@')) return;
                            if (collaborators.some(c => c.email === email)) { setCollaboratorInput(''); return; }
                            const next = [...collaborators, { email, addedAt: Date.now() }];
                            setCollaborators(next);
                            setCollaboratorInput('');
                          }
                        }}
                        placeholder="gmail@gmail.com"
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-slate-700 outline-none focus:border-[#3182F6]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const email = collaboratorInput.trim().toLowerCase();
                          if (!email || !email.includes('@')) return;
                          if (collaborators.some(c => c.email === email)) { setCollaboratorInput(''); return; }
                          const next = [...collaborators, { email, addedAt: Date.now() }];
                          setCollaborators(next);
                          setCollaboratorInput('');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#3182F6] text-white text-[11px] font-black hover:bg-blue-600 transition-colors"
                      >추가</button>
                    </div>
                    {collaborators.length > 0 ? (
                      <div className="space-y-1 max-h-[100px] overflow-y-auto">
                        {collaborators.map((c) => (
                          <div key={c.email} className="flex items-center justify-between bg-blue-50 rounded-lg px-2.5 py-1.5">
                            <div className="flex items-center gap-1.5">
                              <div className="w-5 h-5 rounded-full bg-blue-200 flex items-center justify-center text-[9px] font-black text-blue-600">{c.email[0].toUpperCase()}</div>
                              <span className="text-[10px] font-bold text-slate-700">{c.email}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setCollaborators(prev => prev.filter(x => x.email !== c.email))}
                              className="text-slate-400 hover:text-red-500 transition-colors"
                            ><X size={11} /></button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[10px] font-bold text-slate-400 text-center py-2">추가된 공동 편집자가 없습니다</p>
                    )}
                  </div>
                )}

                {/* ── 저장 히스토리 ── */}
                {canManagePlan && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[11px] font-black text-slate-700">저장 히스토리</p>
                      <button
                        type="button"
                        onClick={() => setShowSaveHistoryPanel(v => !v)}
                        className="text-[9px] font-black text-[#3182F6] hover:underline"
                      >{showSaveHistoryPanel ? '접기' : `${manualSaveHistory.length}개 보기`}</button>
                    </div>
                    <button
                      type="button"
                      onClick={async () => {
                        setCollaboratorLoading(true);
                        await saveItineraryManually();
                        setCollaboratorLoading(false);
                      }}
                      disabled={collaboratorLoading}
                      className="w-full py-2 rounded-xl border border-emerald-200 bg-emerald-50 text-[11px] font-black text-emerald-700 hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                      {collaboratorLoading ? '저장 중...' : '지금 수동 저장'}
                    </button>
                    {showSaveHistoryPanel && manualSaveHistory.length > 0 && (
                      <div className="mt-2 space-y-1 max-h-[160px] overflow-y-auto">
                        {manualSaveHistory.map((entry) => (
                          <div key={entry.savedAt} className="flex items-center justify-between bg-slate-50 rounded-lg px-2.5 py-1.5 gap-2">
                            <div className="min-w-0">
                              <p className="text-[10px] font-black text-slate-700 truncate">{entry.label}</p>
                              <p className="text-[9px] font-bold text-slate-400">{new Date(entry.savedAt).toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => restoreSaveHistory(entry)}
                              className="shrink-0 px-2 py-1 rounded-lg border border-amber-200 bg-amber-50 text-[9px] font-black text-amber-700 hover:bg-amber-100 transition-colors"
                            >복원</button>
                          </div>
                        ))}
                      </div>
                    )}
                    {showSaveHistoryPanel && manualSaveHistory.length === 0 && (
                      <p className="text-[10px] font-bold text-slate-400 text-center py-2 mt-1">저장 기록이 없습니다</p>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => {
                      setShowPlanOptions(false);
                      setShowHeroSummaryModal(true);
                    }}
                    className="flex-1 py-2 rounded-xl border border-slate-200 bg-white text-[11px] font-black text-slate-600 hover:border-[#3182F6] hover:text-[#3182F6] transition-colors"
                  >
                    여행 요약 보기
                  </button>
                  <button
                    onClick={() => {
                      setShowPlanOptions(false);
                      setShowPlanManager(true);
                    }}
                    className="flex-1 py-2 rounded-xl border border-slate-200 bg-white text-[11px] font-black text-slate-600 hover:border-[#3182F6] hover:text-[#3182F6] transition-colors"
                  >
                    목록 열기
                  </button>
                  <button
                    onClick={() => {
                      setTripRegion(String(planOptionRegion || '').trim());
                      setTripStartDate(planOptionStartDate || '');
                      setTripEndDate(planOptionEndDate || '');
                      setItinerary(prev => ({ ...prev, maxBudget: Number(planOptionBudget) || 0 }));
                      setShowPlanOptions(false);
                    }}
                    className="flex-1 py-2 rounded-xl bg-[#3182F6] text-white text-[11px] font-black"
                  >
                    완료
                  </button>
                </div>
              </div>
            </>

  );
};

export default PlanOptionsModal;
