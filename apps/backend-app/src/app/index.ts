import express, { Application, Request, Response } from 'express';
import { ServerInterface } from './app.interface';
import baseRouter from '../modules/BaseRouter'
import cors from 'cors';

class Server implements ServerInterface {

  async server(): Promise<Application> {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());
    app.use('/api/v1', baseRouter.routes);
    app.get('/', (req: Request, res: Response) => {
      res.send('Welcome to Kasper-app!');
    });
    return app;
  }
}

export default new Server();
