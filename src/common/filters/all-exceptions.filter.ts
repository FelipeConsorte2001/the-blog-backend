import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllexceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    const isHttpException = exception instanceof HttpException;

    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const defaultMessage = 'Internal Serve Error';
    const defaultError = 'Internal Serve Error';

    let messages: string[] = [defaultMessage];
    let erroName = defaultError;

    if (isHttpException) {
      const responseData = exception.getResponse();

      if (typeof responseData === 'string') {
        messages = [responseData];
      }

      if (typeof responseData === 'object' && responseData !== null) {
        const { message, error } = responseData as Record<string, any>;

        if (Array.isArray(message)) {
          messages = message as string[];
        } else if (typeof message === 'string') messages = [message];

        if (typeof error === 'string') erroName = error;
      }
    }

    return response.status(status).json({
      message: messages,
      erro: erroName,
      statusCode: status,
    });
  }
}
