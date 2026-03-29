import React from 'react';
import { Navigation, Calendar, Wand2, Share2, ArrowRight, SlidersHorizontal } from 'lucide-react';

export const LoadingScreen = () => (
  <div className="min-h-screen bg-[#F2F4F6] flex flex-col items-center justify-center gap-4">
    <div className="w-12 h-12 border-4 border-[#3182F6]/20 border-t-[#3182F6] rounded-full animate-spin" />
    <div className="font-black text-slate-400 text-sm animate-pulse">본인 인증 확인 중...</div>
  </div>
);

export const LoginScreen = ({ handleLogin, handleGuestMode, authError }) => (
  <div className="min-h-screen bg-[#F2F4F6] flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-60 animate-pulse" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px] opacity-60 animate-pulse" style={{ animationDelay: '1s' }} />
    <div className="bg-white border border-white/90 p-6 sm:p-8 rounded-[36px] shadow-[0_30px_70px_rgba(15,23,42,0.08)] max-w-[440px] w-full z-10">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-[#3182F6] to-indigo-500 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20">
            <Navigation size={32} className="text-white fill-white/20" />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-[30px] font-black tracking-tight text-slate-800 leading-tight">Anti Planer</h1>
            <p className="text-slate-500 font-bold text-[14px] leading-relaxed">
              일정, 이동, 영업시간, 스마트 붙여넣기를<br />한 흐름으로 정리하는 여행 플래너
            </p>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200/90 bg-white shadow-[0_12px_28px_-18px_rgba(15,23,42,0.16)] overflow-hidden">
          <div className="px-4 py-3 flex items-center gap-2 text-[12px] font-black text-slate-700">
            <div className="w-7 h-7 rounded-xl bg-blue-50 flex items-center justify-center text-[#3182F6]"><Calendar size={14} /></div>
            시작 방법
          </div>
          <div className="h-px bg-slate-100" />
          <div className="p-4 flex flex-col gap-3">
            <button onClick={handleLogin} className="group relative flex items-center justify-center gap-3 bg-white border border-slate-200 hover:border-[#3182F6] hover:bg-blue-50 px-5 py-3.5 rounded-[18px] transition-colors duration-300 shadow-sm hover:shadow-[0_16px_30px_-18px_rgba(49,130,246,0.35)]">
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
              <span className="text-[15px] font-black text-slate-700 group-hover:text-[#3182F6]">Google 계정으로 시작하기</span>
            </button>
            <button onClick={handleGuestMode} className="flex items-center justify-between gap-3 rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3 text-left transition-colors hover:bg-slate-100">
              <div className="flex flex-col">
                <span className="text-[13px] font-black text-slate-700">로그인 없이 둘러보기</span>
                <span className="text-[11px] font-bold text-slate-400">로컬 저장만 사용합니다</span>
              </div>
              <ArrowRight size={14} className="text-slate-300" />
            </button>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-[0_12px_28px_-18px_rgba(15,23,42,0.12)] overflow-hidden">
          <div className="px-4 py-3 flex items-center gap-2 text-[12px] font-black text-slate-700">
            <div className="w-7 h-7 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500"><SlidersHorizontal size={14} /></div>
            로그인 후 가능
          </div>
          <div className="h-px bg-slate-100" />
          <div className="px-4 py-2.5 flex flex-col">
            <div className="flex items-center gap-3 py-2.5 text-[12px] font-bold text-slate-600"><Calendar size={13} className="text-slate-400" />일정 저장 및 불러오기</div>
            <div className="h-px bg-slate-100" />
            <div className="flex items-center gap-3 py-2.5 text-[12px] font-bold text-slate-600"><Wand2 size={13} className="text-slate-400" />AI 설정 및 스마트 붙여넣기</div>
            <div className="h-px bg-slate-100" />
            <div className="flex items-center gap-3 py-2.5 text-[12px] font-bold text-slate-600"><Share2 size={13} className="text-slate-400" />여행 일정 공유 및 동기화</div>
          </div>
        </div>
      </div>
      {authError && (
        <div className="mt-5 text-left text-[11px] font-bold text-red-500 bg-red-50 border border-red-200 rounded-xl px-3 py-2 whitespace-pre-wrap">{authError}</div>
      )}
    </div>
  </div>
);
