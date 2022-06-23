import { IPersonService } from "./PersonService.interface";
import { Person, PrismaClient } from '@prisma/client'

class PersonService implements IPersonService {
  db: PrismaClient;

  constructor() {
    this.db = new PrismaClient();
  }

  async getAll(): Promise<Person[]> {
    try {
      return await this.db.person.findMany({});
    } catch (error) {
      throw error
    }
  }

}

export default new PersonService();
