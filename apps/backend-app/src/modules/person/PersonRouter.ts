import { Request, Response, Router } from 'express';
import { IRouter } from '../Router.interface';
import PersonService from './services/PersonService'
const router = Router();

class PersonRouter implements IRouter {
  get routes(){
    router.get('/', async (req: Request, res: Response) => {
      try {
        const persons = await PersonService.getAll();
        return res.status(200).json({ persons });
      } catch (err) {
        throw err;
      }
    });
    return router;
  }
}

export default new PersonRouter();
