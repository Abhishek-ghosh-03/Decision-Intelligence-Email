import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import emailRoutes from "./routes/email.routes.js";
import templateRoutes from "./routes/template.routes.js";
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/template" , templateRoutes);
export default app;