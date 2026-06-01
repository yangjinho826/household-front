# 진행 상태

## 완료
- [x] 2026-05-31: 가계부×자산 통합 MVP 기획 — 코드현황+한/해외 벤치마킹+codex 교차검토. 부채/순자산·lot 제외, 총자산 기준으로 축소
- [x] 2026-05-31: R1 구현 — 매월 자동 박제 cron(back) + 전월대비 증감 표시(front). QA 통과, dev 커밋
- [x] 2026-05-31: R3 실현손익 — 매도 realized_pnl 박제 + 종목 상세 매매손익 탭. dev 커밋
- [x] 2026-06-01: R2 구현+QA 통과 — 추이 drill-down·계좌별 리포트·추이 차트 직관화. 시드(4월 부트스트랩 + 역산 8개월) 채워 화면 검증. dev 커밋
- [x] 2026-06-01: 설정파일 정리 커밋 — CLAUDE.md·.gitignore(.gstack/,시드)·settings (front dadb918 / back a3c9afb)
- [x] 2026-05-28: API 리팩토링 PR 0 — CursorPage 봉투 통일 인프라 + transaction 마이그레이션
- [x] 2026-05-28: API 리팩토링 PR 1 — portfolio overview/item/form-options 도입 + 무한 스크롤 거래내역
- [x] 2026-05-28: API 리팩토링 PR 2 — account / category / fixed 관리 페이지 무한 스크롤
- [x] 2026-05-28: API 리팩토링 PR 3 — home / wealth / settings overview 1호출 통합
- [x] 2026-05-28: API 리팩토링 PR 4 — transaction 캘린더/폼 1호출 통합
- [x] 2026-05-28: API 리팩토링 PR 5 — household / members CursorPage 봉투 통일
- [x] 2026-05-28: API 리팩토링 PR 6 — 정리 (ApiListResponse 삭제 / 데드 코드 / household 페이징 UI / deprecated calendar endpoint)
- [x] 2026-05-28: API 리팩토링 PR 7 — codex 외부 모델 교차 리뷰 반영 (High invalidation 버그 fix + Med 4건)

## 진행 중
- [ ] dev → main 머지 (R1~R3 전부 main 미반영, front/back 각 6커밋)

## 가계부×자산 통합 — MVP 로드맵 (R1 완료, R2~ 대기)

목적: "매월 자산이 어떻게 변하는지 한눈에"(총자산 기준). 부채/순자산·lot 안 함.
원칙(codex): 데이터모델→적재→표현, immutable 스냅샷, 이중계상 금지.

- [x] R1: 자동 박제(월1일 cron) + 전월대비 증감 ← 완료(dev 커밋)
- [x] R2: 추이 drill-down + 계좌별 월간 리포트 + 추이 차트 직관화 ← 완료(dev 커밋, QA 통과)
- [x] R3: 실현손익 박제 + 종목 매매손익 탭 ← 완료(dev 커밋). 청산종목 전용 화면은 R4+로
- [ ] R4: 계좌→종목 drill-down + 종목 평가액 추이 차트 (데이터 이미 있음)
- [ ] R5+: asset_class 배분 / goal / TWR / 부동산·연금 / 디자인 토큰화

### R2+ 착수 전 확정할 결정
- 카드 사용일 vs 결제일 / 잔액조정(RECONCILIATION) tx / 투자계좌 예수금 모델 / 배당·이자 tx_type

## Follow-up (Low 우선순위)
- [ ] cursor page 마다 `rowNo` 가 1부터 재시작 — flatten 후 부여 OR 타입에서 제거
- [ ] enum 응답 `as AccountType[]` / `as CategoryType[]` 캐스트 — 런타임 guard 또는 typed endpoint
- [ ] `useAccountList/useCategoryList/useFixedList` 미사용 데드 코드 — 의도 확정 후 삭제 또는 명명 변경

## 막힘
