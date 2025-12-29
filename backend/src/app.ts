import express from "express";
import healthRouter from "./routes/health.js";
import router from "./routes/index.js";

const app = express();

// basic middleware
app.use(express.json());

// routes
app.use("/health", healthRouter);
app.use("/", router);

export default app;
