type ErrorHandleMethod = "reject" | "toast" | "component";
type MethodType = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type RetryRequestInit = Omit<NonNullable<RequestInit>, "method" | "body" | "next"> & {
  body?: BodyInit | Record<string, unknown> | null;
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
  method: MethodType;
  retryCount?: number;
};

type JsonRequestInit = Omit<NonNullable<RequestInit>, "method" | "body" | "next"> & {
  body?: BodyInit | Record<string, unknown> | null;
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
  method: MethodType;
  errorHandleMethod?: ErrorHandleMethod;
  retryCount?: number;
};

type JsonResponse<T> = {
  headers: Headers;
  ok: boolean;
  redirected: boolean;
  status: number;
  statusText: string;
  type: ResponseType;
  url: string;
  body: T;
};

declare namespace Fetch {
  type Init = JsonRequestInit;
  type Json<T> = JsonResponse<T>;
}
