import React from 'react';
import { X, Plus, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { TAG_OPTIONS, ADDRESS_REGEX, normalizeTagOrder, bulkKwToType } from '../../utils/constants.js';
import { normalizeLibraryPlace } from '../../utils/helpers.js';
import { parseBulkPlaceText } from '../../utils/parse.js';
import { safeLocalStorageGet, safeLocalStorageSet } from '../../utils/storage.js';

// 이름 뒤에 붙는 카테고리 키워드 목록
const CATEGORY_KEYWORDS = [
  '지역명소', '명소', '관광', '관광명소', '맛집', '음식점', '레스토랑', '식당',
  '베이커리', '카페', '디저트', '한식', '중식', '양식', '일식', '분식',
  '육류', '고기요리', '해산물', '생선요리', '국밥', '찌개', '탕', '면요리',
  '패스트푸드', '뷔페', '포장마차', '호프', '이자카야', '스시', '라멘', '돈가스',
  '브런치', '스테이크', '피자', '치킨', '햄버거', '수제버거', '핫도그',
  '와인바', '칵테일바', '전통찻집', '빙수', '마카롱', '케이크', '도너츠', '베이글', '샌드위치',
  '떡집', '떡카페', '수목원', '식물원', '해수욕장', '해변', '공원',
  '김밥', '만두', '우동', '소바', '해장국', '한우', '족발', '보쌈',
  '곱창', '막창', '삼겹살', '갈비', '냉면', '칼국수', '수제비',
  '펍', '바\\(BAR\\)',
];
const CATEGORY_SUFFIX_RE = new RegExp(`[,\\s]*(${CATEGORY_KEYWORDS.join('|')})[,\\s]*$`, 'g');

const cleanCategorySuffix = (name) => {
  let result = String(name || '');
  // 반복 제거 (여러 카테고리가 연속 붙어있을 수 있음)
  for (let i = 0; i < 3; i++) {
    const next = result.replace(CATEGORY_SUFFIX_RE, '').trim();
    if (next === result) break;
    result = next;
  }
  return result;
};

const BulkAddModal = ({
  showBulkAddModal, setShowBulkAddModal,
  bulkAddText, setBulkAddText,
  bulkAddParsed, setBulkAddParsed,
  bulkAddLoading, setBulkAddLoading,
  showInfoToast, addPlace, itinerary, setItinerary,
  runJinaSmartFill,
  searchAddressFromPlaceName,
  tripRegion = '',
}) => {
  if (!showBulkAddModal) return null;
  return (
            <>
              <div className="fixed inset-0 z-[400] bg-black/30 backdrop-blur-sm" onClick={() => setShowBulkAddModal(false)} />
              <div className="fixed z-[401] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(560px,94vw)] bg-white border border-slate-200 rounded-2xl shadow-xl flex flex-col" style={{ maxHeight: 'min(96vh, 1100px)' }}>
                <div className="flex items-center justify-between p-4 border-b border-slate-100 shrink-0">
                  <p className="text-[14px] font-black text-slate-800">여러 장소 추가하기</p>
                  <button onClick={() => setShowBulkAddModal(false)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {bulkAddParsed.length === 0 ? (
                    <>
                      {(() => {
                        const addressRe = /^(제주|서울|부산|대구|인천|광주|대전|울산|세종|경기|강원|충북|충남|충청|전북|전남|전라|경북|경남|경상|제주특별자치도|서울특별시|부산광역시|대구광역시|인천광역시|광주광역시|대전광역시|울산광역시|세종특별자치시|경기도|강원도|강원특별자치도|충청북도|충청남도|전라북도|전북특별자치도|전라남도|경상북도|경상남도)[\s도시구군읍면리동로길]/;
                        const lines = bulkAddText.split('\n');
                        let nameCount = 0;
                        const coloredLines = lines.map((line, li) => {
                          const trimmed = line.trim();
                          if (!trimmed) return 'none';
                          const isAddr = addressRe.test(trimmed);
                          if (isAddr) return 'addr';
                          // 이름 줄: 주소가 아닌 모든 비어있지 않은 줄
                          nameCount++;
                          return 'name';
                        });
                        return (
                          <>
                            <div className="relative w-full h-[260px] rounded-xl border border-slate-200 overflow-hidden focus-within:border-[#3182F6]" style={{ background: '#fff' }}>
                              {/* 하이라이트 배경 레이어 */}
                              <div
                                aria-hidden="true"
                                id="bulk-highlight-backdrop"
                                className="absolute inset-0 px-3 py-2.5 overflow-y-auto pointer-events-none"
                                style={{ font: '700 11px/1.625 ui-sans-serif,system-ui,sans-serif', whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word' }}
                              >
                                {lines.map((line, li) => {
                                  const kind = coloredLines[li];
                                  const commaPos = line.indexOf(',');
                                  if (kind === 'name') {
                                    if (commaPos > 0) {
                                      return <div key={li}><span style={{ color: '#3182F6' }}>{line.slice(0, commaPos)}</span><span style={{ color: '#94a3b8', fontSize: '10px' }}>{line.slice(commaPos)}</span></div>;
                                    }
                                    return <div key={li} style={{ color: '#3182F6' }}>{line}</div>;
                                  }
                                  if (kind === 'addr') return <div key={li} style={{ color: '#059669' }}>{line}</div>;
                                  return <div key={li} style={{ color: '#94a3b8' }}>{line || '\u00A0'}</div>;
                                })}
                              </div>
                              {/* 실제 textarea — 텍스트 투명, 캐럿만 보임 */}
                              <textarea
                                value={bulkAddText}
                                onChange={(e) => setBulkAddText(e.target.value)}
                                onPaste={(e) => {
                                  e.preventDefault();
                                  const pasted = e.clipboardData.getData('text/plain');
                                  const cleaned = pasted.replace(/\n{3,}/g, '\n\n');
                                  const ta = e.target;
                                  const start = ta.selectionStart;
                                  const end = ta.selectionEnd;
                                  const prev = bulkAddText;
                                  const next = prev.slice(0, start) + cleaned + prev.slice(end);
                                  setBulkAddText(next);
                                  requestAnimationFrame(() => { const pos = start + cleaned.length; ta.selectionStart = ta.selectionEnd = pos; });
                                }}
                                onScroll={(e) => { const bd = document.getElementById('bulk-highlight-backdrop'); if (bd) bd.scrollTop = e.target.scrollTop; }}
                                placeholder={"장소명과 주소를 입력하거나\n카카오맵 공유 텍스트를 붙여넣으세요\n\n예시)\n성수연방\n서울 성동구 연무장길 11"}
                                className="absolute inset-0 w-full h-full px-3 py-2.5 outline-none resize-none"
                                style={{ font: '700 11px/1.625 ui-sans-serif,system-ui,sans-serif', color: 'transparent', caretColor: '#334155', background: 'transparent', whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word' }}
                                autoFocus
                              />
                            </div>
                            <div className="flex items-center gap-3 text-[9px] font-bold text-slate-400">
                              {nameCount > 0 && <span>{nameCount}개 장소 감지</span>}
                              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#3182F6]" /> 상호</span>
                              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> 주소</span>
                              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-slate-300" /> 무시</span>
                            </div>
                          </>
                        );
                      })()}
                      <button
                        type="button"
                        onClick={async () => {
                          const text = bulkAddText.trim() || await navigator.clipboard.readText().catch(() => '');
                          if (!text) { showInfoToast('텍스트를 입력하거나 붙여넣기하세요.'); return; }
                          setBulkAddLoading(true);
                          const parsed = parseBulkPlaceText(text || bulkAddText);
                          setBulkAddParsed(parsed);
                          setBulkAddLoading(false);
                          if (parsed.length === 0) showInfoToast('파싱된 장소가 없습니다. 형식을 확인해주세요.');
                        }}
                        disabled={bulkAddLoading}
                        className="w-full py-2.5 rounded-xl bg-[#3182F6] text-white text-[12px] font-black hover:bg-blue-600 transition-colors disabled:opacity-50"
                      >
                        {bulkAddLoading ? '분석 중...' : '장소 분석하기'}
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            const text = await navigator.clipboard.readText();
                            setBulkAddText(text);
                          } catch { showInfoToast('클립보드 접근 권한이 없습니다.'); }
                        }}
                        className="w-full py-2 rounded-xl border border-slate-200 text-[11px] font-black text-slate-600 hover:border-[#3182F6] hover:text-[#3182F6] transition-colors"
                      >
                        클립보드에서 붙여넣기
                      </button>
                      {/* 네이버 내장소 공유 링크 */}
                      <div className="border-t border-slate-100 pt-3 mt-1">
                        <p className="text-[10px] font-black text-slate-500 mb-1.5">네이버 내장소 공유 링크로 불러오기</p>
                        <div className="flex gap-2">
                          <input
                            id="naver-share-link-input"
                            type="text"
                            placeholder="naver.me/... 또는 map.naver.com/.../folder/... 링크"
                            className="flex-1 min-w-0 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[11px] font-bold text-slate-700 outline-none focus:border-emerald-400"
                          />
                          <button
                            type="button"
                            disabled={bulkAddLoading}
                            onClick={async () => {
                              const input = document.getElementById('naver-share-link-input');
                              const url = String(input?.value || '').trim();
                              if (!url) { showInfoToast('공유 링크를 입력해주세요.'); return; }
                              setBulkAddLoading(true);
                              try {
                                let folderId = null;
                                // 1. URL에서 직접 폴더 ID 추출
                                const directMatch = url.match(/folder\/([a-f0-9]{32})/);
                                if (directMatch) {
                                  folderId = directMatch[1];
                                }
                                // 2. naver.me 단축 URL → Cloud Function으로 리다이렉트 URL 추출
                                if (!folderId && /naver\.me\//.test(url)) {
                                  try {
                                    const res = await fetch(`https://asia-northeast3-anti-planer.cloudfunctions.net/resolveRedirect?url=${encodeURIComponent(url)}`);
                                    if (res.ok) {
                                      const data = await res.json();
                                      const m = (data.url || '').match(/folder\/([a-f0-9]{32})/);
                                      if (m) folderId = m[1];
                                    }
                                  } catch {}
                                  if (!folderId) {
                                    setBulkAddLoading(false);
                                    showInfoToast('단축 URL 변환 실패. 긴 URL을 직접 붙여넣어주세요.');
                                    return;
                                  }
                                }
                                // 3. map.naver.com/p/favorite 또는 sharedPlace 형식
                                if (!folderId && /map\.naver\.com/.test(url)) {
                                  const m = url.match(/folder\/([a-f0-9]{32})/);
                                  if (m) folderId = m[1];
                                }
                                // 4. pages.map.naver.com 직접 입력
                                if (!folderId && /pages\.map\.naver\.com/.test(url)) {
                                  const m = url.match(/detail-list\/([a-f0-9]{32})/);
                                  if (m) folderId = m[1];
                                }

                                if (!folderId) {
                                  showInfoToast('폴더 ID를 찾을 수 없습니다. URL을 확인해주세요.');
                                  setBulkAddLoading(false);
                                  return;
                                }

                                // 4. pages.map.naver.com으로 장소 목록 가져오기
                                const detailUrl = `https://pages.map.naver.com/save-pages/pc/detail-list/${folderId}?lang=ko`;
                                const folderContent = await (await fetch(`https://r.jina.ai/${detailUrl}`)).text();
                                // 장소 이름 + 카테고리 + 주소 추출
                                // 패턴: *   **장소명**  →  카테고리  →  주소
                                const lines = folderContent.split('\n');
                                const places = [];
                                for (let i = 0; i < lines.length; i++) {
                                  const line = lines[i].trim();
                                  const boldMatch = line.match(/\*\s+\*\*(.+?)\*\*/);
                                  if (!boldMatch) continue;
                                  const name = boldMatch[1].trim();
                                  if (!name || /네이버지도|저장한\s*장소|내\s*장소|Naver|save-pages/.test(name)) continue;
                                  // 다음 줄들에서 카테고리와 주소 찾기
                                  let category = '';
                                  let address = '';
                                  for (let j = i + 1; j < Math.min(i + 6, lines.length); j++) {
                                    const next = lines[j].trim();
                                    if (!next || /^!\[/.test(next)) continue; // 빈 줄이나 이미지 스킵
                                    if (/^(서울|부산|대구|인천|광주|대전|울산|세종|경기|강원|충북|충남|전북|전남|경북|경남|제주|경상)/.test(next)) {
                                      address = next;
                                      break;
                                    }
                                    if (!category && !next.startsWith('*') && !next.startsWith('#')) {
                                      category = next;
                                    }
                                  }
                                  // 카테고리로 태그 매핑
                                  const mappedType = category ? bulkKwToType(category) : null;
                                  const types = mappedType ? [mappedType] : ['place'];
                                  places.push({ name, types, address, selected: true });
                                }
                                if (places.length) {
                                  setBulkAddParsed(places);
                                  showInfoToast(`${places.length}개 장소를 불러왔습니다.`);
                                } else {
                                  showInfoToast('장소를 찾지 못했습니다. 링크를 확인해주세요.');
                                }
                              } catch (err) {
                                showInfoToast(`링크 분석 실패: ${err?.message || '오류'}`);
                              } finally {
                                setBulkAddLoading(false);
                              }
                            }}
                            className="shrink-0 px-4 py-2 rounded-lg bg-emerald-500 text-white text-[11px] font-black hover:bg-emerald-600 transition-colors disabled:opacity-50"
                          >
                            {bulkAddLoading ? '불러오는 중...' : '불러오기'}
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-[11px] font-black text-slate-700">{bulkAddParsed.length}개 장소 감지됨</p>
                        <div className="flex gap-2 flex-wrap">
                          <button type="button" onClick={() => {
                            setBulkAddParsed(prev => prev.map(p => {
                              const cleaned = cleanCategorySuffix(p.name);
                              return cleaned !== p.name ? { ...p, name: cleaned } : p;
                            }));
                            showInfoToast('카테고리 키워드를 제거했습니다.');
                          }} className="text-[10px] font-black text-orange-500 hover:underline">카테고리 제거</button>
                          {searchAddressFromPlaceName && (
                            <button type="button" onClick={async () => {
                              const selected = bulkAddParsed.filter(p => p.selected && !p.address);
                              if (!selected.length) { showInfoToast('주소가 없는 장소가 없습니다.'); return; }
                              showInfoToast(`${selected.length}개 장소 주소 검색 시작...`);
                              for (let idx = 0; idx < bulkAddParsed.length; idx++) {
                                const item = bulkAddParsed[idx];
                                if (!item.selected || item.address) continue;
                                try {
                                  const result = await searchAddressFromPlaceName(item.name, tripRegion);
                                  if (result?.address) {
                                    setBulkAddParsed(prev => prev.map((p, i) => i !== idx ? p : { ...p, address: result.address }));
                                  }
                                } catch { /* silent */ }
                              }
                              showInfoToast('주소 자동 채우기 완료!');
                            }} className="text-[10px] font-black text-[#3182F6] hover:underline">주소 자동 채우기</button>
                          )}
                          <button type="button" onClick={() => setBulkAddParsed(prev => prev.map(p => ({ ...p, selected: true })))} className="text-[10px] font-black text-[#3182F6] hover:underline">전체선택</button>
                          <button type="button" onClick={() => setBulkAddParsed(prev => prev.map(p => ({ ...p, selected: false })))} className="text-[10px] font-black text-slate-400 hover:underline">전체해제</button>
                          <button type="button" onClick={() => { setBulkAddParsed([]); setBulkAddText(''); }} className="text-[10px] font-black text-slate-400 hover:underline">다시 입력</button>
                        </div>
                      </div>
                      <div className="space-y-1.5 max-h-[500px] overflow-y-auto">
                        {bulkAddParsed.map((item, idx) => (
                          <div
                            key={idx}
                            onClick={() => setBulkAddParsed(prev => prev.map((p, i) => i === idx ? { ...p, selected: !p.selected } : p))}
                            className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-colors ${item.selected ? 'border-blue-200 bg-blue-50/60' : 'border-slate-200 bg-slate-50 opacity-50'}`}
                          >
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${item.selected ? 'border-[#3182F6] bg-[#3182F6]' : 'border-slate-300 bg-white'}`}>
                              {item.selected && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 flex-wrap" onClick={(e) => e.stopPropagation()}>
                                <input
                                  value={item.name}
                                  onChange={(e) => {
                                    const newName = e.target.value;
                                    setBulkAddParsed(prev => prev.map((p, i) => i !== idx ? p : { ...p, name: newName }));
                                  }}
                                  onBlur={() => {
                                    if (item._rawName && item.name !== item._rawName) {
                                      try {
                                        const corrections = JSON.parse(safeLocalStorageGet('bulk_name_corrections', '{}'));
                                        corrections[item._rawName] = item.name;
                                        safeLocalStorageSet('bulk_name_corrections', JSON.stringify(corrections));
                                      } catch {}
                                    }
                                  }}
                                  className="text-[11px] font-black text-slate-800 bg-transparent outline-none border-b border-transparent focus:border-[#3182F6] min-w-0 flex-1"
                                />
                                {cleanCategorySuffix(item.name) !== item.name && (
                                  <button
                                    type="button"
                                    onClick={() => setBulkAddParsed(prev => prev.map((p, i) => i !== idx ? p : { ...p, name: cleanCategorySuffix(p.name) }))}
                                    className="shrink-0 px-1.5 py-0.5 rounded text-[8px] font-black text-orange-500 border border-orange-200 bg-orange-50 hover:bg-orange-100 transition-colors"
                                    title="카테고리 키워드 제거"
                                  >카테고리 제거</button>
                                )}
                                {searchAddressFromPlaceName && !item.address && (
                                  <button
                                    type="button"
                                    onClick={async () => {
                                      try {
                                        const result = await searchAddressFromPlaceName(item.name, tripRegion);
                                        if (result?.address) {
                                          setBulkAddParsed(prev => prev.map((p, i) => i !== idx ? p : { ...p, address: result.address }));
                                          showInfoToast(`${item.name} 주소 찾음`);
                                        } else { showInfoToast('주소를 찾지 못했습니다.'); }
                                      } catch { showInfoToast('주소 검색 실패'); }
                                    }}
                                    className="shrink-0 px-1.5 py-0.5 rounded text-[8px] font-black border text-[#3182F6] border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors"
                                    title="카카오 주소 검색"
                                  >주소 검색</button>
                                )}
                              </div>
                              {item.address && <p className="text-[10px] font-bold text-slate-400 mt-0.5 truncate">{item.address}</p>}
                              {item._expanded && (
                                <div className="mt-1.5 space-y-1.5 p-2 rounded-lg border border-slate-100 bg-white" onClick={(e) => e.stopPropagation()}>
                                  <div>
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">주소</label>
                                    <input
                                      value={item.address || ''}
                                      onChange={(e) => setBulkAddParsed(prev => prev.map((p, i) => i !== idx ? p : { ...p, address: e.target.value }))}
                                      className="w-full mt-0.5 px-2 py-1 text-[10px] font-bold text-slate-700 border border-slate-200 rounded-md outline-none focus:border-[#3182F6]"
                                      placeholder="주소 입력"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">메모</label>
                                    <textarea
                                      value={item.memo || ''}
                                      onChange={(e) => setBulkAddParsed(prev => prev.map((p, i) => i !== idx ? p : { ...p, memo: e.target.value }))}
                                      rows={2}
                                      className="w-full mt-0.5 px-2 py-1 text-[10px] font-bold text-slate-700 border border-slate-200 rounded-md outline-none focus:border-[#3182F6] resize-none"
                                      placeholder="메모 입력"
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-1.5">
                                    <div>
                                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">오픈</label>
                                      <input
                                        type="time"
                                        value={item.business?.open || ''}
                                        onChange={(e) => setBulkAddParsed(prev => prev.map((p, i) => i !== idx ? p : { ...p, business: { ...(p.business || {}), open: e.target.value } }))}
                                        className="w-full mt-0.5 px-2 py-1 text-[10px] font-bold text-slate-700 border border-slate-200 rounded-md outline-none focus:border-[#3182F6]"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">마감</label>
                                      <input
                                        type="time"
                                        value={item.business?.close || ''}
                                        onChange={(e) => setBulkAddParsed(prev => prev.map((p, i) => i !== idx ? p : { ...p, business: { ...(p.business || {}), close: e.target.value } }))}
                                        className="w-full mt-0.5 px-2 py-1 text-[10px] font-bold text-slate-700 border border-slate-200 rounded-md outline-none focus:border-[#3182F6]"
                                      />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-1.5">
                                    <div>
                                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">라스트오더</label>
                                      <input
                                        type="time"
                                        value={item.business?.lastOrder || ''}
                                        onChange={(e) => setBulkAddParsed(prev => prev.map((p, i) => i !== idx ? p : { ...p, business: { ...(p.business || {}), lastOrder: e.target.value } }))}
                                        className="w-full mt-0.5 px-2 py-1 text-[10px] font-bold text-slate-700 border border-slate-200 rounded-md outline-none focus:border-[#3182F6]"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">휴무일</label>
                                      <input
                                        value={(item.business?.closedDays || []).join(', ')}
                                        onChange={(e) => setBulkAddParsed(prev => prev.map((p, i) => i !== idx ? p : { ...p, business: { ...(p.business || {}), closedDays: e.target.value.split(',').map(s => s.trim()).filter(Boolean) } }))}
                                        className="w-full mt-0.5 px-2 py-1 text-[10px] font-bold text-slate-700 border border-slate-200 rounded-md outline-none focus:border-[#3182F6]"
                                        placeholder="월, 화 ..."
                                      />
                                    </div>
                                  </div>
                                </div>
                              )}
                              <div className="flex flex-wrap gap-1 mt-1.5 items-center" onClick={(e) => e.stopPropagation()}>
                                <button
                                  type="button"
                                  onClick={() => setBulkAddParsed(prev => prev.map((p, i) => i !== idx ? p : { ...p, _expanded: !p._expanded }))}
                                  className={`shrink-0 px-1.5 py-0.5 rounded text-[9px] font-black border transition-colors ${item._expanded ? 'border-[#3182F6] bg-blue-50 text-[#3182F6]' : 'border-slate-200 text-slate-400 hover:border-[#3182F6] hover:text-[#3182F6]'}`}
                                  title="상세 수정"
                                >{item._expanded ? <ChevronUp size={9} className="inline" /> : <ChevronDown size={9} className="inline" />} 수정</button>
                                {TAG_OPTIONS.filter(t => !['place', 'new', 'revisit', 'quick', 'lodge', 'ship', 'rest', 'openrun', 'view', 'home'].includes(t.value)).map(t => {
                                  const safeTypes = Array.isArray(item.types) ? item.types : [];
                                  const active = safeTypes.includes(t.value);
                                  return (
                                    <button
                                      key={t.value}
                                      type="button"
                                      onClick={() => setBulkAddParsed(prev => prev.map((p, i) => {
                                        if (i !== idx) return p;
                                        const cur = Array.isArray(p.types) ? p.types : [];
                                        const next = active ? cur.filter(v => v !== t.value) : [...cur.filter(v => v !== 'place'), t.value];
                                        return { ...p, types: next.length ? next : ['place'] };
                                      }))}
                                      className={`px-1.5 py-0.5 rounded text-[9px] font-black border transition-colors ${active ? 'border-[#3182F6] bg-[#3182F6] text-white' : 'border-transparent text-slate-300 hover:text-slate-500'}`}
                                    >
                                      {t.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          const selected = bulkAddParsed.filter(p => p.selected);
                          if (selected.length === 0) { showInfoToast('선택된 장소가 없습니다.'); return; }
                          setBulkAddLoading(true);
                          const existingNames = new Set((itinerary.places || []).map(p => String(p.name || '').trim().toLowerCase()));
                          let addedCount = 0;
                          let dupCount = 0;
                          for (const item of selected) {
                            const normalizedName = String(item.name || '').trim().toLowerCase();
                            if (existingNames.has(normalizedName)) {
                              // 중복 → 휴지통으로
                              const trashPlace = normalizeLibraryPlace({
                                id: `place_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
                                name: item.name, types: normalizeTagOrder(item.types),
                                address: (item.address || '').trim(),
                                receipt: { address: (item.address || '').trim(), items: [] },
                              });
                              setItinerary(prev => ({ ...prev, placeTrash: [...(prev.placeTrash || []), trashPlace] }));
                              dupCount++;
                            } else {
                              addPlace({ name: item.name, types: item.types, address: item.address, memo: item.memo || '', menus: item.menus || [], business: item.business || {} }, { unselectedMenus: true });
                              existingNames.add(normalizedName);
                              addedCount++;
                            }
                          }
                          setBulkAddLoading(false);
                          const msg = dupCount > 0
                            ? `${addedCount}개 추가, ${dupCount}개 중복 → 휴지통`
                            : `${addedCount}개 장소를 추가했습니다!`;
                          showInfoToast(msg, { durationMs: 2400 });
                          setShowBulkAddModal(false);
                          setBulkAddText('');
                          setBulkAddParsed([]);
                        }}
                        disabled={bulkAddLoading || bulkAddParsed.filter(p => p.selected).length === 0}
                        className="w-full py-2.5 rounded-xl bg-[#3182F6] text-white text-[12px] font-black hover:bg-blue-600 transition-colors disabled:opacity-50"
                      >
                        {bulkAddLoading ? '추가 중...' : `선택한 ${bulkAddParsed.filter(p => p.selected).length}개 장소 추가`}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </>

  );
};

export default BulkAddModal;
