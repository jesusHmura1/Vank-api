import * as mongoose from 'mongoose';

export const InvoicesSchema = new mongoose.Schema(
  {
    INVOICE_ID: { type: Number, required: true },
    VENDOR_ID: { type: Number, required: true },
    INVOICE_NUMBER: { type: String, required: true },
    INVOICE_DATE: { type: Date, required: true },
    INVOICE_TOTAL: { type: Number, required: true },
    PAYMENT_TOTAL: { type: Number, required: true },
    CREDIT_TOTAL: { type: Number, required: true },
    BANK_ID: { type: Number, required: true },
    INVOICE_DUE_DATE: { type: Date, required: true },
    PAYMENT_DATE: { type: Date },
    CURRENCY: { type: String, required: true },
  },
  { timestamps: true },
);

InvoicesSchema.index({ INVOICE_ID: 1 }, { unique: true });
