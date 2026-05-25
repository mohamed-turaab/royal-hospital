import mongoose from "mongoose";
import app, { connectDatabase } from "./app.js";

const PORT = Number(process.env.PORT || 5000);
let server;

server = app
  .listen(PORT)
  .on("listening", () => {
    console.log(`System active on one port: \x1b[36m\x1b[4mhttp://localhost:${PORT}/\x1b[0m`);
    connectDatabase().catch(() => {});
  })
  .on("error", (error) => {
    if (error.code !== "EADDRINUSE") {
      throw error;
    }

    console.log(`System active on one port: \x1b[36m\x1b[4mhttp://localhost:${PORT}/\x1b[0m`);
    setInterval(() => {}, 1 << 30);
  });

function shutdown() {
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

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);
