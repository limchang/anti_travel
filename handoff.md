# Anti Planer — 인수인계 & 개선 체크리스트

> 최종 업데이트: 2026-03-29
> App.jsx: 11,347줄 / useState: 83개 (52개 Zustand 이전) / 번들: 1.2MB
> 총 커밋: 994개 (이번 세션 84개)

---

## 이번 세션 완료 작업 요약

### 레이아웃 (10개)
- [x] 지도 중심 전체화면 레이아웃 (PC/모바일 통일)
- [x] 네비게이션 → 좌측 플로팅 패널 (접기/펼치기)
- [x] 내장소 → 우측 플로팅 패널 (접기/펼치기)
- [x] 타임라인 → 오버레이 바 아래 드롭다운 패널
- [x] 상단 메뉴바 통합 (일정옵션, 날짜, 저장 등)
- [x] 하단 MobileTabBar / NavBottomMenu 제거
- [x] 히어로 영역 숨김 처리
- [x] 일정 개요 위젯 (네비 패널 아래 플로팅)
- [x] 접기 버튼 패널 외부 배치 (←/→)
- [x] 모달 페이지 가운데 정렬 (장소추가/수정/일정수정)

### 지도 마커 (7개)
- [x] pill 디자인 통일 (단일/클러스터/그룹 동일 스타일)
- [x] border-radius 0 (완전 직각)
- [x] 행간 2px 여백 + 개별 pill 컨테이너
- [x] hover → zIndexOffset 최상위 (pane 내)
- [x] 이동시간 라벨 디자인 개선 (흰 배경 + 시계 아이콘)
- [x] 클러스터 반경 확대 (아이콘 70px, 이름 140px)
- [x] START/END 뱃지 제거

### 기능 (10개)
- [x] 일정 선택 시 15분 거리(10km) 점선 원 오버레이
- [x] 내장소 마커 + 버튼 (일정 다음으로 바로 등록)
- [x] 퀵뷰 모달 드래그 이동
- [x] 퀵뷰 열린 상태에서 + 클릭 가능
- [x] 네비 드래그 → 밖으로 드롭=삭제, 내장소=이동
- [x] 카테고리 필터 드롭다운 (단일 선택)
- [x] 태그 피커 카테고리 뱃지 스타일
- [x] v2 지도검색 제거 → 슈퍼 자동채우기 통일
- [x] 네비 아이템 퀵뷰 헤더 스타일 (accent 배경 + 아이콘)
- [x] 지도 빈자리 클릭 시 일정 선택/퀵뷰 해제

### 성능 최적화 (14개)
- [x] Zustand 5개 스토어 도입 (67개 useState 이전)
- [x] PWA Service Worker (타일 30일, API 24시간 캐시)
- [x] backdrop-blur 전체 제거 (32곳 → 0)
- [x] 반투명 배경 불투명화 (50곳+ → 4곳만 유지)
- [x] transition-all → transition-colors (35곳+ → 0 남음)
- [x] 마커 drop-shadow 간소화 (12 → 7)
- [x] 마커 아이콘 이중 drop-shadow 제거
- [x] 지도 타일 opacity 0.6 → 1
- [x] dragCoord useState → useRef (드래그 중 리렌더 제거)
- [x] 드래그 중 dropTarget 변경 시에만 setState
- [x] 드래그 잔상 제거 (setDragImage 빈 이미지)
- [x] 줌 레벨 조건부 렌더링 (경로 라벨 zoom 10+)
- [x] 지도 초기 뷰 출발지(집) 제외
- [x] resize 핸들러 rAF 디바운스

### 코드 정리 (5개)
- [x] dead code 제거 ({false && ...} 2곳)
- [x] App_utf8.jsx 삭제 (-4,266줄)
- [x] CSS rounded !important → tailwind.config.js borderRadius: 0
- [x] z-index CSS 변수 레이어 시스템 정의
- [x] NOMAD 분석 + 벤치마크 비교

---

## 현재 코드 지표

```
App.jsx          11,347줄
useState 남은 것   31개 (auth, trip, itinerary, route, plan, layout)
Zustand 이전       52개 → 5개 스토어
번들 크기          1.2MB (단일 청크)
backdrop-blur     0개 ✅
transition-all    0개 ✅
반투명 bg-white/   4개 (네비 accent 위 아이콘 전용)
drop-shadow       7개 (마커 컨테이너)
stopPropagation   116개 ⚠️
z-index 종류      25개 ⚠️
JSON 깊은복사      86개 ⚠️
```

---

## 미해결 — P0 (CRITICAL)

- [ ] **경로 초기 로드 불안정** — 2초 딜레이 후 refreshRoutePreviewMap 호출하지만 불안정. geo 동기화 완료 이벤트 기반으로 변경 필요

## 미해결 — P1 (HIGH)

- [ ] **Zustand destructure 패턴** — App에서 전부 꺼내써서 리렌더 감소 없음. 하위 컴포넌트에서 직접 구독해야 효과
- [ ] **JSON.parse(JSON.stringify) 86곳** → structuredClone 또는 immer
- [ ] **z-index 25종 → CSS 변수로 실제 적용** — 현재 변수만 정의, 코드에서 아직 미사용
- [ ] **App.jsx 컴포넌트 분리** — 최소 5개 추출:
  - NavPanel.jsx / PlacesPanel.jsx / MapOverlayBar.jsx / QuickViewModal.jsx / TimelineOverlay.jsx

## 미해결 — P2 (MEDIUM)

### 코드 품질
- [ ] Zustand 나머지 31개 useState 이전
- [ ] TypeScript 도입
- [ ] 에러 추적 서비스 (Sentry)
- [ ] stopPropagation 116곳 정리
- [ ] console.error/warn 12곳 → 에러 서비스 연동

### 접근성
- [ ] ARIA 라벨 (현재 2개 → 전체 interactive 요소)
- [ ] 키보드 내비게이션 (Tab, Enter, Escape)
- [ ] 포커스 관리 (모달 열릴 때/닫힐 때)
- [ ] 스크린 리더 지원

### 반응형
- [ ] Tailwind 브레이크포인트 활용 (현재 `hidden sm:` 2곳만)
- [ ] 폰트 크기 체계화 (text-[9px]~[30px] → 표준 스케일)
- [ ] 하드코딩 px 93곳+ 정리

### 보안
- [ ] Math.random() → crypto.getRandomValues() (4곳)
- [ ] MapComponents HTML template literal → DOM API

## 미해결 — P3 (LOW)

- [ ] react-leaflet-cluster 도입
- [ ] 코드 스플리팅 (React.lazy + Suspense)
- [ ] 에러 바운더리 세분화
- [ ] 테스트 코드 작성

---

## 아키텍처

### Zustand 스토어
```
src/stores/
├── useUIStore.js      16개 (모달, 패널)
├── useToastStore.js    4개 (알림)
├── useMapStore.js     16개 (지도)
├── useDragStore.js     9개 (드래그&드롭)
└── useEditorStore.js  22개 (편집)
합계: 67개 이전 완료
```

### App.jsx 남은 useState (31개)
```
auth(4): user, authLoading, authError, pushTimeLabel
trip(4): tripRegion, tripStartDate, tripEndDate, planOptionBudget
itinerary(5): itinerary, history, pendingAutoRouteJobs, activeDay, activeItemId
plan(14): loading, currentPlanId, planList, showEntryChooser, ...
route(8): calculatingRouteId, routePreviewDays, routePreviewLoading, ...
layout(7): col1Collapsed, col2Collapsed, viewportWidth, leftPanelW, ...
기타: isEditMode, isDirty, mobileSelectedLibraryPlace, ...
```

### z-index 레이어 (CSS 변수 정의됨, 코드 적용 필요)
```
--z-map: 1              지도
--z-panel-right: 220    내장소 패널
--z-timeline: 250       타임라인 오버레이
--z-overview-widget: 270 개요 위젯
--z-panel-left: 280     네비 패널
--z-menubar: 310        상단 메뉴바
--z-toast: 320          토스트
--z-modal-backdrop: 400 모달 배경
--z-modal: 401          모달
--z-map-overlay: 500    지도 오버레이 바
--z-dropdown-backdrop: 9980 드롭다운 배경
--z-dropdown: 9990      드롭다운 메뉴
--z-quickview: 10000    퀵뷰 모달 (현재 99999로 되어있음)
```

### 성능 최적화 히스토리
```
1. backdrop-blur 32곳 제거         → GPU 블러 연산 제거
2. 반투명 배경 50곳+ 불투명화       → GPU 합성 레이어 감소
3. transition-all 35곳 → colors    → 불필요 애니메이션 제거
4. dragCoord useState → useRef     → 드래그 중 리렌더 0
5. 마커 drop-shadow 간소화/제거     → GPU 필터 부하 감소
6. 지도 타일 opacity 1.0           → GPU 합성 제거
7. PWA 캐싱 도입                   → 재방문 시 즉시 로드
8. Zustand 67개 상태 이전           → 효과 제한적 (패턴 개선 필요)
9. resize rAF 디바운스             → resize 리렌더 감소
10. dead code 4,266줄 삭제          → 번들 크기 감소
```

### NOMAD 벤치마크 비교
| 항목 | NOMAD | Anti Planer | 격차 |
|------|-------|-------------|------|
| 상태관리 | Zustand (컴포넌트별 구독) | Zustand (App에서 전부 꺼내씀) | 🔴 큼 |
| 번들 | 코드 스플리팅 | 단일 1.2MB | 🔴 큼 |
| DB | SQLite + 인덱스 | Firebase Firestore | 🟡 구조차이 |
| 캐싱 | PWA 4단계 | PWA 도입 완료 | 🟢 동등 |
| 지도 | react-leaflet-cluster | 수동 클러스터링 | 🟡 중간 |
| GPU | 최소화 | backdrop-blur 제거 완료 | 🟢 개선됨 |
| 파일 | 모듈화 | App.jsx 11,347줄 | 🔴 큼 |

---

## 참고
- `CLAUDE.md` — Claude 전용 규칙
- `README.md` — 프로젝트 규칙/구조
- `.claude/plans/staged-hatching-brooks.md` — Zustand 마이그레이션 계획
- `.claude/projects/.../memory/` — 프로젝트 메모리
