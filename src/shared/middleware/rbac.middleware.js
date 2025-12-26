import ApiError from "../errors/ApiError.js";
import { ERROR_CODES } from "../errors/errorCodes.js";

export function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    // Auth middleware MUST run before this
    if (!req.user || !req.user.role) {
      return next(
        new ApiError(401, "Authentication required", ERROR_CODES.UNAUTHORIZED)
      );
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          "You are not allowed to perform this action",
          ERROR_CODES.FORBIDDEN
        )
      );
    }

    next();
  };
}
