export class ApiResponseError extends Error {
  // http 상태 코드
  public status: number;
  public statusText: string;

  // 내부 에러 코드
  public errorCode: string | null;
  public errorMessage: string | null;

  // 에러 핸들링 방법
  public errorHandleMethod: ErrorHandleMethod;

  constructor(
    response: Response,
    errorHandleMethod: ErrorHandleMethod,
    errorCode: string | null = null,
    errorMessage: string | null = null,
  ) {
    super(`[${response.status}] ${response.statusText}`);

    this.name = "ApiResponseError";

    this.status = response.status;
    this.statusText = response.statusText;

    this.errorCode = errorCode;
    this.errorMessage = errorMessage;
    this.errorHandleMethod = errorHandleMethod;
  }
}
