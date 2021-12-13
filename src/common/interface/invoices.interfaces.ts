export interface InvoicesI {
  INVOICE_ID: number;
  VENDOR_ID: number;
  INVOICE_NUMBER: string;
  INVOICE_DATE: Date;
  INVOICE_TOTAL: number;
  PAYMENT_TOTAL: number;
  CREDIT_TOTAL: number;
  BANK_ID: number;
  INVOICE_DUE_DATE: Date;
  PAYMENT_DATE: Date;
  CURRENCY: string;
}
