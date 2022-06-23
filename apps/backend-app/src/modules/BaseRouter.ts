import { Router } from 'express';
import { IRouter } from './Router.interface';
import PersonRouter from './person/PersonRouter'

const router = Router();

class BaseRouter implements IRouter {
  get routes() {
    router.use('/persons', PersonRouter.routes);
    return router;
  }
}

export default new BaseRouter();
