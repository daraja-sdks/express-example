import { Mpesa, STKPushResultWrapper } from "daraja.js";
import dotenv from "dotenv";
import express from "express";
import Payment from "./models.js";

dotenv.config();

const router = express.Router();
const app = new Mpesa({
  consumerKey: process.env.CONSUMER_KEY,
  consumerSecret: process.env.CONSUMER_SECRET,
  initiatorPassword: "Safaricom999!*!", // in production, this will be provided to you by Safaricom
  organizationShortCode: 174379,
});

router.post("/", async (req, res) => {
  if (req.body.phone) {
    // replace first 0 with 254 - daraja requires phone number to start with 254
    const phone = req.body.phone.replace(/^0/, "254");
    const { amount } = req.body;

    app
      .stkPush()
      .amount(amount || 1)
      .phoneNumber(phone)
      .lipaNaMpesaPassKey(process.env.LNM_PASSKEY)
      .callbackURL(
        `${process.env.BASE_URL || "https://example.com"}/api/payment/callback`
      )
      .send()
      .then(async (response) => {
        const payment = new Payment({
          amount,
          phone,
          reference: "", // this is the M-Pesa receipt number, it will be set later
          status: "pending",
          transactionDate: new Date(),
          transactionId: response.getTransactionID(),
        });

        await payment.save();
        res.status(200).json({ message: "Payment request sent" });
      })
      .catch((e) => {
        console.log(e);
        // if you want to log the errors, set DEBUG=true in your .env file
        res.status(500).json({ message: "Payment request failed" });
      });
  } else {
    res.status(400).json({
      msg: "Please provide a phone number",
    });
  }
});

router.post("/callback", async (req, res) => {
  const data = new STKPushResultWrapper(req.body); // this is a wrapper that simplifies accessing the data in the request body
  const payment = await Payment.findOne({
    phone: data.getSenderPhoneNo(),
  }); // find the payment record in your database from the phone number

  if (payment) {
    payment.status = data.getResultCode() === 0 ? "success" : "failed";
    payment.reference = data.getMpesaReceiptNo();
    await payment.save();
  }

  res.status(200); // Safaricom requires a 200 response
});

export default router;
