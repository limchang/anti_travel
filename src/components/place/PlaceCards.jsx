import React from 'react';
import {
  CheckSquare,
  ChevronDown,
  Map as MapIcon,
  MapPin,
  Minus,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Square,
  Trash2,
  Wand2,
  X,
} from 'lucide-react';
import { TAG_OPTIONS, normalizeTagOrder, toggleTagSelection, getTagButtonClass } from '../../utils/constants.js';

const ACTION_SLOT_CLASS = 'shrink-0 flex items-center justify-end gap-1 min-w-[3.25rem]';

const OrderedTagPicker = ({ value = ['place'], onChange, title = '태그', className = '' }) => {
  const selected = normalizeTagOrder(value);
  const [customInput, setCustomInput] = React.useState('');
  const [isAddingCustom, setIsAddingCustom] = React.useState(false);
  const inputRef = React.useRef(null);

  const handleAddCustom = () => {
    const nextValue = customInput.trim();
    if (nextValue && !selected.includes(nextValue)) {
      onChange(normalizeTagOrder([...selected, nextValue]));
    }
    setCustomInput('');
    setIsAddingCustom(false);
  };

  const predefinedValues = new Set(TAG_OPTIONS.map((tag) => tag.value));
  const activeTags = selected.filter((tag) => tag !== 'place');
  const customTags = activeTags.filter((tag) => !predefinedValues.has(tag));

  React.useEffect(() => {
    if (isAddingCustom && inputRef.current) inputRef.current.focus();
  }, [isAddingCustom]);

  return (
    <div className={className}>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1.5">{title}</p>
      <div className="flex flex-wrap gap-1.5 items-center">
        {TAG_OPTIONS.map((tag) => {
          const active = selected.includes(tag.value);
          return (
            <button
              key={tag.value}
              type="button"
              onClick={() => onChange(toggleTagSelection(selected, tag.value))}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-black border transition-colors ${getTagButtonClass(tag.value, active)}`}
            >
              {tag.label}
            </button>
          );
        })}
        {customTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => onChange(normalizeTagOrder(selected.filter((value) => value !== tag)))}
            className="px-2 py-0.5 rounded-lg text-[10px] font-black border transition-colors text-slate-600 bg-slate-100 border-slate-300 hover:bg-slate-200"
          >
            {tag}
          </button>
        ))}
        {!isAddingCustom ? (
          <button
            type="button"
            onClick={() => setIsAddingCustom(true)}
            className="w-6 h-6 flex items-center justify-center rounded-lg border border-dashed border-slate-300 text-slate-400 hover:text-[#3182F6] hover:border-[#3182F6] hover:bg-blue-50 transition-all"
            title="커스텀 태그 추가"
          >
            <Plus size={12} />
          </button>
        ) : (
          <div className="flex items-center gap-1 animate-in zoom-in-95 duration-200">
            <input
              ref={inputRef}
              type="text"
              value={customInput}
              onChange={(event) => setCustomInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  handleAddCustom();
                }
                if (event.key === 'Escape') {
                  setIsAddingCustom(false);
                  setCustomInput('');
                }
              }}
              onBlur={() => {
                if (!customInput.trim()) setIsAddingCustom(false);
              }}
              placeholder="태그 입력"
              className="w-20 px-2 py-0.5 rounded-lg text-[10px] font-black border border-[#3182F6] bg-white outline-none"
            />
            <button type="button" onClick={handleAddCustom} className="text-[10px] font-bold text-[#3182F6] px-1">
              확인
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const SharedNameRow = ({
  value,
  onChange,
  onFocus,
  onKeyDown,
  onPaste,
  autoFocus = false,
  placeholder,
  actionButton = null,
  readOnly = false,
  onContainerClick,
  prefixContent = null,
}) => (
  <div className="w-full flex items-center gap-2 text-slate-500 px-1 py-0.5 transition-all" onClick={onContainerClick}>
    {prefixContent}
    <input
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      onPaste={onPaste}
      autoFocus={autoFocus}
      readOnly={readOnly}
      className="flex-1 bg-transparent text-[15px] font-black text-slate-800 truncate leading-tight focus:outline-none min-w-0"
      placeholder={placeholder}
    />
    {actionButton ? <div className={ACTION_SLOT_CLASS}>{actionButton}</div> : null}
  </div>
);

const SharedAddressRow = ({
  value,
  onChange,
  placeholder = '주소 정보 없음',
  leading = null,
  actions = null,
  onContainerClick,
}) => (
  <div className="flex items-center gap-2 text-slate-500 w-full px-1 py-0.5" onClick={onContainerClick}>
    {leading}
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="flex-1 min-w-0 bg-transparent border-none outline-none text-[11px] font-bold text-slate-500 placeholder:text-slate-300"
    />
    {actions ? <div className={ACTION_SLOT_CLASS}>{actions}</div> : null}
  </div>
);

const SharedBusinessRow = ({
  summary,
  placeholder = '영업 정보 (선택)',
  onToggle,
  actionButton = null,
  expanded = null,
  onContainerClick,
  quickEditSegments = null,
  onQuickEdit = null,
}) => (
  <div className="w-full py-0.5 px-1" onClick={onContainerClick}>
    <div className="w-full flex items-center gap-2">
      <div role="button" tabIndex={0}
        onClick={(event) => {
          event.stopPropagation();
          onToggle?.(event);
        }}
        className="flex-1 flex items-center gap-2 text-left min-w-0"
      >
        {summary === '미설정' || !summary ? (
          <span className="text-[10px] font-bold text-slate-400">{placeholder}</span>
        ) : quickEditSegments?.length && onQuickEdit ? (
          <span className="text-[10px] font-bold text-slate-600 truncate flex-1 flex items-center gap-1 flex-wrap">
            {quickEditSegments.map((segment, index) => (
              <React.Fragment key={`${segment.fieldKey}-${index}`}>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onQuickEdit(segment.fieldKey);
                  }}
                  className="hover:text-[#3182F6] transition-colors"
                >
                  {segment.label}
                </button>
                {index < quickEditSegments.length - 1 && <span className="text-slate-300">·</span>}
              </React.Fragment>
            ))}
          </span>
        ) : (
          <span className="text-[10px] font-bold text-slate-600 truncate flex-1">{summary}</span>
        )}
      </div>
      {actionButton ? <div className={ACTION_SLOT_CLASS}>{actionButton}</div> : null}
    </div>
    {expanded}
  </div>
);

const SharedMemoRow = ({ value, onChange, placeholder = '메모를 입력하세요...', onContainerClick, readOnly = false }) => (
  <div onClick={onContainerClick}>
    <input
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      className="w-full bg-slate-50 rounded-lg px-3 py-2 text-[11px] font-medium text-slate-500 outline-none placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all"
      placeholder={placeholder}
    />
  </div>
);

const MenuPriceInput = ({ value = 0, onCommit, className = '', onClick = null }) => {
  const normalizedValue = Number(value) || 0;
  const [isEditing, setIsEditing] = React.useState(false);
  const [draftValue, setDraftValue] = React.useState('');

  React.useEffect(() => {
    if (!isEditing) setDraftValue(String(normalizedValue || ''));
  }, [normalizedValue, isEditing]);

  return (
    <input
      type="text"
      inputMode="numeric"
      value={isEditing ? draftValue : String(normalizedValue || '')}
      placeholder={isEditing ? String(normalizedValue || 0) : ''}
      onFocus={(event) => {
        setIsEditing(true);
        setDraftValue('');
        requestAnimationFrame(() => event.target.select());
      }}
      onChange={(event) => setDraftValue(event.target.value.replace(/[^\d]/g, ''))}
      onBlur={() => {
        if (draftValue.trim() !== '') onCommit(Number(draftValue) || 0);
        setIsEditing(false);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter') event.currentTarget.blur();
        if (event.key === 'Escape') {
          setDraftValue(String(normalizedValue || ''));
          setIsEditing(false);
          event.currentTarget.blur();
        }
      }}
      onClick={onClick}
      className={className}
    />
  );
};

const SharedTotalFooter = ({ expanded, onToggle, total }) => (
  <div
    onClick={onToggle}
    className="mt-auto px-5 py-3 flex items-center justify-between cursor-pointer transition-all bg-slate-50/50 hover:bg-slate-50"
  >
    <span className="text-[10px] text-slate-400 font-black tracking-[0.15em] uppercase flex items-center gap-1.5">
      Total <ChevronDown size={10} className={`transition-transform duration-300 ${expanded ? 'rotate-180 text-[#3182F6]' : ''}`} />
    </span>
    <span className={`text-[16px] font-black tabular-nums text-[#3182F6]`}>
      ₩{Number(total || 0).toLocaleString()}
    </span>
  </div>
);

export const PlaceEditorCard = ({
  className = '',
  style: styleProp = undefined,
  maxModalHeight = null,
  title,
  draft,
  onDraftChange,
  onSubmit,
  onCancel,
  submitLabel,
  cancelLabel = '취소',
  regionHint = '',
  autoFocusName = false,
  forceReceiptExpanded = false,
  addressSearchNote = '',
  setAddressSearchNote = null,
  onSmartPasteAll,
  onSmartPasteBusiness,
  onSmartPasteMenus,
  onSmartPasteAddress,
  onSuperSmartPaste,
  onJinaSmartFill,
  onNameInput = null,
  onNamePaste = null,
  createDraft,
  normalizeBusiness,
  formatClosedDaysSummary,
  buildBusinessQuickEditSegments,
  searchAddressFromPlaceName,
  BusinessHoursEditor,
}) => {
  const [isSearchingAddress, setIsSearchingAddress] = React.useState(false);
  const [receiptExpanded, setReceiptExpanded] = React.useState(forceReceiptExpanded);
  const [pendingMenuFocusIdx, setPendingMenuFocusIdx] = React.useState(null);
  const [smartPasteLoading, setSmartPasteLoading] = React.useState(false);

  const wrapSmartPaste = (fn) => async () => {
    if (!fn || smartPasteLoading) return;
    setSmartPasteLoading(true);
    try {
      await fn();
    } finally {
      setSmartPasteLoading(false);
    }
  };

  React.useEffect(() => {
    if (forceReceiptExpanded) setReceiptExpanded(true);
  }, [forceReceiptExpanded]);

  const safeDraft = createDraft(draft);
  React.useEffect(() => {
    if (pendingMenuFocusIdx === null) return;
    const target = document.querySelector(`[data-draft-menu-name="${pendingMenuFocusIdx}"]`);
    if (target instanceof HTMLInputElement) {
      target.focus();
      target.select();
    }
    setPendingMenuFocusIdx(null);
  }, [pendingMenuFocusIdx, safeDraft.receipt.items.length]);

  const getQty = (item) => Math.max(1, Number(item?.qty) || 1);
  const getLineTotal = (item) => (Number(item?.price) || 0) * getQty(item);
  const total = safeDraft.receipt.items.reduce((sum, item) => sum + (item.selected === false ? 0 : getLineTotal(item)), 0);
  const businessSummary = (() => {
    const business = normalizeBusiness(safeDraft.business || {});
    const parts = [];
    if (business.open || business.close) parts.push(`운영 ${business.open || '--:--'} - ${business.close || '--:--'}`);
    if (business.breakStart || business.breakEnd) parts.push(`휴식 ${business.breakStart || '--:--'} - ${business.breakEnd || '--:--'}`);
    if (business.lastOrder || business.entryClose) parts.push(`마감 ${business.lastOrder || business.entryClose || '--:--'}`);
    if (Array.isArray(business.closedDays) && business.closedDays.length) parts.push(`휴무 : ${formatClosedDaysSummary(business.closedDays)}`);
    return parts.length ? parts.join(' · ') : '미설정';
  })();
  const businessQuickEditSegments = buildBusinessQuickEditSegments(safeDraft.business || {});

  const updateDraft = (updater) => {
    const next = typeof updater === 'function' ? updater(safeDraft) : updater;
    onDraftChange(createDraft(next));
  };

  const tryAutoFillAddress = async (force = false) => {
    if (isSearchingAddress) return;
    if (!safeDraft.name.trim()) return;
    if (safeDraft.address.trim() && !force) return;

    setIsSearchingAddress(true);
    setAddressSearchNote?.('주소 검색 중...');
    try {
      const foundAddress = await searchAddressFromPlaceName(safeDraft.name, regionHint);
      if (!foundAddress?.address) {
        setAddressSearchNote?.('검색 결과가 없습니다.');
        return;
      }
      const nextDraft = createDraft({
        ...safeDraft,
        address: foundAddress.address,
        business: normalizeBusiness({}),
        receipt: { ...safeDraft.receipt, items: [] },
      });
      onDraftChange(nextDraft);
      setAddressSearchNote?.('주소가 자동 입력되었으며, 기존 정보는 초기화되었습니다.');

      // 기존 항목(ID가 있는 경우)이면 자동 저장 시도
      if (nextDraft.id) {
        setAddressSearchNote?.('주소 정보 동기화로 인해 자동 저장되었습니다.');
        onSubmit(nextDraft);
      }
    } catch {
      setAddressSearchNote?.('자동 입력에 실패했습니다.');
    } finally {
      setIsSearchingAddress(false);
    }
  };

  return (
    <div
      className={`w-full rounded-[24px] border border-slate-200 bg-white shadow-[0_12px_30px_-18px_rgba(15,23,42,0.25)] overflow-hidden flex flex-col ${className}`.trim()}
      style={{ ...(maxModalHeight ? { maxHeight: maxModalHeight } : {}), ...styleProp }}
    >
      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between shrink-0">
        <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.18em]">{title}</p>
        <button type="button" onClick={onCancel} className="p-1 rounded-md text-slate-300 hover:text-slate-500 hover:bg-white transition-colors">
          <X size={14} />
        </button>
      </div>
      {smartPasteLoading && (
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border-b border-blue-100">
          <svg className="animate-spin shrink-0" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#3182F6' }}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
          <span className="text-[11px] font-bold text-blue-500 animate-pulse">✦ AI 분석 중입니다… 잠시만 기다려 주세요</span>
        </div>
      )}

      <div className="p-4 flex flex-col gap-3 shrink-0">
        {(onSuperSmartPaste || onJinaSmartFill) && (
          <div className="flex gap-2">
            {onSuperSmartPaste && (
              <button
                type="button"
                onClick={wrapSmartPaste(onSuperSmartPaste)}
                disabled={smartPasteLoading}
                className="flex-1 py-2.5 bg-gradient-to-r from-[#3182F6] to-indigo-500 rounded-xl text-white text-[12px] font-black flex items-center justify-center gap-2 shadow-[0_8px_16px_-6px_rgba(49,130,246,0.25)] hover:shadow-[0_12px_20px_-8px_rgba(49,130,246,0.35)] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {smartPasteLoading ? (
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                ) : (
                  <Sparkles size={14} className="animate-pulse" />
                )}
                <span>✦ AI 자동채우기</span>
              </button>
            )}
            {onJinaSmartFill && (
              <button
                type="button"
                onClick={wrapSmartPaste(onJinaSmartFill)}
                disabled={smartPasteLoading}
                className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-white text-[12px] font-black flex items-center justify-center gap-2 shadow-[0_8px_16px_-6px_rgba(16,185,129,0.25)] hover:shadow-[0_12px_20px_-8px_rgba(16,185,129,0.35)] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {smartPasteLoading ? (
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                ) : (
                  <Search size={14} />
                )}
                <span>v2 지도검색</span>
              </button>
            )}
          </div>
        )}

        <OrderedTagPicker title="태그" value={safeDraft.types} onChange={(tags) => updateDraft((current) => ({ ...current, types: tags }))} />

        <SharedNameRow
          value={safeDraft.name}
          onChange={(event) => {
            const nextValue = event.target.value;
            if (onNameInput) onNameInput(nextValue);
            else updateDraft((current) => ({ ...current, name: nextValue }));
          }}
          onPaste={onNamePaste}
          autoFocus={autoFocusName}
          placeholder="장소 이름 입력"
          onFocus={(event) => autoFocusName && event.target.select()}
          onKeyDown={(event) => {
            if (event.key === 'Escape') onCancel();
            if (event.key === 'Enter') {
              event.preventDefault();
              void tryAutoFillAddress(true);
            }
          }}
          actionButton={onSmartPasteAll ? (
            <button
              type="button"
              onClick={wrapSmartPaste(onSmartPasteAll)}
              disabled={smartPasteLoading}
              className="shrink-0 p-1 rounded-md border border-slate-200 bg-white text-slate-400 hover:border-[#3182F6] hover:text-[#3182F6] transition-colors disabled:opacity-50"
              title="스마트 전체 붙여넣기"
            >
              {smartPasteLoading
                ? <svg className="animate-spin" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                : <Sparkles size={9} />}
            </button>
          ) : null}
        />

        <SharedAddressRow
          value={safeDraft.address}
          onChange={(event) => updateDraft((current) => ({ ...current, address: event.target.value }))}
          placeholder="주소를 입력하세요"
          leading={<MapPin size={12} className="text-[#3182F6] shrink-0" />}
          actions={(
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  const query = `${String(safeDraft.name || '').trim()} ${String(safeDraft.address || '').trim()}`.trim();
                  if (!query) return;
                  window.open(`https://map.naver.com/v5/search/${encodeURIComponent(query)}`, '_blank', 'noopener,noreferrer');
                }}
                title="네이버 지도에서 장소 검색"
                className="shrink-0 p-1 rounded-md border border-slate-200 bg-white text-slate-400 hover:border-[#3182F6] hover:text-[#3182F6] transition-colors"
              >
                <MapIcon size={9} />
              </button>
              {onSmartPasteAddress && (
                <button
                  type="button"
                  onClick={wrapSmartPaste(onSmartPasteAddress)}
                  disabled={smartPasteLoading}
                  title="클립보드 AI 주소 붙여넣기"
                  className="shrink-0 p-1 rounded-md border border-slate-200 bg-white text-slate-400 hover:border-[#3182F6] hover:text-[#3182F6] transition-colors disabled:opacity-50"
                  style={{ color: '#8B5CF6' }}
                >
                  <Wand2 size={9} />
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  void tryAutoFillAddress(true);
                }}
                disabled={isSearchingAddress || !safeDraft.name.trim()}
                title="장소 이름으로 주소 자동 검색 (네이버 검색)"
                className="shrink-0 p-1 rounded-md border border-slate-200 bg-white text-slate-400 disabled:opacity-50 hover:border-[#3182F6] hover:text-[#3182F6] transition-colors"
                style={{ color: '#3182F6' }}
              >
                <Sparkles size={9} />
              </button>
            </div>
          )}
        />
        <SharedBusinessRow
          summary={businessSummary}
          onContainerClick={() => updateDraft((current) => ({ ...current, showBusinessEditor: true }))}
          onToggle={() => updateDraft((current) => ({ ...current, showBusinessEditor: true }))}
          quickEditSegments={businessQuickEditSegments}
          onQuickEdit={(fieldKey) => updateDraft((current) => ({ ...current, showBusinessEditor: true, businessFocusField: fieldKey }))}
          actionButton={(
            <button
              type="button"
              onClick={wrapSmartPaste(onSmartPasteBusiness)}
              disabled={smartPasteLoading}
              className="shrink-0 p-1 rounded-md border border-slate-200 bg-white text-slate-400 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200 transition-colors disabled:opacity-50"
              title="영업정보만 스마트 붙여넣기"
            >
              {smartPasteLoading
                ? <svg className="animate-spin" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                : <Sparkles size={9} />}
            </button>
          )}
          expanded={safeDraft.showBusinessEditor ? (
            <div className="mt-2">
              <BusinessHoursEditor
                business={safeDraft.business}
                focusField={safeDraft.businessFocusField}
                onChange={(business) => updateDraft((current) => ({ ...current, business: normalizeBusiness(business || {}), businessFocusField: null }))}
              />
            </div>
          ) : null}
        />

        <SharedMemoRow value={safeDraft.memo} onChange={(event) => updateDraft((current) => ({ ...current, memo: event.target.value }))} />
      </div>

      <div className="mx-4 mb-4 rounded-2xl overflow-hidden border border-slate-100/80 flex flex-col min-h-0">
        {receiptExpanded && (
          <div className="px-5 py-4 bg-white border-b border-slate-100 border-dashed overflow-y-auto flex-1 min-h-0">
            <div className="space-y-3 mb-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[10px] text-slate-400 font-semibold">메뉴명/수량/가격을 수정하면 총액이 자동 계산됩니다.</p>
                <button
                  type="button"
                  onClick={wrapSmartPaste(onSmartPasteMenus)}
                  disabled={smartPasteLoading}
                  className="shrink-0 p-1 rounded-md border border-slate-200 bg-white text-slate-400 hover:bg-blue-50 hover:text-[#3182F6] hover:border-blue-200 transition-colors disabled:opacity-50"
                  title="메뉴만 스마트 붙여넣기"
                >
                  {smartPasteLoading
                    ? <svg className="animate-spin" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                    : <Sparkles size={9} />}
                </button>
              </div>
              {safeDraft.receipt.items.map((item, idx) => (
                <div key={`draft-menu-${idx}`} className="flex justify-between items-center text-xs group/item">
                  <div className="flex items-center gap-2 flex-1">
                    <div className="cursor-pointer text-slate-300 hover:text-[#3182F6]" onClick={() => updateDraft((current) => {
                      const items = [...current.receipt.items];
                      items[idx] = { ...items[idx], selected: items[idx].selected === false };
                      return { ...current, receipt: { ...current.receipt, items } };
                    })}>
                      {item.selected === false ? <Square size={14} /> : <CheckSquare size={14} className="text-[#3182F6]" />}
                    </div>
                    <input
                      data-draft-menu-name={idx}
                      value={item.name}
                      onChange={(event) => updateDraft((current) => {
                        const items = [...current.receipt.items];
                        items[idx] = { ...items[idx], name: event.target.value };
                        return { ...current, receipt: { ...current.receipt, items } };
                      })}
                      className="bg-transparent border-none outline-none text-slate-700 font-bold w-full"
                      placeholder="메뉴명"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <MenuPriceInput
                      value={item.price}
                      onCommit={(nextPrice) => updateDraft((current) => {
                        const items = [...current.receipt.items];
                        items[idx] = { ...items[idx], price: nextPrice };
                        return { ...current, receipt: { ...current.receipt, items } };
                      })}
                      className="w-16 text-right font-bold text-slate-500 bg-transparent border-none outline-none placeholder:text-slate-300 focus:border-b focus:border-slate-300"
                    />
                    <div className="flex items-center gap-1 bg-white border border-slate-200 rounded p-0.5 shadow-sm">
                      <button type="button" onClick={() => updateDraft((current) => {
                        const items = [...current.receipt.items];
                        items[idx] = { ...items[idx], qty: Math.max(1, getQty(items[idx]) - 1) };
                        return { ...current, receipt: { ...current.receipt, items } };
                      })}><Minus size={10} /></button>
                      <span className="w-4 text-center text-[10px]">{getQty(item)}</span>
                      <button type="button" onClick={() => updateDraft((current) => {
                        const items = [...current.receipt.items];
                        items[idx] = { ...items[idx], qty: getQty(items[idx]) + 1 };
                        return { ...current, receipt: { ...current.receipt, items } };
                      })}><Plus size={10} /></button>
                    </div>
                    <span className="w-20 text-right font-black text-[#3182F6]">₩{getLineTotal(item).toLocaleString()}</span>
                    <button type="button" onClick={() => updateDraft((current) => {
                      const items = [...current.receipt.items];
                      items.splice(idx, 1);
                      return { ...current, receipt: { ...current.receipt, items } };
                    })} className="text-slate-300 hover:text-red-500"><Trash2 size={12} /></button>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                setPendingMenuFocusIdx(safeDraft.receipt.items.length);
                updateDraft((current) => ({ ...current, receipt: { ...current.receipt, items: [...current.receipt.items, { name: '', price: 0, qty: 1, selected: true }] } }));
              }}
              className="w-full py-2 border border-dashed border-slate-300 rounded-xl text-[10px] font-bold text-slate-400 hover:text-[#3182F6] hover:bg-white transition-all"
            >
              + 메뉴 추가
            </button>
          </div>
        )}

        <SharedTotalFooter expanded={receiptExpanded} total={total} onToggle={() => setReceiptExpanded((prev) => (forceReceiptExpanded ? true : !prev))} />
      </div>

      <div className="px-4 pb-4 flex gap-2 shrink-0">
        <button onClick={() => onSubmit(createDraft({ ...safeDraft, price: total }))} className="flex-1 py-3 bg-[#3182F6] text-white text-[13px] font-black rounded-xl shadow-[0_8px_16px_-6px_rgba(49,130,246,0.35)] hover:bg-blue-600 transition-all active:scale-[0.98]">
          {submitLabel}
        </button>
        <button onClick={onCancel} className="px-5 py-3 bg-white border border-slate-200 text-slate-500 text-[13px] font-black rounded-xl hover:bg-slate-50 transition-all">
          {cancelLabel}
        </button>
      </div>
      {addressSearchNote ? <div className="px-4 pb-4 -mt-1 text-[10px] font-bold text-slate-400">{addressSearchNote}</div> : null}
    </div>
  );
};

export const PlaceLibraryCard = ({
  cardProps = {},
  place,
  chips,
  baseDistance = null,
  statusChip = null,
  businessSummary = '미설정',
  isExpanded = false,
  onEdit,
  onOpenMap,
  onBusinessEdit,
  onBusinessQuickEdit,
  onToggleExpand,
  onDelete,
  getMenuQtyValue,
  getMenuLineTotalValue,
  extraContent = null,
  buildBusinessQuickEditSegments,
  viewMode = 'default',
  highlighted = false,
  onJinaSmartFill,
  showPrice = true,
  categoryAccent = '',
  categoryBorder = '',
}) => {
  const [jinaLoading, setJinaLoading] = React.useState(false);
  const visibleMenus = (place.receipt?.items || []).filter((menu) => menu && menu.selected !== false);
  const isCompact = viewMode === 'compact';
  const hasMemo = Boolean(String(place.memo || '').trim());
  const nameRowActions = (
    <div className="flex items-center gap-1">
      {onJinaSmartFill && (
        <button
          type="button"
          disabled={jinaLoading}
          onClick={async (e) => {
            e.stopPropagation();
            setJinaLoading(true);
            try { await onJinaSmartFill(); } finally { setJinaLoading(false); }
          }}
          className={`shrink-0 p-1 rounded-md border transition-colors ${jinaLoading ? 'border-emerald-300 bg-emerald-50 text-emerald-400' : 'border-emerald-200 bg-white text-emerald-500 hover:border-emerald-400 hover:bg-emerald-50'}`}
          title="v2 지도검색 자동채우기"
        >
          {jinaLoading ? <svg className="animate-spin" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg> : <Search size={9} />}
        </button>
      )}
      <button
        type="button"
        onClick={onEdit}
        className="shrink-0 p-1 rounded-md border border-slate-200 bg-white text-slate-400 hover:border-[#3182F6] hover:text-[#3182F6] transition-colors"
        title="장소 수정"
      >
        <Pencil size={9} />
      </button>
    </div>
  );

  return (
  <div
    {...cardProps}
    data-map-focus-card="true"
    className={`w-full group relative overflow-hidden rounded-[24px] border bg-white shadow-[0_8px_24px_-10px_rgba(15,23,42,0.10)] transition-all duration-300 ${highlighted ? 'border-[#3182F6] shadow-[0_0_0_3px_rgba(49,130,246,0.18)]' : categoryBorder ? `${categoryBorder} hover:shadow-[0_12px_28px_-10px_rgba(15,23,42,0.14)]` : 'border-slate-200 hover:shadow-[0_12px_28px_-10px_rgba(15,23,42,0.14)] hover:border-slate-300'} ${cardProps.className || ''}`.trim()}
  >
    {/* 카테고리 악센트 바 */}
    {categoryAccent && <div className={`h-[3px] w-full ${categoryAccent}`} />}
    {jinaLoading && (
      <div className="px-4 pt-3 pb-1">
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2">
          <svg className="animate-spin shrink-0" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
          <span className="text-[10px] font-bold text-emerald-600">v2 지도검색 중... 네이버 지도에서 정보를 가져오고 있습니다</span>
        </div>
      </div>
    )}
    <div className="p-5 flex flex-col gap-2.5">
      <SharedNameRow
        value={place.name || ''}
        readOnly
        placeholder="장소 이름"
        prefixContent={chips}
        onContainerClick={(event) => {
          event.stopPropagation();
          // prefixContent(카테고리 칩) 클릭 시 지도 열기 방지
          const target = event.target instanceof Element ? event.target : null;
          if (target?.closest('[data-no-drag]') || target?.closest('button')) return;
          if (typeof onOpenMap === 'function') onOpenMap(event);
        }}
        actionButton={nameRowActions}
      />
      {(baseDistance != null || statusChip) && (
        <div className="flex items-center gap-1.5 flex-wrap pr-12" data-no-drag="true">
          {baseDistance != null && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold border border-blue-200 bg-blue-50 text-blue-600">
              {baseDistance}km
            </span>
          )}
          {statusChip}
        </div>
      )}
      {!isCompact && (
        <SharedAddressRow
          value={place.address || place.receipt?.address || ''}
          onChange={() => {}}
          onContainerClick={(event) => event.stopPropagation()}
          leading={<MapPin size={11} className="text-[#3182F6] shrink-0" />}
        />
      )}
      <SharedBusinessRow
        summary={businessSummary}
        placeholder="영업 정보 (선택)"
        onContainerClick={(event) => event.stopPropagation()}
        onToggle={onBusinessEdit}
        quickEditSegments={buildBusinessQuickEditSegments(place.business || {})}
        onQuickEdit={(fieldKey) => onBusinessQuickEdit?.(fieldKey)}
      />
      {(!isCompact || hasMemo) && (
        <SharedMemoRow value={place.memo || ''} onChange={() => {}} readOnly onContainerClick={(event) => event.stopPropagation()} />
      )}
      {extraContent}
    </div>
    {showPrice && isExpanded && !isCompact && (
      <div className="px-5 py-4 animate-in slide-in-from-top-1 bg-white border-b border-slate-100 border-dashed">
        <div className="space-y-1.5">
          {visibleMenus.map((menu, idx) => (
            <div key={`${menu?.name || 'menu'}-${idx}`} className="flex items-center justify-between text-[10px]">
              <span className="text-slate-600 font-bold truncate">{menu?.name || '-'}</span>
              <span className="text-slate-400 font-bold">x{getMenuQtyValue(menu)}</span>
              <span className="text-[#3182F6] font-black">₩{getMenuLineTotalValue(menu).toLocaleString()}</span>
            </div>
          ))}
          {visibleMenus.length === 0 && (
            <p className="text-[10px] text-slate-400 font-semibold">체크된 메뉴가 없습니다.</p>
          )}
        </div>
      </div>
    )}
    {showPrice && !isCompact && <SharedTotalFooter expanded={isExpanded} total={place.price} onToggle={onToggleExpand} />}
  </div>
  );
};
