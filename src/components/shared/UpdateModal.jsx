import React from 'react';
import { X } from 'lucide-react';

const UpdateModal = (props) => {
  const p = props;
  if (!p.visible) return null;
  return (
            <div className="fixed inset-0 z-[800] flex items-center justify-center bg-black/40 p-4 transition-all" onClick={() => setShowUpdateModal(false)}>
              <div
                className="relative w-full max-w-[340px] rounded-2xl bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setShowUpdateModal(false)}
                  className="absolute right-3.5 top-3.5 flex h-7 w-7 items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus:outline-none transition-colors"
                >
                  <X size={14} strokeWidth={2.5} />
                </button>
                <div className="mb-4">
                  <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2 py-0.5 text-blue-600">
                    <Sparkles size={10} className="fill-blue-600" />
                    <span className="text-[9px] font-black uppercase tracking-wider">업데이트 완료</span>
                  </div>
                  <h3 className="mt-1 text-base font-black text-slate-800">새로운 기능이 변경되었습니다!</h3>
                  <p className="mt-1 text-[11.5px] font-bold leading-relaxed text-slate-500">
                    버전 <span className="font-black text-[#3182F6]">{APP_VERSION}</span> 패치가 성공적으로 적용되었습니다.
                  </p>
                </div>
                <div className="mb-5 rounded-xl bg-slate-50 p-3.5">
                  <div className="flex items-center gap-1.5 mb-2.5 border-b border-slate-200 pb-2">
                    <CheckSquare size={13} className="text-[#3182F6]" />
                    <span className="text-[11.5px] font-black text-slate-700">이번 업데이트 내용</span>
                  </div>
                  <div className="text-[11.5px] font-bold text-slate-600 leading-[1.6] whitespace-pre-wrap whitespace-pre-line pl-1 border-l-2 border-slate-200">
                    {latestUpdate.message}
                  </div>
                </div>
                <button
                  onClick={() => setShowUpdateModal(false)}
                  className="w-full rounded-xl bg-[#3182F6] py-3 text-[13px] font-black tracking-wide text-white transition-colors hover:bg-blue-600 focus:outline-none"
                >
                  확인하고 시작하기
                </button>
              </div>
            </div>

  );
};

export default UpdateModal;
