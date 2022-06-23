import { Request, Response, Router } from 'express';
import { IRouter } from '../Router.interface';
import PersonService from './services/PersonService'
const router = Router();

class PersonRouter implements IRouter {
  get routes(){
    router.get('/', async (req: Request, res: Response) => {
      try {
        const persons = await PersonService.getAll();
        return res.status(200).json({ status: 'success', persons });
      } catch (err) {
        throw err;
      }
    });

    router.post('/', async (req: Request, res: Response) => {
      try {
        const person = await PersonService.create(req.body);
        return res.status(200).json({ status: 'success', person });
      } catch (err) {
        throw err;
      }
    });

    router.put('/:id', async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const person = await PersonService.update(parseInt(id), req.body);
        return res.status(200).json({ status: 'success', person });
      } catch (err) {
        throw err;
      }
    });

    router.delete('/:id', async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const isDeleted = await PersonService.delete(parseInt(id));
        return res.status(200).json({ status: 'success', isDeleted });
      } catch (err) {
        throw err;
      }
    });

    return router;
  }
}

export default new PersonRouter();
