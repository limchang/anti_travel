import React from 'react';
import { CheckSquare, Minus, Plus, Square, Sparkles, Trash2 } from 'lucide-react';
import { SharedNameRow, SharedAddressRow, SharedBusinessRow, SharedMemoRow, SharedTotalFooter, MenuPriceInput } from '../shared/SharedComponents.jsx';

/**
 * PlanItemCard — 일정/장소 정보를 표시하는 공통 카드 본체
 *
 * 3곳에서 호출:
 *   1. 내일정 타임라인 (mode="timeline", readOnly=false)
 *   2. 지도 퀵뷰 모달 (mode="quickview", readOnly 혼합)
 *   3. 내장소 라이브러리 (mode="library", readOnly=true)
 *
 * 시간 바, 컨테이너 래퍼, 카테고리 악센트 바는 호출 측에서 직접 렌더.
 * 이 컴포넌트는 "이름/주소/영업/메모/영수증" 본체만 담당.
 */
const PlanItemCard = ({
  // 데이터
  item = {},

  // 모드
  readOnly = false,
  showReceipt = true,
  isExpanded = false,
  compact = false,
  hideNameRow = false,

  // 콜백 — 이름
  onActivityChange,
  onActivityKeyDown,
  onContainerClick,
  namePrefix,
  nameActions,

  // 콜백 — 주소
  onAddressChange,
  addressLeading,
  addressActions,

  // 콜백 — 영업정보
  businessSummary = '미설정',
  businessWarning,
  quickEditSegments,
  onBusinessQuickEdit,
  onBusinessToggle,
  businessExpanded,
  businessActions,
  businessStatus = '', // 'warn' | 'open' | ''

  // 콜백 — 메모
  onMemoChange,

  // 콜백 — 영수증
  onMenuUpdate,
  onMenuDelete,
  onMenuAdd,
  onSmartPasteMenus,
  onReceiptToggle,
  getMenuQty,
  getMenuLineTotal,

  // 추가 콘텐츠
  statusChip,
  extraContent,
}) => {
  const name = item.activity || item.name || '';
  const address = item.receipt?.address || item.address || '';
  const memo = String(item.memo || '').trim();
  const menus = item.receipt?.items || [];
  const total = item.price || menus.reduce((s, m) => s + (m?.selected !== false ? (Number(m?.price) || 0) * Math.max(1, Number(m?.qty) || 1) : 0), 0);
  const defaultGetQty = (m) => Math.max(1, Number(m?.qty) || 1);
  const defaultGetLineTotal = (m) => (Number(m?.price) || 0) * Math.max(1, Number(m?.qty) || 1);
  const qtyFn = getMenuQty || defaultGetQty;
  const lineTotalFn = getMenuLineTotal || defaultGetLineTotal;

  return (
    <>
      {/* 본체 */}
      <div className={`flex flex-col gap-2.5 ${hideNameRow ? 'px-4 pb-4 pt-2' : 'p-4'}`} onClick={onContainerClick}>
        {/* 이름 행 */}
        {!hideNameRow && (
          <SharedNameRow
            value={name}
            readOnly={readOnly}
            onChange={onActivityChange ? (e) => onActivityChange(e.target.value) : undefined}
            onFocus={!readOnly ? (e) => e.target.select() : undefined}
            onKeyDown={onActivityKeyDown}
            placeholder={readOnly ? '이름 없음' : '일정 이름 입력 후 Enter'}
            onContainerClick={onContainerClick}
            prefixContent={namePrefix}
            actionButton={nameActions}
          />
        )}

        {/* 상태 칩 */}
        {statusChip}

        {/* 주소 행 */}
        {!compact && (
          <SharedAddressRow
            value={address}
            onChange={onAddressChange ? (e) => onAddressChange(e.target.value) : undefined}
            onContainerClick={onContainerClick}
            leading={addressLeading}
            actions={addressActions}
            placeholder="주소 정보 없음"
          />
        )}

        {/* 영업 정보 (경고/영업중 상태 색상 포함) */}
        <SharedBusinessRow
          summary={businessWarning ? `⚠ ${businessWarning}` : businessSummary}
          status={businessWarning ? 'warn' : businessStatus || ''}
          onContainerClick={onContainerClick}
          quickEditSegments={businessWarning ? null : quickEditSegments}
          onQuickEdit={onBusinessQuickEdit}
          onToggle={onBusinessToggle}
          actionButton={businessActions}
          expanded={businessExpanded}
        />

        {/* 메모 */}
        {(memo || !readOnly) && (
          <SharedMemoRow
            value={item.memo || ''}
            readOnly={readOnly}
            onChange={onMemoChange ? (e) => onMemoChange(e.target.value) : undefined}
            onContainerClick={onContainerClick}
          />
        )}

        {extraContent}
      </div>

      {/* 영수증 */}
      {showReceipt && (
        <div className="overflow-hidden border-t border-slate-100" onClick={(e) => e.stopPropagation()}>
          {isExpanded && (
            <div className="px-5 py-4 bg-white border-b border-slate-100 border-dashed">
              {readOnly ? (
                /* 읽기 전용 — 메뉴 표시만 */
                <div className="space-y-1.5">
                  {menus.filter(m => m?.selected !== false).map((m, mIdx) => (
                    <div key={mIdx} className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-600 font-bold truncate flex-1">{m?.name || '-'}</span>
                      <span className="text-slate-400 font-bold mx-2">x{qtyFn(m)}</span>
                      <span className="text-[#3182F6] font-black tabular-nums">₩{lineTotalFn(m).toLocaleString()}</span>
                    </div>
                  ))}
                  {menus.filter(m => m?.selected !== false).length === 0 && (
                    <p className="text-[10px] text-slate-400 text-center py-1">메뉴 없음</p>
                  )}
                </div>
              ) : (
                /* 편집 가능 — 메뉴 추가/삭제/수정 */
                <>
                  <div className="space-y-3 mb-3">
                    {menus.map((m, mIdx) => (
                      <div key={mIdx} className="flex justify-between items-center text-xs group/item">
                        <div className="flex items-center gap-2 flex-1">
                          <div className="cursor-pointer text-slate-300 hover:text-[#3182F6]" onClick={(e) => { e.stopPropagation(); onMenuUpdate?.(mIdx, 'toggle'); }}>
                            {m.selected ? <CheckSquare size={14} className="text-[#3182F6]" /> : <Square size={14} />}
                          </div>
                          <input value={m.name} onChange={(e) => onMenuUpdate?.(mIdx, 'name', e.target.value)} onClick={(e) => e.stopPropagation()} className="bg-transparent border-none outline-none text-slate-700 font-bold w-full" />
                        </div>
                        <div className="flex items-center gap-2">
                          <MenuPriceInput value={m.price} onCommit={(nextPrice) => onMenuUpdate?.(mIdx, 'price', nextPrice)} onClick={(e) => e.stopPropagation()} className="w-16 text-right font-bold text-slate-500 bg-transparent border-none outline-none placeholder:text-slate-300" />
                          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded p-0.5 shadow-sm">
                            <button onClick={(e) => { e.stopPropagation(); onMenuUpdate?.(mIdx, 'qty', -1); }}><Minus size={10} /></button>
                            <span className="w-4 text-center text-[10px]">{qtyFn(m)}</span>
                            <button onClick={(e) => { e.stopPropagation(); onMenuUpdate?.(mIdx, 'qty', 1); }}><Plus size={10} /></button>
                          </div>
                          <span className="w-20 text-right font-black text-[#3182F6]">₩{lineTotalFn(m).toLocaleString()}</span>
                          <button onClick={(e) => { e.stopPropagation(); onMenuDelete?.(mIdx); }} className="text-slate-300 hover:text-red-500"><Trash2 size={12} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {onSmartPasteMenus && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onSmartPasteMenus(); }}
                        className="py-2 border border-dashed border-slate-300 rounded-xl text-[10px] font-bold text-slate-400 hover:text-amber-600 hover:border-amber-300 hover:bg-amber-50/50 transition-colors flex items-center justify-center gap-1"
                      >
                        <Sparkles size={10} /> 자동채우기
                      </button>
                    )}
                    {onMenuAdd && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onMenuAdd(); }}
                        className="py-2 border border-dashed border-slate-300 rounded-xl text-[10px] font-bold text-slate-400 hover:text-[#3182F6] hover:border-[#3182F6]/30 hover:bg-blue-50/50 transition-colors"
                      >
                        + 메뉴 추가
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
          <SharedTotalFooter expanded={isExpanded} total={total} onToggle={onReceiptToggle} />
        </div>
      )}
    </>
  );
};

export default PlanItemCard;
