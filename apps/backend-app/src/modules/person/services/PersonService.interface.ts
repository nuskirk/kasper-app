import { Person } from "@prisma/client";

export interface IPersonService {
  getAll(): Promise<Person[]>;
}
