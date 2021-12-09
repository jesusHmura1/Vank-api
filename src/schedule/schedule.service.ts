import { Injectable } from '@nestjs/common';
import * as schedule from 'node-schedule';
import { InvoicesService } from 'src/invoices/invoices.service';

@Injectable()
export class ScheduleService {
  constructor(private readonly invoceService: InvoicesService) {}

  //update and created new data at 12:00 AM
  public UpdateAndCreatedInvoices() {
    const rule = new schedule.RecurrenceRule();
    rule.dayOfWeek = [0, new schedule.Range(1, 6)];
    rule.hour = 15;
    rule.minute = 14;
    schedule.scheduleJob(rule, () => {
      this.invoceService.generateInvoicesFromCSV();
    });
  }
}
