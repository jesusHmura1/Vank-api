export interface InvoicesI {
  invoiceID: number;
  vendorID: number;
  invoiceNumber: string;
  invoiceDate: Date;
  invoiceTotal: number;
  paymentTotal: number;
  bankID: number;
  invoiceDueDate: Date;
  paymentDate: Date;
  currency: string;
}
