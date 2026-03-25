import React from 'react';
import { db } from '../../firebase.js';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { X } from 'lucide-react';

export const GUIDE_DOC_PATH = 'meta/smartFillGuide';
export const isLegacySmartFillGuideContent = (content = '') => {
  const text = String(content || '');
  if (!text.trim()) return false;
  return (
    text.includes('프롬프트 적용 이력')
    || text.includes('기술 오류 및 대응 지침')
    || text.includes('Claude Sonnet 4.6')
  );
};
export const SmartFillGuideModal = ({ onClose }) => {
  const [guideContent, setGuideContent] = React.useState('');
  const [editContent, setEditContent] = React.useState('');
  const [guideLoading, setGuideLoading] = React.useState(true);
  const [isEditing, setIsEditing] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveMsg, setSaveMsg] = React.useState('');
  const [activeTab, setActiveTab] = React.useState('guide'); // 'guide' | 'history'
  const [historyCases, setHistoryCases] = React.useState([]);
  const [historyLoading, setHistoryLoading] = React.useState(false);

  React.useEffect(() => {
    const load = async () => {
      const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
      let fallbackContent = '';
      try {
        const response = await fetch(`${base}/SMART_FILL_FEEDBACK.md`);
        if (response.ok) {
          fallbackContent = await response.text();
        }
      } catch { /* ignore */ }
      try {
        const snap = await getDoc(doc(db, GUIDE_DOC_PATH));
        const stored = String(snap.data()?.content || '').trim();
        if (stored && !isLegacySmartFillGuideContent(stored)) {
          setGuideContent(stored);
          setGuideLoading(false);
          return;
        }
      } catch { /* ignore */ }
      setGuideContent(fallbackContent || '학습 지침 파일을 불러오지 못했습니다.');
      setGuideLoading(false);
    };
    load();
  }, []);

  React.useEffect(() => {
    if (activeTab === 'history' && historyCases.length === 0) {
      const fetchHistory = async () => {
        setHistoryLoading(true);
        try {
          const q = await getDocs(collection(db, 'meta', 'aiLearning', 'cases'));
          const cases = q.docs.map(d => ({ id: d.id, ...d.data() }))
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          setHistoryCases(cases);
        } catch (e) { console.error(e); }
        setHistoryLoading(false);
      };
      fetchHistory();
    }
  }, [activeTab]);

  const handleEdit = () => { setEditContent(guideContent); setIsEditing(true); setSaveMsg(''); };
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await setDoc(doc(db, GUIDE_DOC_PATH), { content: editContent, updatedAt: new Date().toISOString() }, { merge: true });
      setGuideContent(editContent);
      setIsEditing(false);
      setSaveMsg('저장 완료 ✓');
      setTimeout(() => setSaveMsg(''), 2500);
    } catch (e) { setSaveMsg(`저장 실패: ${e?.message}`); } finally { setIsSaving(false); }
  };

  const renderMd = (md) => md.split('\n').map((line, i) => {
    if (/^###\s/.test(line)) return <p key={i} className="text-[12px] font-black text-slate-700 mt-4 mb-1">{line.replace(/^###\s/, '')}</p>;
    if (/^##\s/.test(line)) return <p key={i} className="text-[13px] font-black text-[#3182F6] mt-5 mb-1 pb-1 border-b border-blue-100">{line.replace(/^##\s/, '')}</p>;
    if (/^#\s/.test(line)) return <p key={i} className="text-[14px] font-black text-slate-800 mt-2 mb-3">{line.replace(/^#\s/, '')}</p>;
    if (/^---/.test(line)) return <div key={i} className="h-px bg-slate-100 my-3" />;
    if (/^-\s/.test(line)) return <p key={i} className="text-[11px] text-slate-600 font-semibold pl-3 leading-relaxed">· {line.replace(/^-\s/, '')}</p>;
    if (line.trim() === '') return <div key={i} className="h-1" />;
    return <p key={i} className="text-[11px] text-slate-600 leading-relaxed">{line}</p>;
  });

  return (
    <>
      <div className="fixed inset-0 z-[291] bg-black/20" onClick={isEditing ? undefined : onClose} />
      <div className="fixed inset-x-4 top-[5vh] bottom-[5vh] z-[292] max-w-lg mx-auto bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* 헤더 */}
        <div className="px-5 pt-4 pb-1 border-b border-slate-100 bg-slate-50/70 shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[13px] font-black text-slate-700">AI 입력 학습 관리</p>
              <p className="text-[10px] font-bold text-slate-400 mt-0.5">{isEditing ? '✎ 지침 편집 중' : '교차 검증 및 지침 갱신'}</p>
            </div>
            <div className="flex items-center gap-1.5">
              {!isEditing && activeTab === 'guide' && !guideLoading && (
                <button onClick={handleEdit} className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-[10px] font-black text-slate-500 hover:text-[#3182F6] transition-colors flex items-center gap-1">
                  <Pencil size={9} /> 편집
                </button>
              )}
              {saveMsg && <span className="text-[10px] font-bold text-emerald-500">{saveMsg}</span>}
              <button onClick={isEditing ? () => setIsEditing(false) : onClose} className="p-1.5 rounded-xl text-slate-300 hover:text-slate-500 hover:bg-slate-100 transition-colors">
                <X size={14} />
              </button>
            </div>
          </div>
          {/* 탭 버튼 */}
          {!isEditing && (
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('guide')}
                className={`pb-2 text-[11px] font-black transition-all border-b-2 ${activeTab === 'guide' ? 'border-[#3182F6] text-[#3182F6]' : 'border-transparent text-slate-400'}`}
              >
                학습 지침(Instruction)
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`pb-2 text-[11px] font-black transition-all border-b-2 ${activeTab === 'history' ? 'border-[#3182F6] text-[#3182F6]' : 'border-transparent text-slate-400'}`}
              >
                교정 사례(Cross-Check)
                {historyCases.length > 0 && <span className="ml-1 px-1 bg-[#3182F6] text-white rounded text-[8px]">{historyCases.length}</span>}
              </button>
            </div>
          )}
        </div>

        {/* 본문 */}
        <div className="flex-1 overflow-hidden flex flex-col bg-slate-50/30">
          {activeTab === 'guide' ? (
            guideLoading ? (
              <div className="flex items-center justify-center flex-1 text-[12px] text-slate-400 font-bold">지침 불러오는 중...</div>
            ) : isEditing ? (
              <textarea
                value={editContent} onChange={(e) => setEditContent(e.target.value)}
                className="flex-1 w-full px-5 py-4 text-[11px] font-mono text-slate-700 leading-relaxed resize-none outline-none border-none bg-slate-50/50"
                placeholder="AI 지침을 수정하세요..." spellCheck={false}
              />
            ) : (
              <div className="flex-1 overflow-y-auto px-5 py-4">
                <div className="space-y-0.5">{renderMd(guideContent)}</div>
              </div>
            )
          ) : (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {historyLoading ? (
                <div className="flex items-center justify-center py-10 text-[12px] text-slate-400 font-bold animate-pulse">사례 데이터를 불러오는 중...</div>
              ) : historyCases.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-300 gap-2">
                  <Sparkles size={24} className="opacity-20" />
                  <p className="text-[11px] font-bold">아직 기록된 교정 사례가 없습니다.</p>
                </div>
              ) : (
                historyCases.map((c, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden text-[10px]">
                    <div className="bg-slate-50 px-3 py-2 border-b border-slate-100 flex justify-between items-center font-bold text-slate-400">
                      <span>Case #{historyCases.length - i} · {new Date(c.timestamp).toLocaleString()}</span>
                      <span className="px-1.5 py-0.5 bg-blue-50 text-blue-500 rounded text-[8px] uppercase">{c.inputType}</span>
                    </div>
                    <div className="p-3 space-y-3">
                      <div>
                        <p className="text-[#3182F6] font-black mb-1">❶ 원본 데이터(Raw Source)</p>
                        <div className="bg-slate-50 rounded-lg p-2 text-slate-500 italic max-h-24 overflow-y-auto no-scrollbar font-mono break-all whitespace-pre-wrap">
                          {c.rawSource?.text || '(이미지 데이터)'}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-slate-400 font-black mb-1">❷ AI 결과</p>
                          <div className="bg-red-50/30 rounded-lg p-2 text-slate-400 border border-red-50/50 font-mono overflow-x-auto no-scrollbar">
                            <pre className="text-[9px]">{JSON.stringify(c.aiResult, null, 1)}</pre>
                          </div>
                        </div>
                        <div>
                          <p className="text-emerald-500 font-black mb-1">❸ 사용자 교정(Fixed)</p>
                          <div className="bg-emerald-50/30 rounded-lg p-2 text-emerald-600 border border-emerald-50/50 font-mono overflow-x-auto no-scrollbar">
                            <pre className="text-[9px]">{JSON.stringify(c.userFixed, null, 1)}</pre>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* 하단 제어 */}
        {isEditing && (
          <div className="shrink-0 px-5 py-3 border-t border-slate-100 bg-white flex items-center justify-end gap-2">
            <button onClick={() => setIsEditing(false)} className="px-3 py-2 rounded-xl border border-slate-200 text-[11px] font-black text-slate-500 hover:bg-slate-50 transition-colors">취소</button>
            <button onClick={handleSave} disabled={isSaving} className="px-4 py-2 rounded-xl bg-[#3182F6] text-white text-[11px] font-black disabled:opacity-60 hover:bg-blue-600 transition-colors flex items-center gap-1.5">
              {isSaving && <LoaderCircle size={10} className="animate-spin" />} {isSaving ? '저장 중...' : '지침 업데이트'}
            </button>
          </div>
        )}
      </div>
    </>
  );
};
