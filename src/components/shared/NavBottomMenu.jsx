import React from 'react';
import { CheckSquare, Calendar, Wand2, ChevronDown, MessageSquare, LogOut } from 'lucide-react';
import { normalizeAiSmartFillConfig } from '../../utils/ai.js';

const NavBottomMenu = ({
  showNavMenu, setShowNavMenu,
  canManagePlan,
  leftSidebarWidth,
  user, isDirty,
  saveItineraryManually,
  setShowPlanManager,
  navAiExpanded, setNavAiExpanded,
  aiSmartFillConfig, setAiSmartFillConfig,
  serverAiKeyStatus,
  saveServerAiKey, deleteServerAiKey,
  setShowAiSettings,
  useAiSmartFill, setUseAiSmartFill,
  setShowChecklistModal,
  setShowSmartFillGuide,
  onMoveAllToLibrary,
  handleLogin, handleLogout,
  auth,
}) => (
  <div className="relative p-4 border-t border-slate-100 bg-white shrink-0 mt-auto">
    {showNavMenu && (
      <div className="fixed inset-0 z-[9980]" onClick={() => setShowNavMenu(false)} />
    )}
    {canManagePlan && (
      <div className="relative mb-2.5">
        <button
          onClick={() => setShowNavMenu((v) => !v)}
          className="w-full px-3 py-2.5 rounded-[18px] border border-slate-200 bg-white text-[11px] font-black text-slate-500 hover:border-[#3182F6] hover:text-[#3182F6] transition-colors flex items-center justify-between gap-2 shadow-[0_10px_24px_-20px_rgba(15,23,42,0.28)]"
        >
          <span className="flex items-center gap-1.5">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
            메뉴
          </span>
          <span className={`transition-transform ${showNavMenu ? 'rotate-180' : ''}`}>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
          </span>
        </button>
        {showNavMenu && (
          <div className="fixed rounded-[20px] border border-slate-200 overflow-hidden z-[9990] animate-in slide-in-from-bottom-2" style={{ bottom: '80px', left: '12px', width: `calc(${leftSidebarWidth} - 24px)`, background: '#ffffff', boxShadow: '0 -8px 32px -8px rgba(15,23,42,0.18)' }}>
            {user && !user.isGuest && (
              <>
                <button
                  onClick={() => { saveItineraryManually(); setShowNavMenu(false); }}
                  className={`w-full px-4 py-3 text-left text-[12px] font-bold flex items-center gap-2.5 transition-colors ${isDirty ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' : 'text-slate-400 hover:bg-slate-50'}`}
                >
                  <CheckSquare size={13} className={isDirty ? 'text-amber-500' : 'text-slate-300'} />
                  {isDirty ? '저장 (변경됨)' : '저장 완료'}
                </button>
                <div className="h-px bg-slate-100 mx-4" />
              </>
            )}
            <button
              onClick={() => { setShowPlanManager(true); setShowNavMenu(false); }}
              className="w-full px-4 py-3 text-left text-[12px] font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
            >
              <Calendar size={13} className="text-slate-400" />
              일정 목록
            </button>
            <div className="h-px bg-slate-100 mx-4" />
            <button
              onClick={() => setNavAiExpanded((v) => !v)}
              className="w-full px-4 py-3 text-left text-[12px] font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
            >
              <Wand2 size={13} className="text-slate-400" />
              AI 설정
              <ChevronDown size={11} className={`ml-auto text-slate-400 transition-transform ${navAiExpanded ? 'rotate-180' : ''}`} />
            </button>
            {navAiExpanded && (
              <div className="px-4 pb-3 space-y-2.5">
                <label className="block">
                  <span className="text-[10px] font-black text-slate-500">Groq API Key</span>
                  <input
                    type="password"
                    value={aiSmartFillConfig.apiKey}
                    onChange={(e) => setAiSmartFillConfig((prev) => normalizeAiSmartFillConfig({ ...prev, apiKey: e.target.value }))}
                    placeholder={serverAiKeyStatus.hasStoredGroqKey ? '새 Groq 키로 교체' : 'Groq API 키 입력'}
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
                    placeholder={serverAiKeyStatus.hasStoredGeminiKey ? '새 Gemini 키로 교체' : 'Gemini API 키 입력'}
                    className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[11px] font-bold text-slate-700 outline-none focus:border-[#3182F6]"
                  />
                  <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-[9px] font-bold text-[#3182F6] hover:underline">
                    Gemini API 키 발급받기 →
                  </a>
                </label>
                <label className="block">
                  <span className="text-[10px] font-black text-slate-500">Jina API Key (선택, v2 지도검색 속도/안정성 향상)</span>
                  <input
                    type="password"
                    value={aiSmartFillConfig.perplexityApiKey}
                    onChange={(e) => setAiSmartFillConfig((prev) => normalizeAiSmartFillConfig({ ...prev, perplexityApiKey: e.target.value }))}
                    placeholder={serverAiKeyStatus.hasStoredPerplexityKey ? '새 Jina 키로 교체' : 'jina.ai에서 발급한 API 키 입력 (없어도 동작)'}
                    className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[11px] font-bold text-slate-700 outline-none focus:border-[#3182F6]"
                  />
                  <a href="https://jina.ai/reader/#apiform" target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-[9px] font-bold text-emerald-500 hover:underline">
                    Jina API 키 발급받기 →
                  </a>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => { void saveServerAiKey(); }}
                    className="px-2.5 py-1.5 rounded-xl border border-blue-200 bg-blue-50 text-[10px] font-black text-[#3182F6] hover:bg-blue-100"
                  >
                    키 저장
                  </button>
                  <button
                    type="button"
                    onClick={() => { void deleteServerAiKey(); }}
                    className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-[10px] font-black text-slate-500 hover:border-slate-300"
                  >
                    삭제
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAiSettings(true)}
                    className="ml-auto px-2.5 py-1.5 rounded-xl border border-slate-200 text-[10px] font-black text-slate-400 hover:border-slate-300"
                  >
                    상세 설정
                  </button>
                </div>
                <div className="text-[9px] font-bold text-slate-400 leading-relaxed">
                  {auth.currentUser && !auth.currentUser.isGuest
                    ? `Groq ${serverAiKeyStatus.hasStoredGroqKey ? '✓' : '✗'} · Gemini ${serverAiKeyStatus.hasStoredGeminiKey ? '✓' : '✗'} · Jina ${serverAiKeyStatus.hasStoredPerplexityKey ? '✓' : '✗'}`
                    : '비로그인: 현재 세션에서만 유지'}
                </div>
              </div>
            )}
            <div className="h-px bg-slate-100 mx-4" />
            <div className="px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors">
              <button
                type="button"
                onClick={() => setUseAiSmartFill((prev) => !prev)}
                className={`w-9 h-5 rounded-full flex items-center transition-colors shrink-0 ${useAiSmartFill ? 'bg-indigo-500' : 'bg-slate-200'}`}
                title="AI 자동채우기 전환"
              >
                <span className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform mx-0.5 ${useAiSmartFill ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
              <button
                onClick={() => { setUseAiSmartFill((prev) => !prev); setShowNavMenu(false); }}
                className="min-w-0 flex-1 text-left"
              >
                <div className={`text-[12px] font-black ${useAiSmartFill ? 'text-indigo-600' : 'text-slate-700'}`}>AI 자동채우기 {useAiSmartFill ? 'ON' : 'OFF'}</div>
                <div className="text-[10px] font-bold text-slate-400">스마트 붙여넣기와 추천 입력에 사용</div>
              </button>
            </div>
            <div className="h-px bg-slate-100 mx-4" />
            {onMoveAllToLibrary && (
              <>
                <button
                  onClick={() => { onMoveAllToLibrary(); setShowNavMenu(false); }}
                  className="w-full px-4 py-3 text-left text-[12px] font-bold text-slate-700 hover:bg-amber-50 hover:text-amber-600 flex items-center gap-2.5 transition-colors"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8V21H3V8"/><path d="M23 3H1v5h22V3z"/><path d="M10 12h4"/></svg>
                  일정 모두 내장소로 보내기
                </button>
                <div className="h-px bg-slate-100 mx-4" />
              </>
            )}
            <button
              onClick={() => { setShowChecklistModal(true); setShowNavMenu(false); }}
              className="w-full px-4 py-3 text-left text-[12px] font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2.5 transition-colors"
            >
              <CheckSquare size={13} className="text-slate-400" />
              체크리스트 확인
            </button>
            <div className="h-px bg-slate-100 mx-4" />
            <button
              onClick={() => { setShowSmartFillGuide(true); setShowNavMenu(false); }}
              className="w-full px-4 py-3 text-left text-[12px] font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2.5 transition-colors"
            >
              <MessageSquare size={13} className="text-slate-400" />
              자동입력 학습 지침
            </button>
            <div className="h-px bg-slate-100 mx-4" />
            {user ? (
              <div className="px-4 py-3 flex items-center gap-3 bg-slate-50/70">
                <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-sm bg-[#c2410c] text-white flex items-center justify-center font-black text-[12px]">
                  {user.photoURL ? <img src={user.photoURL} alt="User" /> : (String(user.displayName || user.email || 'U').trim().charAt(0) || 'U').toUpperCase()}
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[12px] font-black text-slate-800 truncate">{user.displayName || '사용자'}</span>
                  <span className="text-[10px] font-bold text-slate-400 truncate">{user.email || (user.isGuest ? '게스트 모드' : '로그인 계정')}</span>
                </div>
                {!user.isGuest ? (
                  <button
                    onClick={() => { handleLogout(); setShowNavMenu(false); }}
                    className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"
                    title="로그아웃"
                  >
                    <LogOut size={13} />
                  </button>
                ) : (
                  <button
                    onClick={() => { handleLogin(); setShowNavMenu(false); }}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-black text-[#3182F6] bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors"
                    title="로그인"
                  >
                    로그인
                  </button>
                )}
              </div>
            ) : (
              <div className="px-4 py-3 flex items-center justify-between gap-2 bg-slate-50/70">
                <div className="flex flex-col">
                  <span className="text-[12px] font-black text-slate-700">공유 보기 모드</span>
                  <span className="text-[10px] font-bold text-slate-400">로그인하면 개인 일정으로 저장됩니다</span>
                </div>
                <button
                  onClick={() => { handleLogin(); setShowNavMenu(false); }}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-black text-[#3182F6] bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors"
                  title="로그인"
                >
                  로그인
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    )}
  </div>
);

export default NavBottomMenu;
