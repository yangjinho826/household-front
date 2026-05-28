# 진행 상태

## 완료
- [x] 2026-05-28: API 리팩토링 PR 0 — CursorPage 봉투 통일 인프라 + transaction 마이그레이션
- [x] 2026-05-28: API 리팩토링 PR 1 — portfolio overview/item/form-options 도입 + 무한 스크롤 거래내역
- [x] 2026-05-28: API 리팩토링 PR 2 — account / category / fixed 관리 페이지 무한 스크롤
- [x] 2026-05-28: API 리팩토링 PR 3 — home / wealth / settings overview 1호출 통합
- [x] 2026-05-28: API 리팩토링 PR 4 — transaction 캘린더/폼 1호출 통합
- [x] 2026-05-28: API 리팩토링 PR 5 — household / members CursorPage 봉투 통일
- [x] 2026-05-28: API 리팩토링 PR 6 — 정리 (ApiListResponse 삭제 / 데드 코드 / household 페이징 UI / deprecated calendar endpoint)
- [x] 2026-05-28: API 리팩토링 PR 7 — codex 외부 모델 교차 리뷰 반영 (High invalidation 버그 fix + Med 4건)

## 진행 중
- [ ] `refactor/api-cursor-overview` → main 머지 (백/프 각각 PR)

## Follow-up (Low 우선순위)
- [ ] cursor page 마다 `rowNo` 가 1부터 재시작 — flatten 후 부여 OR 타입에서 제거
- [ ] enum 응답 `as AccountType[]` / `as CategoryType[]` 캐스트 — 런타임 guard 또는 typed endpoint
- [ ] `useAccountList/useCategoryList/useFixedList` 미사용 데드 코드 — 의도 확정 후 삭제 또는 명명 변경

## 막힘
