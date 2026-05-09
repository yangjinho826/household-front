declare namespace NodeJS {
  interface ProcessEnv {
    BACKEND_URL?: string;
    NEXT_PUBLIC_BACKEND_URL?: string;
    AUTH_SECRET?: string;
  }
}
