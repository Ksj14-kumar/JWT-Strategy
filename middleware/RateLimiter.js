const rateLimiter = require("express-rate-limit")


module.exports.ratelimit = rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    // store: new MemoryStore(),
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})