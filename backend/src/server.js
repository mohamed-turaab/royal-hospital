import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), "..", ".env") });


import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import routes from "./routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "..", "public");
const uploadsDir = path.join(__dirname, "..", "..", "uploads");

const app = express();
const PORT = Number(process.env.PORT || 5000);
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/hospital_management";
let server;

app.use(cors());
app.use(express.json());

function connectDatabase() {
  mongoose
    .connect(MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err.message));
}

app.use("/api", routes);
app.use("/uploads", express.static(uploadsDir));
app.use(express.static(publicDir, {
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
    }
  }
}));

app.get("*", (req, res) => {
  // Force cache bust for the user's browser
  if (!req.query.bust) {
    const separator = req.originalUrl.includes("?") ? "&" : "?";
    return res.redirect(`${req.originalUrl}${separator}bust=${Date.now()}`);
  }

  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.sendFile(path.join(publicDir, "index.html"));
});

server = app
  .listen(PORT)
  .on("listening", () => {
    console.log(`System active on one port: \x1b[36m\x1b[4mhttp://localhost:${PORT}/\x1b[0m`);
    connectDatabase();
  })
  .on("error", (error) => {
    if (error.code !== "EADDRINUSE") {
      throw error;
    }

    console.log(`System active on one port: \x1b[36m\x1b[4mhttp://localhost:${PORT}/\x1b[0m`);
    setInterval(() => {}, 1 << 30);
  });

function shutdown(signal) {
  if (!server) {
    process.exit(0);
    return;
  }

  server.close(() => {
    mongoose.connection.close().finally(() => {
      process.exit(0);
    });
  });
}

process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGTERM", () => shutdown("SIGTERM"));
