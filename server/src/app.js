import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import paymentRouter from "./routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet());
app.use(morgan("common"));

app.use("/api/payment", paymentRouter);

export default app;
