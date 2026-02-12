import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";
import { Cpf } from "./value-objects/cpf";

export const USER_ROLES = ["ADMIN", "DELIVERYMAN"] as const;

export type UserRole = (typeof USER_ROLES)[number];

export interface UserProps {
  cpf: Cpf;
  name: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt?: Date;
}

export class User extends Entity<UserProps> {
  get cpf() {
    return this.props.cpf;
  }

  set cpf(cpf: Cpf) {
    this.props.cpf = cpf;
  }

  get name() {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
  }

  get password() {
    return this.props.password;
  }

  get role() {
    return this.props.role;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: Optional<UserProps, "role" | "createdAt">, id?: UniqueEntityId) {
    const user = new User(
      {
        ...props,
        role: props.role ?? "DELIVERYMAN",
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );

    return user;
  }
}
