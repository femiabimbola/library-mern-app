import { Request, Response, NextFunction } from 'express';

// Store rate limit data in memory (IP -> timestamps of requests)
const rateLimitStore: Map<string, number[]> = new Map();

// Configuration
const MAX_REQUESTS = 4;
const WINDOW_MS = 60 * 1000; // 1 minute in milliseconds

export const rateLimiter = (req: Request, res: Response, next: NextFunction) => {

  const ip = req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() || 
             req.socket.remoteAddress || '127.0.0.1';
  
  // Get current time
  const now = Date.now();
  
  // Get or initialize request timestamps for this IP
  let requests = rateLimitStore.get(ip) || [];
  
  // Filter out requests older than the window
  requests = requests.filter(timestamp => now - timestamp < WINDOW_MS);
  
  // Check if limit is exceeded
  if (requests.length >= MAX_REQUESTS) {
     res.status(429).json({ error: 'Rate limit exceeded. Please try again in a minute.'
    });
  return;
  }
  
  // Add current request timestamp
  requests.push(now);
  rateLimitStore.set(ip, requests);
  
  // Clean up old entries periodically
  if (rateLimitStore.size > 1000) { // Prevent memory growth
    for (const [storedIp, timestamps] of rateLimitStore) {
      const validTimestamps = timestamps.filter(ts => now - ts < WINDOW_MS);
      if (validTimestamps.length === 0) {
        rateLimitStore.delete(storedIp);
      } else {
        rateLimitStore.set(storedIp, validTimestamps);
      }
    }
  }
  
  next();
};