import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (httpStatus === HttpStatus.INTERNAL_SERVER_ERROR) {
      console.error('--- Unhandled Exception ---');
      console.error(exception);
      console.error('---------------------------');
    } else {
      console.warn(`[HTTP ${httpStatus}] ${httpAdapter.getRequestUrl(ctx.getRequest())}`);
    }



    const message = 
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: 'Internal Server Error', statusCode: 500 };

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      ...(typeof message === 'object' ? message : { message }),
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
