# Bug Fix Log

## 2026-03-12

### Bug
- 일정 카드 사이 이동거리 계산이 `주소확인`으로 반복 표시됨.
- 주소와 저장 좌표가 있어도 자동 경로 계산을 누르면 카카오 경로 대신 fallback 경로로 빠지면서 실패하거나 `주소확인`으로 보였음.

### Cause
- 자동 경로 계산이 `api/route-verify` 카카오 검수 호출 실패 시 OSRM/Nominatim fallback으로 내려가고 있었음.
- 정적 배포 환경에서 `/api/route-verify` 고정 호출이 불안정했고, GitHub Pages에서는 이 경로가 보장되지 않았음.
- 서버에 이미 좌표를 넘길 수 있는데도 주소 재지오코딩을 다시 하면서 실패가 늘어났음.

### Action
- 자동 경로 계산은 카카오 `route-verify`만 사용하도록 정리하고 OSRM fallback을 제거.
- 클라이언트가 저장 중인 `geo`, `geoStart`, `geoEnd` 좌표를 `api/route-verify`로 직접 전달하도록 수정.
- `api/route-verify.js`는 전달받은 좌표가 있으면 카카오 로컬 지오코딩을 생략하고 바로 카카오 모빌리티 길찾기를 호출하도록 수정.
- 배포 환경별 엔드포인트 후보를 순차 시도하도록 정리해 `/api/route-verify` 고정 의존을 완화.
- Firebase Functions에 `routeVerify` 공개 함수를 추가하고, 앱에서 `https://asia-northeast3-anti-planer.cloudfunctions.net/routeVerify`도 직접 호출 후보에 포함.

### Result
- 자동 경로 계산 경로가 카카오 API 기준으로 단일화됨.
- 저장 좌표가 있는 일정은 서버 재지오코딩 없이 바로 카카오 길찾기 계산으로 들어감.
- 카카오 경로 호출 자체가 실패하면 `카카오경로실패`로 드러나고, 주소 문제와 분리해서 볼 수 있게 됨.
