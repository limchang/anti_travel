# 반복 실수 목록

## 1. 로컬인데 원격 API URL을 먼저 타는 실수
- 증상: `apiKey is required` 같은 구버전 서버 에러가 다시 뜸
- 원인: `.env`의 배포 URL이 남아 있는데 로컬 `/api/*`보다 먼저 호출됨
- 예방:
  - 로컬/사설망에서는 항상 `/api/*`를 우선 사용
  - 저장/조회/삭제 API는 `/api/ai-key` fallback 재시도 로직 유지
  - 로컬 기능 점검 전 `server.js`가 실제 떠 있는지 먼저 확인

## 2. 서버 라우트 추가 후 로컬 서버 재시작을 빼먹는 실수
- 증상: 코드에는 endpoint가 있는데 실제 호출하면 404 또는 옛 응답이 옴
- 원인: `server.js` 프로세스가 이전 코드로 계속 떠 있음
- 예방:
  - `api/*` 또는 `server.js` 수정 후 로컬 `node server.js` 재기동 확인
  - 확인 포트: `3001`

## 3. 모듈 스코프 유틸을 컴포넌트 내부에 두는 실수
- 증상: `timeToMinutes is not defined`
- 원인: 파일 상단 헬퍼가 `App` 내부 함수를 참조할 수 없음
- 예방:
  - 공통 계산 유틸은 모듈 스코프에 둔다
  - 특히 페리/시간/정규화 헬퍼는 컴포넌트 바깥 유지

## 4. 도구 호출과 JSON 응답 강제를 같이 써서 깨지는 실수
- 증상: `Tool use with a response mime type: 'application/json' is unsupported`
- 원인: Gemini `google_search`/`url_context` 도구와 `responseMimeType: application/json` 동시 사용
- 예방:
  - 도구 사용 시 JSON mime 강제 금지
  - 프롬프트로 JSON만 요구하고 `extractJsonPayload`로 후처리

## 5. 모달 취소 시 외부 상태를 초기화하지 않는 실수
- 증상: 새 장소 등록을 취소해도 이전 입력 초안이 다시 남음
- 원인: 모달 닫기에서 `isOpen`만 false 처리
- 예방:
  - `취소`, 바깥 클릭, 저장 완료 모두 같은 reset 헬퍼 사용

## 6. 토스트 위치를 transform 중심으로 잡아 첫 프레임이 흔들리는 실수
- 증상: 토스트가 오른쪽에서 시작해 가운데로 오는 것처럼 보임
- 원인: `left-1/2 -translate-x-1/2` + 초기 렌더 타이밍
- 예방:
  - 토스트 래퍼는 `fixed inset-x-0 flex justify-center` 구조 사용

## 7. 기능 삭제 요청 때 UI만 숨기고 상태/effect를 남기는 실수
- 증상: 업데이트 노트 같은 기능이 다시 뜨거나 코드에 유령 참조가 남음
- 원인: 렌더만 지우고 state/effect/constants를 유지
- 예방:
  - 삭제 요청이면 상태, effect, 상수, 트리거까지 같이 제거

## 8. 일정탭 기준 UI를 공통 폼에서 놓치는 실수
- 증상: `일정탭 실제 일정`과 `내 장소/수정/추가`의 행 구조나 확장 동작이 달라져 사용자가 같은 UI를 다른 화면처럼 느끼게 됨
- 원인: 공통 컴포넌트를 수정하면서도 기준 화면을 `일정탭`이 아니라 개별 폼 상태에 맞춰 따로 바꿈
- 예방:
  - 공통 UI 수정 시 기준 화면은 항상 `일정탭 실제 일정 카드`
  - `내 장소`, `수정`, `추가`는 일정탭의 행 순서/간격/확장 흐름을 따라간다
  - 특히 `영업정보`는 일정탭 기준으로 기본 노출/클릭 확장 동작을 먼저 맞춘 뒤 개별 예외를 추가한다

## 9. AI 키 저장/확인 "Failed to fetch" 반복 오류
- 증상: `AI 키 상태 확인 실패: Failed to fetch` 또는 `AI 키 저장 실패: HTTP 405`
- 원인 A (로컬 환경): `192.168.x.x`에서 접속 시 `/api/ai-key` relative 경로 → Vite proxy → `localhost:3001` 포워딩. 하지만 `server.js`의 Firebase Admin 인증 키가 placeholder(`.env`에 미설정)이면 verifyBearerToken 실패
- 원인 B (배포 환경): Cloud Run `functions/index.js`의 `aiKey` 함수가 **구버전**으로 배포된 경우— `POST { groqApiKey }` 요청을 `apiKey is required`(400)로 거부하거나 CORS 미설정으로 "Failed to fetch"
- 원인 C (CORS): `functions/index.js`의 `setCors`가 요청 origin을 허용목록에서 찾지 못하면 `Access-Control-Allow-Origin` 헤더 누락 → 브라우저가 CORS 에러로 막음
- 예방/체크리스트:
  1. 로컬에서 `server.js`가 떠 있는지 확인 (`node server.js`, 포트 3001)
  2. `.env`에 실제 Firebase Admin 키 설정 여부 확인 (`FIREBASE_ADMIN_CLIENT_EMAIL`, `FIREBASE_ADMIN_PRIVATE_KEY`)
  3. `functions/index.js`가 `api/ai-key.js`와 동기화됐는지 확인 후 `firebase deploy --only functions` 재실행
  4. `getCors`의 허용 origin 목록에 실제 접속 도메인 포함 여부 확인

## 10. React 컴포넌트 내부 IIFE에서 Hook 사용하는 실수
- 증상: `Rendered more hooks than during the previous render` → 앱 전체 크래시
- 원인: `{condition && (() => { useState(); useEffect(); return <JSX/>; })()} ` 패턴 — React Hook은 IIFE나 일반 함수 안에서 조건부 호출 불가
- 예방:
  - Hook을 쓰는 모달/컴포넌트는 반드시 **독립 컴포넌트 함수**로 분리
  - 올바른 패턴: `{condition && <MyModal onClose={...} />}` + `const MyModal = () => { useState()... }`

## 11. 개요 셀만 따로 곡률/간격 체계를 쓰는 실수
- 증상: 개요 셀 모서리 곡률이 일정 카드/이동칩과 따로 놀고, 개요 아래 첫 일정 간격이 일반 `이동칩 ↔ 일정카드` 간격보다 커져 화면이 붕 뜸
- 원인: 특수 영역이라는 이유로 개요 셀에 별도 radius, spacer, margin 값을 임의로 넣음
- 예방:
  - 개요 셀 외곽 곡률은 일정 카드 계열 기본값과 같은 `rounded-[24px]`를 우선 사용
  - 개요 내부 버튼/확장 패널도 카드 시스템 곡률에 맞춰 같은 계열 값으로 정리
  - 개요 아래 첫 실제 일정 간격은 일반 `이동칩 ↔ 일정카드` 간격과 같게 맞춘다
  - 레이아웃 수정 후 반드시 `첫 일정`, `중간 이동칩`, `개요 셀` 3군데를 한 화면에서 비교 확인한다
