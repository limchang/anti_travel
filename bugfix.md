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

## 2026-03-12

### Bug
- 사용자가 자동 경로 버튼을 다시 눌러도 직전 실패 캐시 때문에 재시도가 되지 않아 계속 에러처럼 보였음.
- 이동칩과 시간 셀 세로 밀도가 일정 카드 정보 셀보다 과하게 커서 카드 상단이 불균형해 보였음.

### Cause
- 수동 버튼이 자동 계산과 같은 실패 쿨다운 조건을 그대로 타고 있었음.
- 이동칩이 너무 pill 형태로 남아 있었고, 시간 셀도 패딩과 숫자 크기가 과했음.

### Action
- 자동 경로 버튼은 항상 `forceRefresh: true`로 호출되도록 유지해 수동 재시도가 실패 캐시에 막히지 않게 정리.
- 이동칩을 `rounded-[18px]` 화이트 카드 톤으로 맞춰 일정 카드와 곡률/폭감 차이를 줄임.
- 시간 셀 상하 카드와 중앙 duration 버튼의 높이, 패딩, 타이포를 줄여 오른쪽 정보 셀 높이에 맞춤.

### Result
- 수동 자동 경로 버튼은 직전 실패와 무관하게 즉시 다시 계산을 시도함.
- 이동칩과 시간 셀 비율이 일정 카드 정보 셀과 더 비슷한 밀도로 정리됨.

## 2026-03-12

### Bug
- 로컬 최신 코드에서도 이동칩이 계속 `주소확인`으로 남는 구간이 있었음.

### Cause
- 경로 계산 주소 판정이 `receipt.address`와 일부 문자열 필드만 보고 있었고, 기존 데이터에 남아 있던 `geo.address`, `geoStart.address`, `geoEnd.address`는 무시하고 있었음.
- 그래서 좌표/주소가 DB에 저장돼 있어도 라벨 단계에서 주소 없음으로 판단하는 케이스가 남아 있었음.

### Action
- `getRouteAddress`가 일반 일정은 `geo.address`, 페리는 `geoStart.address`, `geoEnd.address`까지 fallback 하도록 수정.
- 이동칩 라벨은 `targetItem.distance`가 아직 반영되기 전이라도 `routeCache.distance`가 있으면 바로 표시하도록 보강.

### Result
- 예전 문서 구조나 좌표 우선 저장 상태에서도 이동칩이 저장된 주소/좌표를 사용해 자동 경로 계산과 표시를 이어감.
