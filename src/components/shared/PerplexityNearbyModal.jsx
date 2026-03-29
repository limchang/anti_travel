import React from 'react';
import { X, Plus, Map as MapIcon } from 'lucide-react';

const PerplexityNearbyModal = ({ perplexityNearbyModal, setPerplexityNearbyModal, focusedMapTarget, focusRecommendationOnMap, openNaverPlaceSearch, addRecommendedPlaceToLibrary, buildRecommendationMapId }) => {
  const close = () => setPerplexityNearbyModal({ open: false, loading: false, provider: '', itemName: '', summary: '', recommendations: [], citations: [], error: '' });

  return (
    <>
      <div className="fixed inset-0 z-[402] bg-black" onClick={close} />
      <div className="fixed z-[403] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(560px,94vw)] bg-white border border-slate-200 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.45)] overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-start justify-between gap-3">
          <div>
            <p className="text-[14px] font-black text-slate-800">AI 근처 추천</p>
            <p className="mt-1 text-[10px] font-bold text-slate-400 truncate">{perplexityNearbyModal.itemName || '현재 일정'} 기준 주변 추천</p>
          </div>
          <button type="button" className="text-slate-400 hover:text-slate-600" onClick={close}><X size={16} /></button>
        </div>
        <div className="px-5 py-4 max-h-[68vh] overflow-y-auto no-scrollbar">
          {perplexityNearbyModal.loading ? (
            <div className="border border-violet-100 bg-violet-50/60 px-4 py-6 text-center">
              <p className="text-[13px] font-black text-violet-700">AI가 주변 장소를 찾는 중입니다.</p>
              <p className="mt-1 text-[10px] font-bold text-violet-400">현재 장소, 주소, 다음 일정 시간까지 고려해서 추천합니다.</p>
            </div>
          ) : perplexityNearbyModal.error ? (
            <div className="border border-red-100 bg-red-50 px-4 py-5 text-center">
              <p className="text-[12px] font-black text-red-600">추천을 불러오지 못했습니다.</p>
              <p className="mt-1 text-[10px] font-bold text-red-400 break-words">{perplexityNearbyModal.error}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {perplexityNearbyModal.summary && (
                <div className="border border-violet-100 bg-violet-50/60 px-4 py-3 text-[11px] font-bold text-violet-700 leading-relaxed">
                  {perplexityNearbyModal.provider && <div className="mb-1 text-[9px] uppercase tracking-[0.12em] text-violet-400">{perplexityNearbyModal.provider === 'perplexity' ? 'Perplexity' : 'Gemini'}</div>}
                  {perplexityNearbyModal.summary}
                </div>
              )}
              {perplexityNearbyModal.recommendations.map((rec, idx) => {
                const recId = buildRecommendationMapId(rec, idx);
                const isFocused = focusedMapTarget?.kind === 'recommendation' && focusedMapTarget.id === recId;
                return (
                  <div key={`${rec.name}-${idx}`} id={`recommendation-card-${recId}`} onClick={() => focusRecommendationOnMap(recId)} className={`border bg-white px-4 py-4 shadow-[0_10px_24px_-20px_rgba(15,23,42,0.2)] transition-colors ${isFocused ? 'border-[#3182F6]/45 ring-2 ring-[#3182F6]/15' : 'border-slate-200'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="inline-flex items-center bg-violet-50 px-2 py-0.5 text-[9px] font-black text-violet-600 border border-violet-100">추천 {idx + 1}</span>
                          {rec.category && <span className="inline-flex items-center bg-slate-50 px-2 py-0.5 text-[9px] font-black text-slate-500 border border-slate-200">{rec.category}</span>}
                        </div>
                        <p className="mt-2 text-[15px] font-black text-slate-800 break-words">{rec.name}</p>
                        <p className="mt-1 text-[11px] font-bold text-slate-400 break-words">{rec.address || '주소 정보 없음'}</p>
                      </div>
                      <div className="shrink-0 flex items-center gap-1">
                        <button type="button" onClick={() => openNaverPlaceSearch(rec.name, rec.address)} className="p-1.5 border border-slate-200 text-slate-400 hover:text-[#3182F6] hover:border-[#3182F6]/30 hover:bg-blue-50 transition-colors" title="네이버 지도"><MapIcon size={12} /></button>
                        <button type="button" onClick={() => addRecommendedPlaceToLibrary(rec)} className="p-1.5 border border-slate-200 text-slate-400 hover:text-violet-600 hover:border-violet-200 hover:bg-violet-50 transition-colors" title="내 장소에 추가"><Plus size={12} /></button>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div className="border border-slate-100 bg-slate-50 px-3 py-2">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.12em]">추천 시간</p>
                        <p className="mt-1 text-[12px] font-black text-slate-700">{rec.suggestedTime || '정보 없음'}</p>
                      </div>
                      <div className="border border-slate-100 bg-slate-50 px-3 py-2">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.12em]">예상 이동</p>
                        <p className="mt-1 text-[12px] font-black text-slate-700">{rec.estimatedTravelMinutes ? `${rec.estimatedTravelMinutes}분` : '정보 없음'}</p>
                      </div>
                    </div>
                    {(rec.hoursSummary || rec.why || rec.priceNote) && (
                      <div className="mt-3 space-y-1.5 text-[11px] font-bold text-slate-600 leading-relaxed">
                        {rec.hoursSummary && <p><span className="text-slate-400">운영시간:</span> {rec.hoursSummary}</p>}
                        {rec.why && <p><span className="text-slate-400">추천 이유:</span> {rec.why}</p>}
                        {rec.priceNote && <p><span className="text-slate-400">비용 메모:</span> {rec.priceNote}</p>}
                      </div>
                    )}
                  </div>
                );
              })}
              {!perplexityNearbyModal.recommendations.length && (
                <div className="border border-slate-200 bg-slate-50 px-4 py-5 text-center text-[11px] font-bold text-slate-500">추천 결과가 없습니다.</div>
              )}
              {!!perplexityNearbyModal.citations.length && (
                <div className="border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-[10px] font-black text-slate-500 mb-2">참고 링크</p>
                  <div className="flex flex-col gap-1.5">
                    {perplexityNearbyModal.citations.slice(0, 5).map((url) => (
                      <a key={url} href={url} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-[#3182F6] truncate hover:underline">{url}</a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default React.memo(PerplexityNearbyModal);
