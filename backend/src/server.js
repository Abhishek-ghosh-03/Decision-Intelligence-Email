import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { ENV } from "./config/env.js";
import aiRoutes from "./routes/ai.routes.js";

await connectDB();
app.use("/api/ai", aiRoutes);

app.listen(ENV.PORT, () => {
  console.log("Server running on port", ENV.PORT);
});