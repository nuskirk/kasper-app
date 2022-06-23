import { Person } from "@prisma/client";

export interface IPersonService {
  getAll(): Promise<Person[]>;
  create(payload: { name: string, pre_position?: number, next_position?: number }): Promise<Person>;
  update(id: number, payload: { name?: string, pre_position?: number, next_position?: number }): Promise<Person>;
}
