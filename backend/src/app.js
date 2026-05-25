import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import routes from "./routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const publicDir = path.join(__dirname, "..", "public");
const uploadsDir = path.join(__dirname, "..", "uploads");
const rootUploadsDir = path.join(__dirname, "..", "..", "uploads");
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/hospital_management";

let connectionPromise;

export function connectDatabase() {
  if (mongoose.connection.readyState === 1) {
    return Promise.resolve(mongoose.connection);
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(MONGODB_URI)
      .then(() => {
        console.log("Connected to MongoDB");
        return mongoose.connection;
      })
      .catch((err) => {
        connectionPromise = null;
        console.error("MongoDB connection error:", err.message);
        throw err;
      });
  }

  return connectionPromise;
}

export const app = express();

app.use(cors());
app.use(express.json());

async function requireDatabase(_req, _res, next) {
  try {
    await connectDatabase();
    next();
  } catch (error) {
    next(error);
  }
}

app.use("/api", requireDatabase, routes);
app.use("/uploads", express.static(uploadsDir));
app.use("/uploads", express.static(rootUploadsDir));
app.use(
  express.static(publicDir, {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".html")) {
        res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");
      }
    },
  }),
);

app.get("*", (req, res) => {
  if (!req.query.bust) {
    const separator = req.originalUrl.includes("?") ? "&" : "?";
    return res.redirect(`${req.originalUrl}${separator}bust=${Date.now()}`);
  }

  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.sendFile(path.join(publicDir, "index.html"));
});

export default app;
