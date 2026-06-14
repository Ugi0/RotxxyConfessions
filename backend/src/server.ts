import express from "express";
import handleConfessionsRoute, { handleUpdateConfessionStatus } from "./routes/confessions.js";
import cookieParser from "cookie-parser";
import { handleCallback, handleLogin, handleValidation } from "./routes/auth.js";
import { handleConfessionRoute } from "./routes/confession.js";

const app = express();
const PORT = Number(process.env.PORT) || 8080;

app.use(express.json());
app.use(cookieParser());

app.get("/api/healthz", (req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth/login", handleLogin);
app.use("/api/auth/logout", handleLogin);
app.use("/api/auth/validate", handleValidation);
app.use("/api/auth/callback", handleCallback);
app.get("/api/confessions", handleConfessionsRoute);
app.get("/api/confession", handleConfessionRoute);
app.post("/api/confession", handleConfessionRoute);
app.post("/api/confessions/:id/:action", handleUpdateConfessionStatus);

app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});