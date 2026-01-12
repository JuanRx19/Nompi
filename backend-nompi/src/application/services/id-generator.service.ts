import { randomUUID } from 'crypto';

export interface IIdGenerator {
  generate(): string;
}

export const IdGeneratorToken = Symbol('IdGenerator');

export class UuidIdGenerator implements IIdGenerator {
  generate(): string {
    return randomUUID();
  }
}
