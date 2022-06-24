import { Person } from "@prisma/client";

export interface IPersonService {
  getAll(): Promise<Person[]>;
  create(payload: { name: string, previous_person_id?: number }): Promise<Person>;
  update(id: number, payload: { name?: string, previous_person_id?: number }): Promise<Person>;
  delete(id: number): Promise<boolean>;
}
