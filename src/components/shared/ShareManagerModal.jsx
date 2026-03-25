import React from 'react';
import { X } from 'lucide-react';

const ShareManagerModal = (props) => {
  const p = props;
  if (!p.visible) return null;
  return (
            <>
              <div className="fixed inset-0 z-[291] bg-black/20" onClick={() => setShowShareManager(false)} />
              <div className="fixed z-[292] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(460px,92vw)] bg-white border border-slate-200 rounded-2xl shadow-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[14px] font-black text-slate-800">공유 범위 / 편집 권한</p>
                  <button className="text-slate-400 hover:text-slate-600" onClick={() => setShowShareManager(false)}><X size={16} /></button>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <select
                    value={shareSettings.visibility}
                    onChange={(e) => updateShareConfig({ ...shareSettings, visibility: e.target.value })}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-[11px] font-bold text-slate-700 outline-none focus:border-[#3182F6]"
                  >
                    <option value="private">비공개</option>
                    <option value="link">링크 소지자 공개</option>
                    <option value="public">공개</option>
                  </select>
                  <select
                    value={shareSettings.permission}
                    onChange={(e) => updateShareConfig({ ...shareSettings, permission: e.target.value })}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-[11px] font-bold text-slate-700 outline-none focus:border-[#3182F6]"
                  >
                    <option value="viewer">보기만</option>
                    <option value="editor">편집 가능</option>
                  </select>
                </div>
                <button
                  onClick={() => { void copyShareLink(); }}
                  className="w-full py-2 rounded-xl border border-blue-200 bg-blue-50 text-[#3182F6] text-[11px] font-black hover:bg-blue-100 transition-colors"
                >
                  {shareCopied ? '복사됨' : '공유 링크 복사'}
                </button>
                <p className="text-[10px] text-slate-400 font-bold mt-2">
                  링크에는 현재 플랜 ID가 포함됩니다. (예: 다른 도시 일정 분리 공유)
                </p>
              </div>
            </>

  );
};

export default ShareManagerModal;
