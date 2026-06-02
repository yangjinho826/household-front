# 모음 — 브랜드 로고 에셋

가계부 × 자산관리 앱 **모음**(=모으다)의 로고 풀세트. 컨셉: *여러 자산이 한곳으로 모인다* — 겹치는 세 원이 중앙 핵으로 수렴.

## 컬러

| 역할 | HEX |
|---|---|
| Primary (세이지) | `#7C9473` |
| Dark (수렴 핵) | `#566B4E` |
| Light | `#A6B89A` |
| Gold accent (자산) | `#D4A95F` |
| Cream BG | `#FAF6EF` |

## 파일

| 파일 | 용도 |
|---|---|
| `mark.svg` | 마스터 마크 (벡터, 무한 확대) |
| `mark.png` / `mark-1024.png` | 마크 래스터 (512 / 1024) |
| `icon-192.png` `icon-512.png` | PWA manifest 아이콘 |
| `apple-touch-icon.png` | iOS 홈화면 (180px) |
| `favicon-32.png` | 레거시 PNG 파비콘 |
| `wordmark-light.svg/.png` | 가로 워드마크 (밝은 배경용) |
| `wordmark-dark.svg/.png` | 가로 워드마크 (어두운 배경용, 투명) |
| `candidates/` | 탈락 시안 A·B·C 보관 |

> 워드마크 PNG는 폰트 fallback(고딕)으로 렌더됨. 실제 워드마크는 **Noto Serif KR 700**(앱에서 로드)으로 표시된다.

## 적용 위치 (household-front)

- `public/icon.svg` ← `mark.svg` (metadata 메인 favicon)
- `public/icon-192.png` `icon-512.png` `apple-touch-icon.png` `favicon-32.png`
- `src/app/[locale]/layout.tsx` — `metadata.icons`
- `public/manifest.json` — PWA theme/background

## 재생성

```bash
# SVG → PNG (sharp-cli, 의존성 추가 없이 dlx)
pnpm dlx sharp-cli -i mark.svg -o icon-512.png resize 512 512
```
