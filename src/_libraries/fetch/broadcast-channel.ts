/**
 * 다중 탭 인증 동기화 채널.
 *
 * SSR 가드 + BroadcastChannel 미지원 환경 (구형 모바일 웹뷰 등) 폴백 없이 no-op.
 * 한 탭에서 refresh 가 성공/실패하면 다른 탭에도 신호 → 같은 origin 의 모든 탭이 동일 access 토큰 공유.
 */
const CHANNEL_NAME = "personal-auth";

export type AuthChannelMessage =
  | { type: "REFRESH_STARTED" }
  | { type: "TOKEN_UPDATED"; accessToken: string }
  | { type: "REFRESH_FAILED" };

let channel: BroadcastChannel | null = null;

function getChannel(): BroadcastChannel | null {
  if (typeof window === "undefined") return null;
  if (typeof BroadcastChannel === "undefined") return null;
  if (!channel) channel = new BroadcastChannel(CHANNEL_NAME);
  return channel;
}

export function postAuthMessage(message: AuthChannelMessage): void {
  getChannel()?.postMessage(message);
}

export function listenAuthMessages(
  handler: (msg: AuthChannelMessage) => void,
): () => void {
  const ch = getChannel();
  if (!ch) return () => {};
  const listener = (e: MessageEvent<AuthChannelMessage>) => handler(e.data);
  ch.addEventListener("message", listener);
  return () => ch.removeEventListener("message", listener);
}
