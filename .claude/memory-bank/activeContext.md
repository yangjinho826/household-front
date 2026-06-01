# 활성 컨텍스트

## Goal

**가계부 × 자산 통합 — 월별 자산변동 추적**.
"매월 내 자산이 어떻게 변하는지 한눈에" (총자산 기준, 부채/순자산 안 함).

## Status

R1(자동박제+전월대비) · R2(추이 drill-down·계좌 리포트·차트 직관화) · 실현손익 **전부 dev 브랜치 커밋 완료**.

이번 세션: **R2 화면 QA 통과** + 설정파일 정리 커밋.
- R2 QA 결과(전부 정상 확인):
  - 총자산 추이 차트 — 라인/dot/Tooltip/기간라벨(+150%)/전월대비
  - 차트 월 클릭 → drill-down 패널(계좌별 분해 + 수입/지출) ← A버그(recharts v3 activeIndex) 수정 정상
  - 계좌별 리포트 — 현재잔액/월별 수입지출 차트/월별 내역+그달 잔액
- 설정 커밋: front `dadb918` / back `a3c9afb` (CLAUDE.md·.gitignore(.gstack/,시드)·settings)

## Context

- **이 머신엔 시드 스냅샷 없었음** (account_snapshots 0 row). QA 위해 채움:
  - `_build_and_save_snapshot`로 2026-04-01 부트스트랩(현재잔액 105,237,837원)
    → `scripts/seed_snapshots_history.sql` 로 2025-10~2026-05 역산(8개월 톱니 우상향)
  - seed SQL + 부트스트랩 스크립트는 gitignore (로컬 전용). DB 데이터는 남겨둠.
- **home/overview 400 = 로그인 직후 인증 타이밍** (데이터 무관, 재시도 200). 버그 아님. 6월 거래 0건도 정상(수입/지출 0 표시).
- 환경: 백 9000(`uv run uvicorn app.main:app --reload --port 9000`), 프론트 3000, DB docker `household-postgres`.
  계정 yangjinho826@naver.com. **access token 1시간** — QA 중 자주 만료(재로그인 필요).
- recharts **3.8.1 (v3)** — onClick activeIndex 정합. browse 헤드리스 합성클릭은 recharts onClick 못 태움(실클릭은 OK, 헤드리스 QA 한계).

## Next Step

1. **dev → main 머지** — R1~R3 전부 main 미반영. front/back 각 6커밋. PR 또는 /ship.
2. **R4** — 계좌→종목 drill-down + 종목 평가액 추이 차트 (portfolio_value_history 데이터 있음, 미구현).
3. **Follow-up** — rowNo cursor 재시작 / enum 캐스트 런타임 guard / 미사용 데드코드(useAccountList 등).
