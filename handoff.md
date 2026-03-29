# Anti Planer — 인수인계 & 개선 체크리스트

> 최종 업데이트: 2026-03-29
> App.jsx: 10,098줄 / useState: 71개 / Zustand 6 스토어 / 분리 컴포넌트 13개
> 시작 대비: -1,249줄 (-11.0%) / App 번들: 541KB (-54%) / 테스트: 17개

---

## 이번 세션 완료 (100+ 커밋)

### 레이아웃 (10) / 마커 (7) / 기능 (8) / 성능 (16) / 코드 정리 (8) / 컴포넌트 분리 (13) / 테스트 (17)

총 **79개 항목 완료**. 상세 내역은 git log 참고.

---

## 향후 작업 (다음 세션)

### 권장 순서
1. **TypeScript** — .jsx → .tsx 점진적 변환
2. **Sentry** — console.error/warn 14곳 → 에러 추적
3. **PlanOptions 분리** — Zustand에 planOption* 이전 후
4. **itinerary Zustand** — immer middleware 도입 후 재시도
5. **포커스 관리** — 모달 포커스 이동/복원
6. **stopPropagation 정리** — 113곳, 이벤트 위임
7. **react-leaflet-cluster** — 커스텀 pill 호환성 확인 후

### 주의사항
- itinerary Zustand 이전 → useEffect 의존성 무한루프 (1회 롤백됨)
- accent 배경 위 아이콘 버튼은 bg-white/20 유지
- `* { border-radius: 0 !important }` CSS 규칙 유지
- PlanOptions 모달은 props 20개+ (분리 비용 높음)

---

## 아키텍처

### Zustand 스토어 6개 (79개 상태)
```
useUIStore(23) useToastStore(4) useMapStore(16)
useDragStore(9) useEditorStore(22) useItineraryStore(5)
```

### 분리 컴포넌트 13개
```
MapOverlayBar, TopMenuBar, OverviewWidget, ToastNotifications,
LoadingScreen, LoginScreen, ChecklistPanel, AiSettingsModal,
ShareManagerModal, UpdateModal, PerplexityNearbyModal,
PlanManagerModal, PlaceTrashModal
```

### 번들 분할
```
App 541KB | firebase 459KB | leaflet 168KB | react 185KB | icons 20KB
```

### 테스트: `npx vitest run` → 17 passed ✅
