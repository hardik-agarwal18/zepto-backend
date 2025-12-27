/**
 * Generic rate limit middleware
 * @param {RateLimiter} limiter - rate-limiter-flexible instance
 * @param {(req) => string} keyFn - function to extract unique key
 */
export const rateLimit = (limiter, keyFn) => async (req, res, next) => {
  try {
    const key = keyFn(req);

    if (!key) {
      // Fail-safe: allow request if key is missing
      return next();
    }

    await limiter.consume(key);
    next();
  } catch (err) {
    // err contains remainingPoints & msBeforeNext
    const retryAfter = Math.ceil(err.msBeforeNext / 1000);

    res.set({
      "Retry-After": retryAfter,
      "X-RateLimit-Limit": limiter.points,
      "X-RateLimit-Remaining": err.remainingPoints,
    });

    return res.status(429).json({
      message: "Too many requests. Please try again later.",
      retryAfter,
    });
  }
};
