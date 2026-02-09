import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

export interface UserProps {
  cpf: string;
  name: string;
  password: string;
  role: "admin" | "deliveryman";
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

  static create(props: Optional<UserProps, "role">, id?: UniqueEntityId) {
    const user = new User(
      {
        ...props,
        role: props.role ?? "deliveryman",
      },
      id
    );

    return user;
  }
}
