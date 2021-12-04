import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InvoiceReportDocument = InvoiceReport & Document;

@Schema()
export class InvoiceReport {
  @Prop({ validate: { validator: Number.isInteger }, required: true })
  INVOICE_ID: number;

  @Prop({ validate: { validator: Number.isInteger }, required: true })
  VENDOR_ID: number;

  @Prop({ required: true })
  INVOICE_NUMBER: string;

  @Prop({ required: true })
  INVOICE_DATE: Date;

  @Prop({ validate: { validator: Number.isInteger }, required: true })
  INVOICE_TOTAL: number;

  @Prop({ validate: { validator: Number.isInteger }, required: true })
  PAYMENT_TOTAL: number;

  @Prop({ required: true })
  CREDIT_TOTAL: number;

  @Prop({ validate: { validator: Number.isInteger }, required: true })
  BANK_ID: number;

  @Prop({ required: true })
  INVOICE_DUE_DATE: Date;

  @Prop({})
  PAYMENT_DATE: Date;

  @Prop({ required: true })
  CURRENCY: string;
}

export const InvoiceReportSchema = SchemaFactory.createForClass(InvoiceReport);
