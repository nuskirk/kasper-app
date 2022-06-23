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

  async create(payload: { name: string, pre_position?: number, next_position?: number }): Promise<Person> {
    try {
      return await this.db.person.create({
        data: payload
      });
    } catch (error) {
      throw error
    }
  }

  async update(id: number, payload: { name?: string, pre_position?: number, next_position?: number }): Promise<Person> {
    try {
      return await this.db.person.update({
        where: {
          id
        },
        data: payload
      });
    } catch (error) {
      throw error
    }
  }
}

export default new PersonService();
