import { randomUUID } from "node:crypto";

export class UniqueEntityId {
  private value: string;

  toString() {
    return this.value;
  }

  constructor(value?: string) {
    this.value = value ?? randomUUID();
  }

  public equals(id: UniqueEntityId) {
    return this.value === id.value;
  }
}
