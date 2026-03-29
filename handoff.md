# Anti Planer — 인수인계 & 개선 체크리스트

> 최종 업데이트: 2026-03-29
> App.jsx: 10,242줄 / useState: 78개 / Zustand 6 스토어 / 분리 컴포넌트 11개
> 시작 대비: -1,105줄 (-9.7%) / 번들: App 538KB (분할)

---

## 완료된 작업

### 레이아웃 대개편
- [x] 지도 중심 전체화면 레이아웃 (PC/모바일 통일)
- [x] 네비게이션 → 좌측 플로팅 패널
- [x] 내장소 → 우측 플로팅 패널
- [x] 타임라인 → 오버레이 바 아래 드롭다운 패널
- [x] 상단 메뉴바 통합
- [x] MobileTabBar / NavBottomMenu 제거
- [x] 히어로 영역 삭제
- [x] 일정 개요 위젯
- [x] 접기 버튼 패널 외부 배치
- [x] 모달 페이지 가운데 정렬

### 지도 마커 디자인
- [x] pill 디자인 통일 (직각, 행간 여백, pill 컨테이너)
- [x] hover → zIndexOffset 최상위
- [x] 이동시간 라벨 개선
- [x] 클러스터 반경 확대 (70px/140px)
- [x] START/END 뱃지 제거

### 기능
- [x] 15분 거리 점선 원 오버레이
- [x] 내장소 마커 + 버튼
- [x] 퀵뷰 드래그 이동 + 배경 차단 제거
- [x] 카테고리 드롭다운 (단일 선택)
- [x] 태그 피커 카테고리 뱃지 스타일
- [x] v2 지도검색 → 슈퍼 자동채우기
- [x] 네비 아이템 퀵뷰 헤더 스타일
- [x] 네비 드래그 → 밖=삭제, 내장소=이동

### 성능 최적화
- [x] Zustand 6개 스토어 도입
- [x] PWA Service Worker
- [x] backdrop-blur 전체 제거 (32곳)
- [x] 반투명 배경 불투명화 (50곳+)
- [x] transition-all → transition-colors (35곳+)
- [x] 마커 drop-shadow 간소화
- [x] 지도 타일 opacity 1.0
- [x] dragCoord useState → useRef
- [x] 드래그 중 dropTarget 변경 시에만 setState
- [x] 줌 레벨 조건부 렌더링
- [x] resize rAF 디바운스
- [x] JSON.parse/stringify 86곳 → structuredClone
- [x] 드래그 잔상 제거 (setDragImage)

### 코드 정리
- [x] dead code 대량 삭제 (~500줄)
- [x] App_utf8.jsx 삭제 (-4,266줄)
- [x] CSS rounded → tailwind.config.js
- [x] z-index CSS 변수 레이어 시스템 정의
- [x] 스토어 마이그레이션 주석 60줄 정리

### 컴포넌트 분리 (8개)
- [x] MapOverlayBar.jsx (React.memo, useMapStore+useUIStore)
- [x] TopMenuBar.jsx (React.memo, useUIStore+useItineraryStore)
- [x] OverviewWidget.jsx (React.memo)
- [x] ToastNotifications.jsx (React.memo, useToastStore)
- [x] AuthScreen.jsx (LoadingScreen + LoginScreen)
- [x] ChecklistPanel.jsx (React.memo, useUIStore)
- [x] AiSettingsModal.jsx (React.memo, useUIStore)
- [x] OverviewWidget.jsx (React.memo)

---

## 남은 작업

### P1 (높은 우선순위)
- [ ] **z-index CSS 변수 실제 적용** — 현재 :root에 정의만, 코드에서 z-[310] 등 하드코딩 유지
- [ ] **Zustand destructure 패턴** — App에서 전부 꺼내써서 실질적 리렌더 감소 제한적
- [ ] **itinerary Zustand 이전** — useEffect 의존성 무한루프 문제로 롤백됨. immer middleware 도입 후 재시도 필요
- [ ] **남은 모달 분리** — PlanOptions(192줄), ShareManager(82줄), PerplexityNearby(126줄), PlanManager(59줄), PlaceTrash(54줄)

### P2 (중기)
- [ ] Zustand 나머지 useState 이전 (현재 78개 중 ~20개 추가 가능)
- [ ] TypeScript 도입
- [ ] 에러 추적 서비스 (Sentry)
- [ ] stopPropagation 116곳 정리
- [ ] ARIA 라벨 + 키보드 내비게이션 + 포커스 관리
- [ ] Tailwind 브레이크포인트 활용 (hidden sm: 2곳만)
- [ ] 폰트 크기 체계화 (text-[9px]~[30px])
- [ ] Math.random() → crypto.getRandomValues() (4곳)

### P3 (장기)
- [ ] react-leaflet-cluster 도입
- [ ] 코드 스플리팅 (React.lazy + Suspense)
- [ ] 에러 바운더리 세분화
- [ ] 테스트 코드 작성

---

## 아키텍처

### Zustand 스토어 6개
```
src/stores/
├── useUIStore.js        16개 (모달, 패널)
├── useToastStore.js      4개 (알림)
├── useMapStore.js       16개 (지도)
├── useDragStore.js       9개 (드래그&드롭)
├── useEditorStore.js    22개 (편집)
└── useItineraryStore.js  5개 (isEditMode, isDirty, tripRegion, dates)
합계: 72개 이전 / useState 78개 남음
```

### 주의사항
- itinerary, activeDay, activeItemId는 useState 유지 (Zustand 이전 시 무한루프)
- accent 배경 위 아이콘 버튼은 bg-white/20 유지 (불투명이면 안 보임)
- * { border-radius: 0 !important } CSS 규칙 유지

### NOMAD 벤치마크 비교
| 항목 | NOMAD | Anti Planer | 격차 |
|------|-------|-------------|------|
| 상태관리 | Zustand (컴포넌트별) | Zustand 6개 + useState 78개 | 🟡 개선중 |
| 번들 | 코드 스플리팅 | 단일 1.18MB | 🔴 |
| GPU | 최소화 | backdrop-blur 제거 완료 | 🟢 |
| 캐싱 | PWA 4단계 | PWA 도입 완료 | 🟢 |
| 파일 | 모듈화 | 10,445줄 + 8개 분리 | 🟡 개선중 |
