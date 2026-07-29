import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHealthCheck() {
    return {
      status: 'ok',
      message: 'MoneyLab API is running successfully!',
      timestamp: new Date().toISOString(),
    };
  }
}
