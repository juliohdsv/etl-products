import { AppError } from "./app-error.js";

export class FetchBadGatewayError extends AppError {
  constructor(message: string) {
    super(message, 502);
  }
}
