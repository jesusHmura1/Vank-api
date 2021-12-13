import { ApiPropertyOptional } from '@nestjs/swagger';

export class InvoiceReportDTO {
  @ApiPropertyOptional()
  readonly invoiceID: number;

  @ApiPropertyOptional()
  readonly startDate: Date;

  @ApiPropertyOptional()
  readonly endDate: Date;

  @ApiPropertyOptional()
  readonly currency: string;
}
