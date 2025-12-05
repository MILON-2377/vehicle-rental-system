import { Response } from "express";

interface IApiResponse<T> {
  message?: string;
  data?: T | undefined;
  errors?: any[] | undefined;
}

export default class ApiResponse<T> {
  public readonly success: boolean;
  public readonly message?: string | undefined;
  public readonly data?: T | undefined;
  public readonly errors?: any[] | undefined;

  constructor(statusCode: number, options: IApiResponse<T> = {}) {
    const { message, data, errors } = options;
    this.success = statusCode >= 200 && statusCode < 300;
    this.message = message || ApiResponse.getDefaultMessage(statusCode);
    this.data = data;
    this.errors = errors;
  }

  // Default messages for common status codes
  private static getDefaultMessage(statusCode: number): string {
    switch (statusCode) {
      case 200:
        return "Success";
      case 201:
        return "Created Successfully";
      case 204:
        return "No Content";
      case 400:
        return "Bad Request";
      case 401:
        return "Unauthorized";
      case 403:
        return "Forbidden";
      case 404:
        return "Not found";
      case 500:
        return "Internal server error";
      default:
        return "Request processed";
    }
  }

  static ok<T>(data: T, message: string) {
    return new ApiResponse<T>(200, { data, message });
  }

  static created<T>(data?: T, message = "Created successfully") {
    return new ApiResponse<T>(201, { data, message });
  }

  static noContent() {
    return new ApiResponse(204, {});
  }

  static badRequest(message = "Bad Request") {
    return new ApiResponse(400, { message });
  }

  static unauthorized(message = "Unauthorized") {
    return new ApiResponse(401, { message });
  }

  static forbidden(message = "Forbidden") {
    return new ApiResponse(403, { message });
  }

  static notFound(message = "Not found") {
    return new ApiResponse(404, { message });
  }
}
