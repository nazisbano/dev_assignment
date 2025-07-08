import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors, { CorsOptions } from 'cors';
import expressSanitizer from 'express-sanitizer';
import xssClean from 'xss-clean';
import hpp from 'hpp';
import compression from 'compression';
import { body, validationResult, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

/// Configure Rate Limiting to prevent DoS attacks
export const configureRateLimiting = () => {
  return rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute window
    max: 100, // Change to 1000 for testing if needed
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Security Headers using Helmet
export const configureHelmet = () => {
  return helmet();
};

// Prevent Cross-Site Scripting (XSS) attacks
export const configureXSSProtection = () => {
  return xssClean();
};

// Prevent HTTP Parameter Pollution (HPP)
export const configureHPP = () => {
  return hpp();
};

// Express Sanitizer Middleware (removes script tags etc.)
export const configureSanitizer = () => {
  return expressSanitizer();
};

// CORS Configuration
export const configureCORS = (): ReturnType<typeof cors> => {
  const corsOptions: CorsOptions = {
    origin: '*', // Use a whitelist in production
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'],
    credentials: true,
  };
  return cors(corsOptions);
};

// Input Validation Middleware using express-validator
export const validateInput = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  };
};

// GZIP Compression Middleware
export const configureCompression = () => {
  return compression();
};
