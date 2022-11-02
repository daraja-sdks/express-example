import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    amount: Number,
    phone: String,
    reference: String,
    status: String,
    transactionDate: Date,
    transactionId: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Payment", PaymentSchema);
