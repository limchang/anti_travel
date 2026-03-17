import React from 'react';
import { PlaceEditorCard } from './PlaceCards';

const buildSmartFillMenuItems = (menus = []) => (
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

export const PlaceAddForm = ({
  newPlaceName,
  setNewPlaceName,
  newPlaceTypes,
  setNewPlaceTypes,
  regionHint,
  onAdd,
  onCancel,
  aiEnabled = false,
  aiSettings,
  onNotify = null,
  aiLearningCapture,
  setAiLearningCapture,
  submitAiLearningCase,
  createPlaceEditorDraft,
  normalizeBusiness,
  EMPTY_BUSINESS,
  formatClosedDaysSummary,
  buildBusinessQuickEditSegments,
  searchAddressFromPlaceName,
  BusinessHoursEditor,
  normalizeAiSmartFillConfig,
  getCurrentUserBearerToken,
  fetchGeminiPlaceInfoFromMapLink,
  runGroqSmartFill,
  parseBusinessHoursText,
  analyzeClipboardSmartFill,
  extractNaverMapLink,
  normalizeSmartFillResult,
  parseNaverMapText,
  isAiSmartFillSource,
  getSmartFillErrorMessage,
}) => {
  const [draft, setDraft] = React.useState(() => createPlaceEditorDraft({
    name: newPlaceName,
    types: Array.isArray(newPlaceTypes) && newPlaceTypes.length ? newPlaceTypes : ['place'],
    business: EMPTY_BUSINESS,
    receipt: { address: '', items: [] },
  }));
  const [addressSearchNote, setAddressSearchNote] = React.useState('');
  const lastScrapedUrlRef = React.useRef('');

  React.useEffect(() => {
    setDraft((current) => createPlaceEditorDraft({
      ...current,
      name: newPlaceName,
      types: Array.isArray(newPlaceTypes) && newPlaceTypes.length ? newPlaceTypes : current.types,
    }));
  }, [newPlaceName, newPlaceTypes, createPlaceEditorDraft]);

  const handleAdd = () => {
    const safeDraft = createPlaceEditorDraft(draft);
    if (aiLearningCapture) {
      submitAiLearningCase(safeDraft, 'new');
    }
    onAdd({
      name: safeDraft.name,
      types: safeDraft.types,
      menus: safeDraft.receipt.items,
      address: safeDraft.address,
      memo: safeDraft.memo,
      business: safeDraft.business,
    });
  };

  const scrapePlaceFromMapLink = async (url) => {
    const cleanUrl = String(url || '').trim();
    if (!cleanUrl) return;
    if (lastScrapedUrlRef.current === cleanUrl) return;
    lastScrapedUrlRef.current = cleanUrl;

    onNotify?.('지도 링크 분석 중...');
    try {
      const normalizedSettings = normalizeAiSmartFillConfig(aiSettings);
      const bearerToken = await getCurrentUserBearerToken();
      if (normalizedSettings.geminiApiKey || bearerToken) {
        try {
          const geminiParsed = await fetchGeminiPlaceInfoFromMapLink({ url: cleanUrl, geminiApiKey: normalizedSettings.geminiApiKey, bearerToken });
          let finalParsed = geminiParsed;
          if (aiEnabled) {
            try {
              const refined = await runGroqSmartFill({
                mode: 'all',
                text: [
                  'Gemini extracted the following place information from a Naver Map URL.',
                  `Source URL: ${cleanUrl}`,
                  JSON.stringify(geminiParsed, null, 2),
                ].join('\n\n'),
                imageDataUrl: '',
                aiSettings: normalizedSettings,
                inputType: 'text',
              });
              if (refined?.parsed) finalParsed = refined.parsed;
            } catch {
              // Keep Gemini output if Groq post-processing fails.
            }
          }
          if (finalParsed?.name) setNewPlaceName(String(finalParsed.name).trim());
          if (finalParsed?.address) {
            setDraft((current) => createPlaceEditorDraft({ ...current, address: String(finalParsed.address).trim() }));
          }
          if (finalParsed?.business) {
            setDraft((current) => createPlaceEditorDraft({ ...current, business: normalizeBusiness({ ...current.business, ...finalParsed.business }) }));
          }
          onNotify?.(aiEnabled ? 'Gemini 링크 분석 후 AI 후처리까지 적용했습니다.' : 'Gemini가 지도 링크 정보를 분석했습니다.');
          return;
        } catch {
          // Fall through to scrape fallback.
        }
      }

      const apiBase = (import.meta.env.VITE_SCRAPER_API_BASE || '').replace(/\/$/, '');
      const candidates = Array.from(new Set([
        apiBase ? `${apiBase}/api/scrape` : '',
        '/api/scrape',
      ].filter(Boolean)));

      let data = null;
      let lastErr = null;

      for (const endpoint of candidates) {
        try {
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: cleanUrl }),
          });
          if (!res.ok) {
            const errBody = await res.json().catch(() => ({}));
            throw new Error(errBody?.details || errBody?.error || `HTTP ${res.status}`);
          }
          data = await res.json();
          if (data) break;
        } catch (err) {
          lastErr = err;
        }
      }

      if (!data) {
        throw lastErr || new Error('스크래핑 응답이 없습니다.');
      }

      if (data?.title) setNewPlaceName(String(data.title).trim());
      if (data?.address) {
        setDraft((current) => createPlaceEditorDraft({ ...current, address: String(data.address).trim() }));
      }

      const parsed = parseBusinessHoursText(String(data?.hours || ''));
      if (parsed.open || parsed.close || parsed.breakStart || parsed.breakEnd || parsed.lastOrder || parsed.entryClose) {
        setDraft((current) => createPlaceEditorDraft({ ...current, business: { ...current.business, ...parsed } }));
      }

      if (Array.isArray(data?.menus) && data.menus.length > 0) {
        const normalizedMenus = data.menus
          .map((menu) => ({ name: String(menu?.name || '').trim(), price: Number(menu?.price) || 0 }))
          .filter((menu) => {
            if (!menu.name) return false;
            if (/(제주|서울|부산|인천|경기|강원|충북|충남|전북|전남|경북|경남)/.test(menu.name) && /(로|길|대로|번길|동|읍|면)\s*\d/.test(menu.name)) return false;
            if (/(이전\s*페이지|다음\s*페이지|닫기|펼치기|이미지\s*개수|translateX|translateY)/i.test(menu.name)) return false;
            return true;
          });
        if (normalizedMenus.length) {
          setDraft((current) => createPlaceEditorDraft({
            ...current,
            receipt: {
              ...(current.receipt || {}),
              items: normalizedMenus.slice(0, 5).map((item) => ({ ...item, qty: 1, selected: true })),
            },
          }));
        }
      }

      onNotify?.('지도 링크에서 장소 정보를 불러왔습니다.');
      if (!data?.address && data?.title) {
        const foundAddress = await searchAddressFromPlaceName(String(data.title), regionHint);
        if (foundAddress?.address) {
          setDraft((current) => createPlaceEditorDraft({ ...current, address: foundAddress.address }));
        }
      }
    } catch (error) {
      onNotify?.(`지도 자동 추출 실패: ${error?.message || '알 수 없는 오류'}`);
    } finally {
      lastScrapedUrlRef.current = cleanUrl;
    }
  };

  return (
    <div className="mb-4 w-full shrink-0">
      <PlaceEditorCard
        className="w-[min(460px,calc(100vw-24px))] mx-auto"
        maxModalHeight="85vh"
        title="새 장소 등록"
        draft={draft}
        createDraft={createPlaceEditorDraft}
        normalizeBusiness={normalizeBusiness}
        formatClosedDaysSummary={formatClosedDaysSummary}
        buildBusinessQuickEditSegments={buildBusinessQuickEditSegments}
        searchAddressFromPlaceName={searchAddressFromPlaceName}
        BusinessHoursEditor={BusinessHoursEditor}
        setAddressSearchNote={setAddressSearchNote}
        addressSearchNote={addressSearchNote}
        onDraftChange={(nextDraft) => {
          setDraft(nextDraft);
          setNewPlaceName(nextDraft.name || '');
          setNewPlaceTypes(nextDraft.types || ['place']);
        }}
        onSubmit={handleAdd}
        onCancel={onCancel}
        submitLabel="장소 추가하기"
        regionHint={regionHint}
        autoFocusName
        forceReceiptExpanded
        onNameInput={(value) => {
          const mapUrl = extractNaverMapLink(value);
          if (mapUrl) {
            void scrapePlaceFromMapLink(mapUrl);
            return;
          }
          setNewPlaceName(value);
          setDraft((current) => createPlaceEditorDraft({ ...current, name: value }));
        }}
        onNamePaste={async (event) => {
          const text = event.clipboardData.getData('text');
          if (text && !extractNaverMapLink(text) && text.length > 50) {
            const parsed = normalizeSmartFillResult(parseNaverMapText(text));
            if (parsed && (parsed.address || parsed.business || parsed.menus.length)) {
              event.preventDefault();
              const nextDraft = createPlaceEditorDraft({
                ...draft,
                name: parsed.name || draft.name,
                address: parsed.address || draft.address,
                business: parsed.business ? normalizeBusiness(parsed.business) : draft.business,
                receipt: {
                  ...(draft.receipt || { address: '', items: [] }),
                  items: parsed.menus.length ? buildSmartFillMenuItems(parsed.menus) : (draft.receipt?.items || []),
                },
              });
              setDraft(nextDraft);
              setNewPlaceName(nextDraft.name);

              if (parsed) {
                setAiLearningCapture({
                  itemId: 'new',
                  rawSource: text,
                  aiResult: parsed,
                  inputType: 'text',
                });
              }

              onNotify?.('클립보드 내용을 분석하여 입력했습니다.');
            }
          }
        }}
        onSuperSmartPaste={async () => {
          try {
            const result = await analyzeClipboardSmartFill({ mode: 'all', aiEnabled, aiSettings });
            const parsed = result?.parsed;
            if (parsed) {
              const nextName = parsed.name || draft.name;
              let nextAddress = parsed.address || draft.address;

              if (!nextAddress && nextName) {
                const searchRes = await searchAddressFromPlaceName(nextName, regionHint);
                if (searchRes?.address) nextAddress = searchRes.address;
              }

              setDraft((current) => createPlaceEditorDraft(current, {
                name: nextName,
                address: nextAddress,
                business: parsed.business ? normalizeBusiness(parsed.business) : current.business,
                receipt: {
                  ...current.receipt,
                  items: parsed.menus?.length
                    ? buildSmartFillMenuItems(parsed.menus)
                    : current.receipt.items,
                },
              }));
              if (nextName) setNewPlaceName(nextName);

              onNotify?.(isAiSmartFillSource(result?.source)
                ? `AI가${result?.usedImage ? ' 이미지와 ' : ' '}모든 정보를 분석해 입력했습니다.`
                : '모든 정보를 스마트 입력했습니다.');

              setAiLearningCapture?.({
                itemId: 'new',
                rawSource: result?.rawPayload?.text || (result?.usedImage ? '[Image Data]' : ''),
                aiResult: parsed,
                inputType: result?.usedImage ? 'image' : 'text',
              });
            } else {
              onNotify?.(aiEnabled ? 'AI가 정보를 찾지 못했습니다.' : '정보를 찾지 못했습니다.');
            }
          } catch (error) {
            onNotify?.(getSmartFillErrorMessage(error, aiEnabled));
          }
        }}
        onSmartPasteAddress={async () => {
          try {
            const result = await analyzeClipboardSmartFill({ mode: 'address', aiEnabled, aiSettings });
            const parsed = result?.parsed;
            if (parsed?.address) {
              setDraft((current) => createPlaceEditorDraft(current, { address: parsed.address }));
              onNotify?.(isAiSmartFillSource(result?.source)
                ? `AI가${result?.usedImage ? ' 이미지와 ' : ' '}주소 정보를 분석해 입력했습니다.`
                : '주소 정보를 스마트 입력했습니다.');
            } else {
              onNotify?.(aiEnabled ? 'AI가 주소를 찾지 못했습니다.' : '주소를 찾지 못했습니다.');
            }
          } catch (error) {
            onNotify?.(getSmartFillErrorMessage(error, aiEnabled));
          }
        }}
        onSmartPasteBusiness={async () => {
          try {
            const result = await analyzeClipboardSmartFill({ mode: 'business', aiEnabled, aiSettings });
            const parsed = result?.parsed;
            if (parsed?.business) {
              setDraft((current) => createPlaceEditorDraft({ ...current, business: normalizeBusiness(parsed.business) }));
              onNotify?.(isAiSmartFillSource(result?.source)
                ? `AI가${result?.usedImage ? ' 이미지와 ' : ' '}영업 정보를 분석해 입력했습니다.`
                : '영업 정보를 스마트 입력했습니다.');
            } else {
              onNotify?.(aiEnabled ? 'Groq가 영업 정보를 찾지 못했습니다.' : '영업 정보를 찾지 못했습니다.');
            }
          } catch (error) {
            onNotify?.(getSmartFillErrorMessage(error, aiEnabled));
          }
        }}
        onSmartPasteMenus={async () => {
          try {
            const result = await analyzeClipboardSmartFill({ mode: 'menus', aiEnabled, aiSettings });
            const parsed = result?.parsed;
            if (parsed?.menus?.length) {
              setDraft((current) => createPlaceEditorDraft({
                ...current,
                receipt: {
                  ...(current.receipt || { address: '', items: [] }),
                  items: buildSmartFillMenuItems(parsed.menus),
                },
              }));
              onNotify?.(isAiSmartFillSource(result?.source)
                ? `AI가${result?.usedImage ? ' 이미지와 ' : ' '}메뉴를 분석해 입력했습니다.`
                : '메뉴 정보를 스마트 입력했습니다.');
            } else {
              onNotify?.(aiEnabled ? 'Groq가 메뉴 정보를 찾지 못했습니다.' : '메뉴 정보를 찾지 못했습니다.');
            }
          } catch (error) {
            onNotify?.(getSmartFillErrorMessage(error, aiEnabled));
          }
        }}
      />
    </div>
  );
};
