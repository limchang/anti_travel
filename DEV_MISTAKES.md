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
