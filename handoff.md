# Anti Planer — 인수인계 & 개선 체크리스트

> 최종 업데이트: 2026-03-29
> 현재 App.jsx: ~11,300줄 / Zustand 스토어 5개 도입 완료

---

## 이번 세션에서 완료된 작업

### 레이아웃 대개편
- [x] 지도 중심 전체화면 레이아웃 (PC/모바일 통일)
- [x] 네비게이션 → 좌측 플로팅 패널 (접기/펼치기)
- [x] 내장소 → 우측 플로팅 패널 (접기/펼치기)
- [x] 타임라인 → 오버레이 바 아래 드롭다운 패널
- [x] 상단 메뉴바 통합 (일정옵션, 날짜, 저장 등)
- [x] 하단 MobileTabBar / NavBottomMenu 제거
- [x] 히어로 영역(배경이미지, 개요카드) 숨김 처리
- [x] 일정 개요 위젯 (네비 패널 아래 플로팅)
- [x] 접기 버튼 패널 외부 배치 (←/→)

### 지도 마커 디자인 통일
- [x] pill 디자인 통일 (단일/클러스터/그룹 모두 동일)
- [x] border-radius 0 (완전 직각)
- [x] 행간 2px 여백 + 개별 rounded
- [x] 흰색 pill 컨테이너 (padding 2px)
- [x] hover → zIndexOffset으로 최상위 (pane 내)
- [x] 이동시간 라벨 디자인 개선 (흰 배경 + 아이콘)
- [x] 클러스터 반경 확대 (아이콘 70px, 이름 140px)

### 기능 추가/개선
- [x] 일정 선택 시 15분 거리(10km) 점선 원 오버레이
- [x] 내장소 마커 + 버튼 (일정 다음으로 바로 등록)
- [x] 퀵뷰 모달 드래그 이동
- [x] 퀵뷰 열린 상태에서 + 클릭 가능 (배경 차단 제거)
- [x] 네비 드래그 → 밖으로 드롭=삭제, 내장소=이동
- [x] 카테고리 필터 드롭다운 (단일 선택)
- [x] 태그 피커 카테고리 뱃지 스타일
- [x] v2 지도검색 제거 → 슈퍼 자동채우기로 통일

### 성능 최적화
- [x] Zustand 도입 (67/87 useState 이전, 5개 스토어)
- [x] PWA Service Worker (지도타일 30일, API 24시간 캐시)
- [x] backdrop-blur 전체 제거 (32곳)
- [x] 반투명 배경 불투명화 (50곳+)
- [x] transition-all → transition-colors (35곳+)
- [x] 마커 drop-shadow 간소화
- [x] 지도 타일 opacity 1.0
- [x] dragCoord를 ref로 변경 (드래그 중 리렌더 제거)
- [x] 드래그 중 dropTarget 변경 시에만 setState
- [x] 드래그 잔상 제거 (setDragImage 빈 이미지)
- [x] 줌 레벨 조건부 렌더링 (경로 라벨 zoom 10+)
- [x] 지도 초기 뷰에서 출발지(집) 제외

---

## 미완료 — 즉시 수정 필요 (CRITICAL)

### P0: 치명적
- [ ] **경로 초기 로드 불안정** — refreshRoutePreviewMap이 최초에 제대로 실행 안 됨. 2초 딜레이 후 호출하지만 불안정. 근본 원인: geo 동기화 완료 시점과 경로 빌드 시점 불일치
- [x] **dead code 정리** — `{false && ...}`, `{false ? null : ...}` 제거 완료
- [x] **App_utf8.jsx 중복 파일** — 삭제 완료 (-4,266줄)

### P1: 높은 우선순위
- [ ] **Zustand destructure 패턴 개선** — 현재 App에서 전부 꺼내쓰므로 실질적 리렌더 감소 없음. 하위 컴포넌트에서 직접 `useUIStore(s => s.showNavMenu)` 사용해야 효과 있음
- [ ] **JSON.parse(JSON.stringify) 86곳** → immer 또는 structuredClone으로 교체
- [x] **z-index 체계화** — CSS variables 레이어 시스템 정의 완료 (index.css :root)
- [x] **CSS rounded 규칙 정리** — `[class*="rounded"]` !important 제거 → tailwind.config.js borderRadius: 0 으로 올바르게 설정
- [x] **resize 핸들러 디바운스** — rAF 디바운스 적용 완료

---

## 미완료 — 중기 개선 (HIGH)

### 코드 품질
- [ ] **App.jsx 컴포넌트 분리** — 현재 11,300줄. 최소 분리 대상:
  - `NavPanel.jsx` (네비게이션 플로팅 패널)
  - `PlacesPanel.jsx` (내장소 플로팅 패널)
  - `MapOverlayBar.jsx` (지도 상단 오버레이 바)
  - `QuickViewModal.jsx` (퀵뷰 모달)
  - `TimelineOverlay.jsx` (상세 일정 편집)
- [ ] **Zustand 나머지 20개 useState 이전** — auth, itinerary, route, plan 관련
- [ ] **TypeScript 도입** — 단계적으로 `.jsx` → `.tsx` 변환
- [ ] **에러 추적 서비스 연동** (Sentry 등)

### 접근성 (Accessibility)
- [ ] **ARIA 라벨 추가** — 모든 interactive 요소에 `aria-label`
- [ ] **키보드 내비게이션** — Tab, Enter, Escape 지원
- [ ] **포커스 관리** — 모달 열릴 때 포커스 이동, 닫힐 때 복원
- [ ] **스크린 리더 지원** — `role`, `aria-expanded`, `aria-hidden`

### 반응형 디자인
- [ ] **Tailwind 브레이크포인트 활용** — `sm:`, `md:`, `lg:` 적극 사용
- [ ] **폰트 크기 체계화** — text-[9px]~text-[30px] → Tailwind 표준 스케일
- [ ] **하드코딩된 px 값 정리** — `w-[200px]` 등 93곳+

### 보안
- [ ] **ID 생성** — `Math.random()` → `crypto.getRandomValues()` (4곳)
- [ ] **MapComponents HTML 문자열** — template literal → React 컴포넌트 또는 DOM API

---

## 미완료 — 장기 개선 (MEDIUM)

- [ ] **react-leaflet-cluster 도입** — 수동 클러스터링 → 라이브러리 위임
- [ ] **코드 스플리팅** — React.lazy + Suspense로 페이지별 로드
- [ ] **stopPropagation 정리** (71곳) — 이벤트 위임 패턴 도입
- [ ] **에러 바운더리 세분화** — 현재 전체 앱 1개 → 패널별 분리
- [ ] **테스트 코드 작성** — 핵심 로직 (시간계산, 경로, 파싱) 단위 테스트
- [ ] **console.error/warn 정리** (12곳) — 에러 추적 서비스로 대체

---

## 아키텍처 현황

### Zustand 스토어 구조
```
src/stores/
├── useUIStore.js      — 16개 (모달, 패널)
├── useToastStore.js   — 4개 (알림)
├── useMapStore.js     — 16개 (지도)
├── useDragStore.js    — 9개 (드래그&드롭)
└── useEditorStore.js  — 22개 (편집)
```

### 남은 App.jsx useState (~20개)
```
auth: user, authLoading, authError
trip: tripRegion, tripStartDate, tripEndDate
itinerary: itinerary, history, activeDay, activeItemId, isEditMode
plan: currentPlanId, planList, loading, isDirty
route: routePreviewDays, routePreviewLoading, calculatingRouteId
layout: viewportWidth, col1Collapsed, col2Collapsed
```

### z-index 현황 (정리 필요)
```
z-[1]       지도
z-[220]     내장소 패널
z-[250]     타임라인 오버레이
z-[270]     개요 위젯
z-[280]     네비 패널
z-[310]     상단 메뉴바
z-[400~408] 모달 (장소추가/수정/일정수정)
z-[500]     지도 오버레이 바
z-[9980]    드롭다운 배경
z-[9990]    드롭다운 메뉴
z-[99999]   퀵뷰 모달
```

### 성능 최적화 히스토리
```
1. backdrop-blur 32곳 제거 → GPU 블러 연산 제거
2. 반투명 배경 50곳+ 불투명화 → GPU 합성 레이어 감소
3. transition-all 35곳+ → transition-colors → 불필요 애니메이션 제거
4. dragCoord useState → useRef → 드래그 중 리렌더 0
5. 마커 drop-shadow 간소화/제거 → GPU 필터 부하 감소
6. 지도 타일 opacity 0.6 → 1 → GPU 합성 제거
7. PWA 캐싱 → 재방문 시 타일/API 즉시 로드
8. Zustand 67개 상태 이전 (효과 아직 제한적 — destructure 패턴 문제)
```

---

## NOMAD(TREK) 벤치마크 비교

| 항목 | NOMAD | Anti Planer | 차이 |
|------|-------|-------------|------|
| 상태관리 | Zustand (도메인별 분리) | Zustand (도입, App에서 전부 꺼내씀) | 실질 효과 미미 |
| 번들 | Vite 코드 스플리팅 | Vite 단일 번들 1.2MB | 분할 필요 |
| DB | SQLite + 인덱스 | Firebase Firestore | 네트워크 의존 |
| 실시간 | WebSocket | Firestore 리스너 | 비슷 |
| 캐싱 | PWA 4단계 | PWA 도입 완료 | 동등 |
| 지도 | react-leaflet-cluster | 수동 클러스터링 | 라이브러리 도입 권장 |
| 파일 구조 | 모듈화 (페이지/기능별) | App.jsx 11,300줄 | 분리 필요 |

---

## 참고 파일

- `CLAUDE.md` — Claude 전용 규칙
- `README.md` — 프로젝트 규칙/구조
- `.claude/plans/staged-hatching-brooks.md` — Zustand 마이그레이션 계획
- `.claude/projects/.../memory/` — 프로젝트 메모리
