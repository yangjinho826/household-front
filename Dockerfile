# 빌드 명령어(전역 스코프)
ARG BUILD_COMMAND

# 베이스 이미지
FROM node:20-alpine AS base
# libc6-compat 설치 이유
# https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine
RUN apk add --no-cache libc6-compat
# pnpm 활성화 (package.json 의 packageManager 필드 사용)
RUN corepack enable

# 의존성 설치
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# 필요할 때만 소스 빌드
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js 익명 수집 끄기
ENV NEXT_TELEMETRY_DISABLED=1

# 빌드 명령어(전역 스코프 => 하위 빌드 스테이지 사용)
ARG BUILD_COMMAND

# 빌드 실행
RUN $BUILD_COMMAND

# 프로덕션 이미지, 모든 파일을 복사하고 실행
FROM base AS runner
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# 프리렌더 캐시에 대한 올바른 권한 설정
RUN mkdir .next
RUN chown nextjs:nodejs .next

# 이미지 크기 줄이기
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV HOSTNAME="0.0.0.0"

# server.js는 standalone 출력에서 next build에 의해 생성
CMD ["node", "server.js"]
