# 활성 컨텍스트

## Goal

**가계부 × 자산 통합 — 월별 자산변동 추적**.
"매월 내 자산이 어떻게 변하는지 한눈에" (총자산 기준, 부채/순자산 안 함).

현재 사이클: **R5a — 자산성격(asset_class) 배분 + 부동산·연금(ManualAsset) + 월별 배분추이**.

## Status

R1~R4 전부 dev 커밋 완료(front b5a083c~78f66d6 / back a3c9afb). **dev→main 머지는 아직 안 함**.

**R5a 착수** — codex(gpt-5.5) 교차검증 + Plan agent 로 설계 확정. 상세 계획·실행가이드는 **`R5a-plan.md`** (이 디렉토리).
- ✅ **R5a-1 (asset_class + 현재 배분 파이) 완료** — 백 8파일 + 프론트 9파일 + 마이그레이션 A(`b8e4d1a09c37`). **아직 미커밋.**
  - 검증: 마이그레이션 가역성 OK · 프론트 typecheck 통과 · 9001 QA `wealth/overview.allocation` 정상(CASH 75.46%+STOCK 24.54%=totalBalance).
- ⬜ R5a-2 (ManualAsset 부동산·연금 도메인) — 다음
- ⬜ R5a-3 (스냅샷 통합 + 월별 배분추이)

## Context

- **2축 분리가 핵심**: 기존 `market`(거래소)은 그대로, 신규 `asset_class`(자산성격: STOCK/BOND/COMMODITY/CASH/REAL_ESTATE/PENSION/OTHER) 추가. 금을 KRX에 욱여넣던 문제 해소.
- **가격 갱신은 market 축만** 사용 → asset_class 바꿔도 야후 갱신 안 깨짐(금ETF는 market 유지+asset_class만 COMMODITY).
- 부동산/연금 = **ManualAsset 신규 도메인**(전용 계좌 roll-up). PortfolioItem 확장 X.
- codex 경고 함정(R5a-2/3 필수 반영): carry-forward/as-of 평가, historical truth, double counting 방지 → `R5a-plan.md` 참조.
- **로컬 DB는 항상 `alembic upgrade head`** 선행 (드리프트 시 배분/거래 조용히 500). 현재 head = `b8e4d1a09c37`.
- 프론트 실제 스택 = Mantine + query-key-factory + tabler + 언더스코어 디렉토리 (personal-frontend 룰은 stale — 글로벌 메모리 `frontend-stack-reality` 참조).
- 환경/계정/인증/household id 등 = `R5a-plan.md` "실행 가이드".

## Next Step

1. **R5a-1 커밋** — back + front 각각 한글 conventional. (DB 마이그레이션은 코드, 커밋 포함)
2. **R5a-2 착수** — ManualAsset 도메인 (`R5a-plan.md` R5a-2 섹션 그대로).
3. R5a-3 → 그 후 dev→main 머지 검토.
