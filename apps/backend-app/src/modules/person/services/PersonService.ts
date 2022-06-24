import { IPersonService } from "./PersonService.interface";
import { Person, PrismaClient } from '@prisma/client'

class PersonService implements IPersonService {
  db: PrismaClient;

  constructor() {
    this.db = new PrismaClient();
  }

  async getAll(): Promise<Person[]> {
    try {
      const persons = await this.db.person.findMany({});

      if (!persons.length) {
        return [];
      }

      const orderedPersons: Person[] = [];
      const firstPerson = persons.find((person: Person) => person.previous_person_id === null);
      let current = firstPerson;

      orderedPersons.push(current);

      for (let i = 1; i < persons.length; i++) {
        current = persons.find((person: Person) => person.previous_person_id === current.id);
        orderedPersons.push(current);
      }

      return orderedPersons;
    } catch (error) {
      throw error
    }
  }

  async create(payload: { name: string, previous_person_id?: number }): Promise<Person> {
    try {
      return await this.db.person.create({
        data: payload
      });
    } catch (error) {
      throw error
    }
  }

  async update(id: number, payload: { name?: string, previous_person_id?: number }): Promise<Person> {
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

  async delete(id: number): Promise<boolean> {
    try {
      await this.db.person.delete({
        where: {
          id
        }
      });

      return true;
    } catch (error) {
      throw error
    }
  }
}

export default new PersonService();
