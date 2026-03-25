import React from 'react';
import { X, Plus, Minus, CheckSquare, Square } from 'lucide-react';

const AiSettingsModal = (props) => {
  // All state/handlers passed via props
  const p = props;
  if (!p.visible) return null;
  return (
            <>
              <div className="fixed inset-0 z-[291] bg-black/20" onClick={() => setShowAiSettings(false)} />
              <div className="fixed z-[292] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(480px,92vw)] max-h-[88vh] overflow-y-auto bg-white border border-slate-200 rounded-2xl shadow-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-[14px] font-black text-slate-800">AI 스마트 채우기 설정</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-1">로그인 상태에서는 서버 암호화 저장을 우선 사용합니다.</p>
                  </div>
                  <button className="text-slate-400 hover:text-slate-600" onClick={() => setShowAiSettings(false)}><X size={16} /></button>
                </div>
                <div className="space-y-3">
                  <label className="block">
                    <span className="text-[10px] font-black text-slate-500">Groq API Key</span>
                    <input
                      type="password"
                      value={aiSmartFillConfig.apiKey}
                      onChange={(e) => setAiSmartFillConfig((prev) => normalizeAiSmartFillConfig({ ...prev, apiKey: e.target.value }))}
                      placeholder={serverAiKeyStatus.hasStoredGroqKey ? '새 Groq 키로 교체하려면 다시 입력' : '암호화 저장할 Groq API 키 입력'}
                      className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[11px] font-bold text-slate-700 outline-none focus:border-[#3182F6]"
                    />
                    <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-[9px] font-bold text-[#3182F6] hover:underline">
                      Groq API 키 발급받기 →
                    </a>
                  </label>
                  <label className="block">
                    <span className="text-[10px] font-black text-slate-500">Gemini API Key (네이버 링크 전용)</span>
                    <input
                      type="password"
                      value={aiSmartFillConfig.geminiApiKey}
                      onChange={(e) => setAiSmartFillConfig((prev) => normalizeAiSmartFillConfig({ ...prev, geminiApiKey: e.target.value }))}
                      placeholder={serverAiKeyStatus.hasStoredGeminiKey ? '새 Gemini 키로 교체하려면 다시 입력' : '암호화 저장할 Gemini API 키 입력'}
                      className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[11px] font-bold text-slate-700 outline-none focus:border-[#3182F6]"
                    />
                    <p className="mt-1 text-[9px] font-bold text-slate-400">Gemini는 링크 기반 정보 추출 전용이며, 텍스트/이미지 자동채우기는 계속 Groq를 사용합니다.</p>
                  </label>
                  <label className="block">
                    <span className="text-[10px] font-black text-slate-500">Perplexity API Key (선택, 있으면 우선 사용)</span>
                    <input
                      type="password"
                      value={aiSmartFillConfig.perplexityApiKey}
                      onChange={(e) => setAiSmartFillConfig((prev) => normalizeAiSmartFillConfig({ ...prev, perplexityApiKey: e.target.value }))}
                      placeholder={serverAiKeyStatus.hasStoredPerplexityKey ? '새 Perplexity 키로 교체하려면 다시 입력' : '암호화 저장할 Perplexity API 키 입력'}
                      className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[11px] font-bold text-slate-700 outline-none focus:border-[#3182F6]"
                    />
                    <p className="mt-1 text-[9px] font-bold text-slate-400">없으면 Gemini 키로 무료 AI 추천을 시도하고, 있으면 Perplexity를 우선 사용합니다.</p>
                  </label>
                  <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[10px] font-bold text-slate-500 leading-relaxed">
                    {auth.currentUser && !auth.currentUser.isGuest ? (
                      <>
                        <div className="flex items-center justify-between gap-2">
                          <span>{serverAiKeyStatus.loading ? '저장 상태 확인 중...' : `Groq ${serverAiKeyStatus.hasStoredGroqKey ? '저장됨' : '없음'} · Gemini ${serverAiKeyStatus.hasStoredGeminiKey ? '저장됨' : '없음'} · Perplexity ${serverAiKeyStatus.hasStoredPerplexityKey ? '저장됨' : '없음'}`}</span>
                          <button
                            type="button"
                            onClick={() => { void fetchServerAiKeyStatus(); }}
                            className="text-[10px] font-black text-[#3182F6]"
                          >
                            새로고침
                          </button>
                        </div>
                        {serverAiKeyStatus.updatedAt && (
                          <div className="mt-1 text-[9px] text-slate-400">최근 저장: {new Date(serverAiKeyStatus.updatedAt).toLocaleString('ko-KR')}</div>
                        )}
                      </>
                    ) : (
                      <span>게스트/비로그인 상태에서는 현재 세션 동안만 메모리에 보관됩니다.</span>
                    )}
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] font-bold text-slate-500 leading-relaxed">
                    로그인 상태에서는 서버가 Groq/Gemini/Perplexity 키를 암호화해 Firestore에 저장합니다. Groq 분석, Gemini 링크 분석, 근처 AI 추천은 저장된 서버 키를 재사용할 수 있고, 이 브라우저 localStorage에는 평문 키를 저장하지 않습니다.
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => { void saveServerAiKey(); }}
                    className="px-3 py-2 rounded-xl border border-blue-200 bg-blue-50 text-[11px] font-black text-[#3182F6] hover:bg-blue-100"
                  >
                    키 저장
                  </button>
                  <button
                    type="button"
                    onClick={() => { void deleteServerAiKey(); }}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-[11px] font-black text-slate-500 hover:border-slate-300"
                  >
                    저장 키 삭제
                  </button>
                  <button
                    type="button"
                    onClick={() => setAiSmartFillConfig((prev) => ({ ...DEFAULT_AI_SMART_FILL_CONFIG, apiKey: '', geminiApiKey: '', perplexityApiKey: '' }))}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-[11px] font-black text-slate-500 hover:border-slate-300"
                  >
                    입력 초기화
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAiSettings(false)}
                    className="px-4 py-2 rounded-xl bg-[#3182F6] text-white text-[11px] font-black"
                  >
                    닫기
                  </button>
                </div>
              </div>
            </>

  );
};

export default AiSettingsModal;
