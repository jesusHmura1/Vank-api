import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class InvoiceDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  readonly invoiceID: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  readonly vendorID: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly invoiceNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly invoiceDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  readonly invoiceTotal: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  readonly paymentTotal: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  readonly creditTotal: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  readonly bankID: number;

  @ApiProperty()
  @IsNotEmpty()
  readonly invoiceDueDate: Date;

  @ApiProperty()
  readonly paymentDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly currency: string;
}
