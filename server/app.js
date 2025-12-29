import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import hpp from "hpp";
import ProductRouter from "./Routes/productRoutes.js";
import userRoutes from "./Routes/userRoutes.js";
import { generalLimiter } from "./Utils/rateLimiter.js";

const app = express();

// Trust proxy for Render (for correct IP detection)
app.set("trust proxy", 1);

// 🕐 Response-time Logger — place early (using high-precision timing)
app.use((req, res, next) => {
  const start = process.hrtime.bigint();
  res.on("finish", () => {
    const end = process.hrtime.bigint();
    const timeMs = Number(end - start) / 1e6;
    console.log(`[${req.method}] ${req.originalUrl} - ${timeMs.toFixed(2)}ms`);
  });
  next();
});

// ✅ Compression (major performance boost)
app.use(compression());

// ✅ Optimized CORS
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://shopsy-ecomm-eight.vercel.app"
        : "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// ✅ Parsing middleware
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// ✅ Security & clean parameters
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(hpp());

// ✅ Rate limiter (only for user-related routes)
app.use("/api/v1/users", generalLimiter);

// ✅ Health check — no rate limit here
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// ✅ API routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/Products", ProductRouter);

// ✅ Root route
app.get("/", (req, res) => {
  res.json({
    message: "Shopsy API Server",
    version: "1.0.0",
    status: "running",
  });
});

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: "fail",
    message: "Route not found",
  });
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.statusCode || 500).json({
    status: "error",
    message: err.message || "Internal server error",
  });
});

export default app;
