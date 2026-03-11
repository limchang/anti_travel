# Smart Fill Feedback Log

AI 스마트 붙여넣기 결과를 사용자가 다시 수정한 사례를 누적하는 기록 파일입니다.

목적:
- 반복 오차 패턴을 빠르게 파악
- 다음 프롬프트/정규화/후처리 수정의 근거 확보
- 다른 AI 모델이 이어받아도 같은 실수를 덜 하게 만들기

기록 규칙:
- 사용자가 AI 자동 채우기 후 직접 고친 내용만 적습니다.
- “원본 클립보드 전체”를 길게 복붙하지 말고, 오차와 관련된 최소 근거만 적습니다.
- `필드`, `AI 결과`, `사용자 교정`, `다음 규칙` 네 가지를 반드시 남깁니다.
- 한 사례에 여러 오차가 있으면 필드 단위로 분리해서 씁니다.

---

## 누적 규칙 요약

- 휴무 요일은 UI에 raw 토큰(`thu`, `목요일`, `thursday`)으로 남기지 말고 내부 요일값(`mon`~`sun`)으로 정규화한 뒤, 표시 단계에서는 한글 라벨(`월`~`일`)로만 보여줍니다.
- 메뉴는 설명문보다 `메뉴명 + 가격` 추출을 우선합니다.
- 확실하지 않은 필드는 채우기보다 비워 두는 쪽을 우선합니다.

## 프롬프트 적용 이력

### 2026-03-11 · Claude Sonnet 4.6 반영
- `api/grok-analyze.js` 시스템 프롬프트에 아래 규칙 추가:
  - `closedDays` 출력값은 `mon~sun` 3글자 코드만 허용 (한글/영문 풀네임 금지)
  - 메뉴 추출 시 설명문/인트로 제외, `메뉴명 + 정수 가격` 쌍만 포함
  - 불확실 필드는 빈 문자열/빈 배열로 처리 (추측 금지)
- `normalizeClosedDay()` 후처리 함수 추가: AI가 잘못 출력한 경우에도 서버에서 내부 코드로 강제 변환
- 적용 대상: `api/grok-analyze.js` (Firebase Functions `groqAnalyze` 및 로컬 서버 공통)

---

## 기록 템플릿

### [YYYY-MM-DD] 장소명 또는 케이스명
- 입력 유형: `text` | `image` | `mixed`
- 스마트 채우기 모드: `all` | `business` | `menus`
- 필드:
  - AI 결과:
  - 사용자 교정:
  - 다음 규칙:
- 메모:

---

## 사례 로그

### [2026-03-11] 휴무 요일 raw 토큰 노출
- 입력 유형: `text` 또는 `mixed`
- 스마트 채우기 모드: `all`
- 필드: `business.closedDays`
  - AI 결과: `thu` 같은 영어 약어가 그대로 저장되어 요약 문구에 `휴무 thu`로 노출됨
  - 사용자 교정: UI에서는 `목 휴무`처럼 한글 요일 기준으로 보이길 원함
  - 다음 규칙: `closedDays`는 수신 즉시 영어 약어/한글 요일/영문 풀네임을 내부 값(`mon`~`sun`)으로 정규화하고, 표시 시에는 한글 라벨만 사용

---

## 기술 오류 및 대응 지침

### AI 키 상태 확인 실패 (Failed to fetch) / HTTP 405
- **증상**: "AI 키 상태 확인 실패: Failed to fetch" 토스트 알림 발생
- **원인**:
  1. **CORS 미허용**: 접속한 도메인(예: GitHub Pages, Vercel 등)이 Firebase Functions의 허용 목록(`ALLOWED_ORIGINS`)에 누락되어 브라우저가 요청을 차단함.
  2. **구버전 서버 코드**: 배포된 Cloud Run 함수가 이전 API 규격(예: 단일 `apiKey` 필드만 기대)을 사용 중이라 새 규격의 요청을 400/405/500 에러로 거부함.
  3. **인증 환경 미비**: 로컬 서버(`server.js`) 실행 시 `.env`에 Firebase Admin 서비스 계정 정보가 누락되어 `verifyBearerToken` 과정에서 실패함.
- **대응/체크리스트**:
  - `functions/index.js`의 `ALLOWED_ORIGINS`에 현재 배포된 URL이 포함되어 있는지 확인.
  - API 규격 변경 시 `firebase deploy --only functions` 명령으로 서버 함수를 즉시 업데이트.
  - 로컬 테스트 전 `server.js` 구동 여부와 `.env` 내 `FIREBASE_ADMIN_PRIVATE_KEY` 등을 반드시 확인.
  - "Failed to fetch"가 뜨면 브라우저 개발자 도구(F12)의 Network 탭에서 실제 OPTIONS/POST 요청의 응답 상태와 헤더를 점검.

