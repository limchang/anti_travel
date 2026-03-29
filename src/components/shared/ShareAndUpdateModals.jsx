import React from 'react';
import { X, Sparkles, CheckSquare } from 'lucide-react';
import useUIStore from '../../stores/useUIStore.js';

export const ShareManagerModal = ({ shareSettings, updateShareConfig, copyShareLink, shareCopied }) => {
  const { setShowShareManager } = useUIStore();
  return (
    <>
      <div className="fixed inset-0 z-[400] bg-black" onClick={() => setShowShareManager(false)} />
      <div className="fixed z-[401] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(460px,92vw)] bg-white border border-slate-200 shadow-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[14px] font-black text-slate-800">공유 범위 / 편집 권한</p>
          <button className="text-slate-400 hover:text-slate-600" onClick={() => setShowShareManager(false)}><X size={16} /></button>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <select value={shareSettings.visibility} onChange={(e) => updateShareConfig({ ...shareSettings, visibility: e.target.value })} className="bg-slate-50 border border-slate-200 px-2.5 py-2 text-[11px] font-bold text-slate-700 outline-none focus:border-[#3182F6]">
            <option value="private">비공개</option>
            <option value="link">링크 소지자 공개</option>
            <option value="public">공개</option>
          </select>
          <select value={shareSettings.permission} onChange={(e) => updateShareConfig({ ...shareSettings, permission: e.target.value })} className="bg-slate-50 border border-slate-200 px-2.5 py-2 text-[11px] font-bold text-slate-700 outline-none focus:border-[#3182F6]">
            <option value="viewer">보기만</option>
            <option value="editor">편집 가능</option>
          </select>
        </div>
        <button onClick={() => { void copyShareLink(); }} className="w-full py-2 border border-blue-200 bg-blue-50 text-[#3182F6] text-[11px] font-black hover:bg-blue-100 transition-colors">
          {shareCopied ? '복사됨' : '공유 링크 복사'}
        </button>
        <p className="text-[10px] text-slate-400 font-bold mt-2">링크에는 현재 플랜 ID가 포함됩니다.</p>
      </div>
    </>
  );
};

export const UpdateModal = ({ latestUpdate, APP_VERSION }) => {
  const { setShowUpdateModal } = useUIStore();
  return (
    <div className="fixed inset-0 z-[800] flex items-center justify-center bg-black p-4 transition-colors" onClick={() => setShowUpdateModal(false)}>
      <div className="relative w-full max-w-[340px] bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.12)]" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => setShowUpdateModal(false)} className="absolute right-3.5 top-3.5 flex h-7 w-7 items-center justify-center bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"><X size={14} strokeWidth={2.5} /></button>
        <div className="mb-4">
          <div className="mb-1 inline-flex items-center gap-1.5 bg-blue-50 px-2 py-0.5 text-blue-600">
            <Sparkles size={10} className="fill-blue-600" />
            <span className="text-[9px] font-black uppercase tracking-wider">업데이트 완료</span>
          </div>
          <h3 className="mt-1 text-base font-black text-slate-800">새로운 기능이 변경되었습니다!</h3>
          <p className="mt-1 text-[11.5px] font-bold leading-relaxed text-slate-500">버전 <span className="font-black text-[#3182F6]">{APP_VERSION}</span> 패치가 적용되었습니다.</p>
        </div>
        <div className="mb-5 bg-slate-50 p-3.5">
          <div className="flex items-center gap-1.5 mb-2.5 border-b border-slate-200 pb-2">
            <CheckSquare size={13} className="text-[#3182F6]" />
            <span className="text-[11.5px] font-black text-slate-700">이번 업데이트 내용</span>
          </div>
          <div className="text-[11.5px] font-bold text-slate-600 leading-[1.6] whitespace-pre-wrap whitespace-pre-line pl-1 border-l-2 border-slate-200">{latestUpdate.message}</div>
        </div>
        <button onClick={() => setShowUpdateModal(false)} className="w-full bg-[#3182F6] py-3 text-[13px] font-black tracking-wide text-white transition-colors hover:bg-blue-600">확인하고 시작하기</button>
      </div>
    </div>
  );
};
