import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { ScheduleService } from './schedule/schedule.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly scheduleService: ScheduleService,
  ) {
    this.scheduleService.UpdateAndCreatedInvoices();
  }
}
