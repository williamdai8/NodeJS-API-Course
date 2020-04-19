import express, { Application } from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import compression from 'compression';

import { environment } from './config/environment';
import routes from './routes/v1';
import mongo from './config/database/mongo';
import { ignoreFavicon } from './middlewares/favicon';
import { WinstonLogger } from './modules/logger';

const logger = new WinstonLogger('app.ts');

const app: Application = express();
const port: number = environment.port;

// Extend Express Request
declare global {
  namespace Express {
    export interface Request {
      sessionData: any;
    }
  }
}

// BD
mongo(app, environment.mongoURI, port);
// Middlewares
app.use(morgan(environment.morganFormat, { stream: logger }));
app.use(bodyParser.json());
app.use(ignoreFavicon);
app.use(compression()); // Recommended Nginx Reverse Proxy
// Routes
routes(app);
