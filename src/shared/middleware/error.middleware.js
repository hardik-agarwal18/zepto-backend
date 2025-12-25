import { ApiError } from "../errors/index.js";

export default function errorHandler(err, req, res, next) {
  // Known errors
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    });
  }

  // Unknown / programming errors
  console.error("UNHANDLED ERROR:", err);

  return res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message: "Something went wrong",
    },
  });
}
