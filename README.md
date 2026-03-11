# Anti Planer — 프로젝트 컨텍스트

> **모든 AI 어시스턴트 공통 참고 파일입니다.**  
> `claude.md` / `gemini.md` 는 이 파일을 기준으로 동기화됩니다.

---

## 프로젝트 개요
- **파일**: `src/App.jsx` (단일 파일 React 앱, ~1500줄)
- **DB**: Firebase Firestore (`src/firebase.js`) — `itinerary/main` 문서에 저장
- **스타일**: TailwindCSS
- **실행**: `npm run dev`

## 협업 규칙 (중요)
- 작업 시작 전 반드시 `README.md`를 먼저 확인하고 현재 규칙을 준수할 것.
- 같은 디렉터리에 `PLAN.md`가 있으면 절대 건너뛰지 말고, 작업 전에 반드시 먼저 읽고 현재 진행 상태와 규칙을 참고할 것.
- UI는 **정렬/여백 일관성**을 최우선으로 유지할 것.
- 특히 이동칩/버퍼칩/일정셀 간 세로축 중심 정렬이 항상 맞아야 하며, 임의 오프셋(`ml-*`, 임시 spacer) 추가를 지양할 것.
- 텍스트 줄바꿈으로 레이아웃이 깨지지 않도록 `whitespace-nowrap`, `truncate`, `min-w-0` 등을 적극적으로 사용할 것.
- **AI 자동입력 학습 루프**: AI 자동 채우기 후 사용자가 내용을 수정하면, '원본 - AI 결과 - 사용자의 수정본' 세 가지를 교차 검증하여 Firestore에 자동으로 기록합니다. 이 데이터는 '자동입력 학습 지침' 메뉴의 '교정 사례' 탭에서 확인할 수 있으며, 이를 바탕으로 AI 지침을 지속적으로 정교화할 수 있습니다.
- **Git 기반 버전 관리**: 하단 네비게이션 바에서 현재 버전(`APP_VERSION`)과 마지막 `git push`로부터 경과된 시간을 확인할 수 있습니다.
- **GitHub Push 상시 수행**: 모든 유의미한 코드 수정, UI 개편, 버그 수정 완료 후에는 반드시 `git push`를 실행하여 원격 저장소와 배포 상태를 최신으로 유지할 것. (App 헤더의 푸시 시간 카운터 업데이트 포함)

---

## ⚠️ 절대 하지 말 것

### 1. 세로 구분선 추가 금지
이동 칩(travel chip) 내부 km 표시 앞에 `border-l` 같은 세로선을 절대 추가하지 말 것.
```jsx
// ❌ 금지
<div className="border-l border-slate-100 pl-2 flex items-center ...">

// ✅ 올바름
<div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold px-1.5">
```

### 2. 타임라인 세로 축 선 추가 금지
제거된 요소입니다. 다시 추가하지 말 것.
```jsx
// ❌ 금지
<div className="absolute top-0 bottom-0 w-[2px] bg-slate-100 -z-10 left-[71px]"></div>
```

### 3. 일자별 구분 셀(헤더) 추가 금지
- 일정은 하나의 통합 카드 안에 연속 표시
- Day 1 / Day 2 같은 구분 헤더 셀 추가 금지

### 4. 자동경로 버튼 분리 금지
- 자동경로(✦) 버튼은 이동 칩 **내부**에 위치해야 함
- 별도 분리하거나 외부로 꺼내지 말 것

### 5. git stash 주의
`git stash` 사용 시 이전 변경사항이 유실될 수 있음. 반드시 현재 파일 상태 확인 후 최소 범위 편집.

### 6. 파일 전체 교체 금지
코드 수정 시 파일 전체를 교체하지 말고, `multi_replace_file_content` 또는 `replace_file_content` 로 최소 범위 편집.

---

## 현재 UI 구조

### 일정 목록 (단일 통합 카드)
- 모든 일정이 하나의 `bg-white rounded-3xl` 카드 안에 연속적으로 표시
- 일차 간 구분은 **이동 칩(travel chip)** 으로만 구분

### 컨트롤 타워 (좌측)
- **숙소(lodge)**: 체크인 라벨 + 체크아웃 시간 (다음날 첫 일정 시간 - 이동시간)
- **일반**: 시간 조절 버튼 + 소요시간 조절

### 이동 칩 구조
```
[- 시간 +] [MapIcon km] [✦ 자동경로]
```

### 좌측 사이드바 — 장소 라이브러리
- "내 장소" 섹션: 장소를 저장해두고 타임라인으로 드래그해서 추가
- 타임라인 아이템을 라이브러리로 드래그하면 일정에서 제거 후 저장
- 카드 레이아웃: 타임라인 카드와 동일한 포맷 (숙박·페리는 타입별 스타일 구분)

---

## 데이터 구조
```js
{
  days: [{ day: N, plan: [...items] }],
  places: [{ id, name, types, address, price, memo }]  // 장소 라이브러리
}
```

## 데이터 흐름
1. 앱 로드 → Firestore `getDoc('itinerary/main')` → 없으면 초기 데이터
2. 상태 변경 → 1초 debounce → Firestore `setDoc('itinerary/main', itinerary)`

## 경로 계산 검토(카카오 이중검수)
- 기본 정책: `카카오 경로(API)` 우선, 실패 시 `OSRM` 대체, 최종 하한 검수 적용.
- 서버 함수: `api/route-verify.js`
- 필수 환경변수(배포/로컬):
  - `KAKAO_REST_API_KEY`
- 검토 방식:
  - 카카오 `RECOMMEND` + `TIME` 두 결과를 비교해 duration 과소값을 방지
  - 직선거리/도로거리 기반 최소 소요시간 하한 검수 후 최종 반영

## 스크롤 네비게이션
- 각 일차 첫 번째 아이템: `id="day-marker-N"` 부여
- `IntersectionObserver`로 스크롤 감지 → `activeDay` 자동 업데이트
- 네비 클릭 → `scrollIntoView({ behavior: 'smooth', block: 'start' })`
