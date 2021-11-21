import * as mongoose from 'mongoose';

export const ClientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    codeID: { type: String, required: true },
    tributeID: { type: String, required: true },
    currency: { type: String, required: true },
    monthlyCall: { type: Number, required: true },
    bank: { type: Array, required: true },
  },
  { timestamps: true },
);

ClientSchema.index({ username: 1 }, { unique: true });
