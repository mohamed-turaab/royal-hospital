export function notFound(req, res) {
  res.status(404).json({ message: "Route not found" });
}

export function errorHandler(err, req, res, next) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({ message: err.message || "Server error" });
}
