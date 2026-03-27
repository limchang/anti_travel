import React from 'react';
import { Plus, X, MapPin, Pencil, Star, ChevronDown, ChevronUp, Clock, StickyNote } from 'lucide-react';
import { TAG_OPTIONS, TAG_VALUES, MODIFIER_TAGS, normalizeTagOrder, toggleTagSelection, getTagButtonClass, WEEKDAY_OPTIONS, formatClosedDaysSummary, EMPTY_BUSINESS } from '../../utils/constants.js';
import { normalizeBusiness } from '../../utils/time.js';

export const OrderedTagPicker = ({ value = ['place'], onChange, title = '태그', className = '' }) => {
  const selected = normalizeTagOrder(value);
  const [customInput, setCustomInput] = React.useState('');
  const [isAddingCustom, setIsAddingCustom] = React.useState(false);
  const inputRef = React.useRef(null);

  const handleAddCustom = () => {
    const val = customInput.trim();
    if (val && !selected.includes(val)) {
      onChange(normalizeTagOrder([...selected, val]));
    }
    setCustomInput('');
    setIsAddingCustom(false);
  };

  const predefinedValues = new Set(TAG_OPTIONS.map(v => v.value));
  const activeTags = selected.filter(v => v !== 'place');
  const customTags = activeTags.filter(v => !predefinedValues.has(v));

  React.useEffect(() => {
    if (isAddingCustom && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAddingCustom]);

  return (
    <div className={className}>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1.5">{title}</p>
      <div className="flex flex-wrap gap-1.5 items-center">
        {TAG_OPTIONS.map(t => {
          const active = selected.includes(t.value);
          return (
            <button key={t.value} type="button" onClick={() => onChange(toggleTagSelection(selected, t.value))}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-black border transition-colors ${getTagButtonClass(t.value, active)}`}>
              {t.label}
            </button>
          );
        })}
        {customTags.map(t => (
          <button key={t} type="button" onClick={() => onChange(normalizeTagOrder(selected.filter(v => v !== t)))}
            className="px-2 py-0.5 rounded-lg text-[10px] font-black border transition-colors text-slate-600 bg-slate-100 border-slate-300 hover:bg-slate-200">
            {t}
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
              onChange={e => setCustomInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') { e.preventDefault(); handleAddCustom(); }
                if (e.key === 'Escape') { setIsAddingCustom(false); setCustomInput(''); }
              }}
              onBlur={() => { if (!customInput.trim()) setIsAddingCustom(false); }}
              placeholder="태그 입력"
              className="w-20 px-2 py-0.5 rounded-lg text-[10px] font-black border border-[#3182F6] bg-white outline-none"
            />
            <button
              type="button"
              onClick={handleAddCustom}
              className="text-[10px] font-bold text-[#3182F6] px-1"
            >
              확인
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export const getCustomTagLabel = (tag) => String(tag || '').trim();
export const ACTION_SLOT_CLASS = 'shrink-0 flex items-center justify-end gap-1 min-w-[3.25rem]';

export const SharedNameRow = ({
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
export const SharedAddressRow = ({
  value,
  onChange,
  placeholder = '주소 정보 없음',
  leading = null,
  actions = null,
  onContainerClick,
}) => (
  <div className="flex items-center gap-2 w-full rounded-xl bg-slate-50 px-2.5 py-1.5" onClick={onContainerClick}>
    {leading || <MapPin size={11} className="text-slate-400 shrink-0" />}
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="flex-1 min-w-0 bg-transparent border-none outline-none text-[11px] font-bold text-slate-500 placeholder:text-slate-300"
    />
    {actions ? <div className={ACTION_SLOT_CLASS}>{actions}</div> : null}
  </div>
);
export const SharedBusinessRow = ({
  summary,
  placeholder = '영업 정보 (선택)',
  onToggle,
  actionButton = null,
  expanded = null,
  onContainerClick,
  quickEditSegments = null,
  onQuickEdit = null,
  status = '', // 'warn' | 'open' | ''
}) => {
  const bgClass = status === 'warn' ? 'bg-red-50 border border-red-200' : status === 'open' ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50';
  const iconClass = status === 'warn' ? 'text-red-500' : status === 'open' ? 'text-emerald-500' : 'text-amber-500';
  const textClass = status === 'warn' ? 'text-red-600' : status === 'open' ? 'text-emerald-700' : 'text-amber-700';
  const dotClass = status === 'warn' ? 'text-red-300' : status === 'open' ? 'text-emerald-300' : 'text-amber-300';
  return (
  <div className={`w-full rounded-xl px-2.5 py-1.5 ${bgClass}`} onClick={onContainerClick}>
    <div className="w-full flex items-center gap-2">
      <Clock size={11} className={`${iconClass} shrink-0`} />
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggle?.(e);
        }}
        className="flex-1 flex items-center gap-2 text-left min-w-0"
      >
        {summary === '미설정' || !summary ? (
          <span className="text-[10px] font-bold text-slate-400">{placeholder}</span>
        ) : quickEditSegments?.length && onQuickEdit ? (
          <span className={`text-[10px] font-bold ${textClass} truncate flex-1 flex items-center gap-1 flex-wrap`}>
            {quickEditSegments.map((segment, idx) => (
              <React.Fragment key={`${segment.fieldKey}-${idx}`}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuickEdit(segment.fieldKey);
                  }}
                  className="hover:text-[#3182F6] transition-colors"
                >
                  {segment.label}
                </button>
                {idx < quickEditSegments.length - 1 && <span className={dotClass}>·</span>}
              </React.Fragment>
            ))}
          </span>
        ) : (
          <span className={`text-[10px] font-bold ${textClass} truncate flex-1`}>{summary}</span>
        )}
      </button>
      {actionButton ? <div className={ACTION_SLOT_CLASS}>{actionButton}</div> : null}
    </div>
    {expanded}
  </div>
  );
};
// 메모 텍스트에서 체크리스트 항목 파싱
export const parseChecklistLines = (text = '') => {
  return String(text).split('\n').map((line, idx) => {
    const checked = /^-\s*\[x\]\s*/i.test(line);
    const unchecked = /^-\s*\[\s*\]\s*/.test(line);
    if (checked || unchecked) {
      return { idx, isCheckItem: true, checked, text: line.replace(/^-\s*\[[x\s]\]\s*/i, '') };
    }
    return { idx, isCheckItem: false, text: line };
  });
};
export const toggleChecklistLine = (memo, lineIdx) => {
  const lines = String(memo).split('\n');
  const line = lines[lineIdx] || '';
  if (/^-\s*\[x\]/i.test(line)) {
    lines[lineIdx] = line.replace(/^(-\s*)\[x\]/i, '$1[ ]');
  } else if (/^-\s*\[\s*\]/.test(line)) {
    lines[lineIdx] = line.replace(/^(-\s*)\[\s*\]/, '$1[x]');
  }
  return lines.join('\n');
};
export const hasChecklistItems = (text = '') => /^-\s*\[[x\s]\]/im.test(String(text));

export const SharedMemoRow = ({ value, onChange, placeholder = '메모를 입력하세요...', onContainerClick, readOnly = false }) => {
  const [editing, setEditing] = React.useState(false);
  const lines = parseChecklistLines(value);
  const hasList = hasChecklistItems(value);

  if (hasList && !editing) {
    return (
      <div onClick={onContainerClick} onDoubleClick={!readOnly ? (e) => { e.stopPropagation(); setEditing(true); } : undefined} className="w-full bg-slate-50 rounded-xl px-2.5 py-2" title={!readOnly ? '더블클릭으로 텍스트 편집' : undefined}>
        <div className="flex items-start gap-2">
          <StickyNote size={11} className="text-slate-400 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
          {lines.map((line) =>
            line.isCheckItem ? (
              <label key={line.idx} className="flex items-center gap-1.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={line.checked}
                  readOnly={readOnly}
                  onChange={readOnly ? undefined : () => {
                    const next = toggleChecklistLine(value, line.idx);
                    onChange?.({ target: { value: next } });
                  }}
                  className="w-3 h-3 rounded accent-[#3182F6] shrink-0"
                />
                <span className={`text-[11px] font-medium leading-snug ${line.checked ? 'line-through text-slate-300' : 'text-slate-600'}`}>{line.text}</span>
              </label>
            ) : (
              line.text.trim() ? (
                <span key={line.idx} className="text-[11px] font-medium text-slate-500 leading-snug">{line.text}</span>
              ) : null
            )
          )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div onClick={onContainerClick} className="flex items-center gap-2 w-full bg-slate-50 rounded-xl px-2.5 py-1.5">
      <StickyNote size={11} className="text-slate-400 shrink-0" />
      <input
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        autoFocus={editing}
        onBlur={() => setEditing(false)}
        className="flex-1 min-w-0 bg-transparent text-[11px] font-medium text-slate-500 outline-none placeholder:text-slate-400 focus:outline-none transition-all"
        placeholder={placeholder}
      />
    </div>
  );
};
export const MenuPriceInput = ({ value = 0, onCommit, className = '', onClick = null }) => {
  const normalizedValue = Number(value) || 0;
  const [isEditing, setIsEditing] = React.useState(false);
  const [draftValue, setDraftValue] = React.useState('');

  React.useEffect(() => {
    if (!isEditing) {
      setDraftValue(String(normalizedValue || ''));
    }
  }, [normalizedValue, isEditing]);

  return (
    <input
      type="text"
      inputMode="numeric"
      value={isEditing ? draftValue : String(normalizedValue || '')}
      placeholder={isEditing ? String(normalizedValue || 0) : ''}
      onFocus={(e) => {
        setIsEditing(true);
        setDraftValue('');
        requestAnimationFrame(() => e.target.select());
      }}
      onChange={(e) => setDraftValue(e.target.value.replace(/[^\d]/g, ''))}
      onBlur={() => {
        if (draftValue.trim() !== '') {
          onCommit(Number(draftValue) || 0);
        }
        setIsEditing(false);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') e.currentTarget.blur();
        if (e.key === 'Escape') {
          setDraftValue(String(normalizedValue || ''));
          setIsEditing(false);
          e.currentTarget.blur();
        }
      }}
      onClick={onClick}
      className={className}
    />
  );
};
export const SharedTotalFooter = ({ expanded, onToggle, total }) => (
  <div
    onClick={onToggle}
    className="mt-auto px-5 py-3 flex items-center justify-between cursor-pointer transition-all bg-slate-50/50 hover:bg-slate-50"
  >
    <span className="text-[10px] text-slate-400 font-black tracking-[0.15em] uppercase flex items-center gap-1.5">
      Total <ChevronDown size={10} className={`transition-transform duration-300 ${expanded ? 'rotate-180 text-[#3182F6]' : ''}`} />
    </span>
    <span className={`text-[16px] font-black tabular-nums transition-colors ${expanded ? 'text-[#3182F6]' : 'text-[#3182F6]'}`}>
      ₩{Number(total || 0).toLocaleString()}
    </span>
  </div>
);
export const createPlaceEditorDraft = (place = {}, overrides = {}) => {
  const business = normalizeBusiness(overrides.business ?? place.business ?? {});
  const cloneValue = (value) => JSON.parse(JSON.stringify(value));

  const rawReceipt = overrides.receipt ?? place.receipt ?? { address: overrides.address ?? place.address ?? '', items: [] };
  const receipt = cloneValue(rawReceipt);

  if (!Array.isArray(receipt.items)) receipt.items = [];
  receipt.items = receipt.items
    .filter(Boolean)
    .map((item) => ({
      name: String(item?.name || '').trim(),
      price: Number(item?.price) || 0,
      qty: Math.max(1, Number(item?.qty) || 1),
      selected: item?.selected !== false,
    }));

  return {
    ...place,
    ...overrides,
    name: overrides.name ?? place.name ?? '',
    address: overrides.address ?? place.address ?? place.receipt?.address ?? '',
    memo: overrides.memo ?? place.memo ?? '',
    types: normalizeTagOrder(Array.isArray(overrides.types ?? place.types) && (overrides.types ?? place.types).length ? (overrides.types ?? place.types) : ['place']),
    business,
    receipt: {
      ...receipt,
      address: overrides.receipt?.address ?? overrides.address ?? place.receipt?.address ?? place.address ?? '',
    },
    showBusinessEditor: overrides.showBusinessEditor ?? true,
    businessFocusField: overrides.businessFocusField ?? null,
  };
};
export const buildSmartFillMenuItems = (menus = []) => (
  Array.isArray(menus)
    ? menus
      .filter(Boolean)
      .map((item) => ({
        ...item,
        qty: Math.max(1, Number(item?.qty) || 1),
        selected: false,
      }))
    : []
);
