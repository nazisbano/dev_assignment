import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cluster from 'cluster';
import os from 'os';
import { connectDB } from './config/database_config';
import developerRoutes from './routes/developer_routes';
import {
  configureRateLimiting,
  configureHelmet,
  configureXSSProtection,
  configureHPP,
  configureSanitizer,
  configureCORS,
  configureCompression,
} from './middleware/security.middleware';

// Load environment variables
dotenv.config();

// Constants
const PORT = process.env.PORT || 5000;
const numCPUs = os.cpus().length;

/**
 * Initialize and configure the Express app
 */
const createServer = async () => {
  await connectDB();

  const app = express();

  // --- Security Middlewares ---
  app.use(configureRateLimiting());
  app.use(configureHelmet());
  app.use(configureCORS());
  app.use(configureXSSProtection());
  app.use(configureHPP());
  app.use(configureSanitizer());
  app.use(configureCompression());

  // --- Body Parsers ---
  app.use(express.json({
    limit: '50mb',
    verify: (req: Request, res: Response, buf: Buffer) => {
      if (buf.length === 0) return;
      try {
        JSON.parse(buf.toString());
      } catch (err) {
        res.status(400).json({ status: false, message: 'Invalid JSON' });
        throw new Error('Invalid JSON');
      }
    }
  }));

  app.use(express.urlencoded({
    extended: true,
    limit: '50mb',
    parameterLimit: 10000,
  }));

  // --- Routes ---
  app.use('/api/developers', developerRoutes);

  // --- Global Error Handler ---
  app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof SyntaxError) {
      return res.status(400).json({
        status: false,
        message: 'Invalid request syntax',
        error: error.message,
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: false,
        message: 'Validation error',
        error: error.message,
      });
    }

    next(error);
  });

  // --- Start Server ---
  app.listen(PORT, () => {
    console.log(`Worker ${process.pid} is running on port ${PORT}`);
  });
};

/**
 * Cluster logic: primary forks workers, workers run the server
 */
const startCluster = async () => {
  if (cluster.isPrimary) {
    console.log(`Primary process PID: ${process.pid}`);
    console.log(`Forking ${numCPUs} worker(s)...`);

    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
      console.log(`Worker ${worker.process.pid} exited. Restarting...`);
      cluster.fork();
    });

  } else {
    await createServer();
  }
};

// Start the app with clustering
startCluster();
