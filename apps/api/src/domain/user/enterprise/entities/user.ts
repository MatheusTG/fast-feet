import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";
import { Cpf } from "./value-objects/cpf";

export const USER_ROLES = ["ADMIN", "DELIVERYMAN"] as const;

export type UserRoles = (typeof USER_ROLES)[number];

export interface UserProps {
  cpf: Cpf;
  name: string;
  password: string;
  role: UserRoles;
  createdAt: Date;
  updatedAt?: Date;
}

export class User extends Entity<UserProps> {
  get name() {
    return this.props.name;
  }

  get cpf() {
    return this.props.cpf;
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
