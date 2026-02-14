import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";
import { Address } from "./value-objects/address";

export interface RecipientsProps {
  name: string;
  phone: string;
  email: string;
  address: Address;
  deliveryInstructions?: string;
  isProblematic?: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export class Recipients extends Entity<RecipientsProps> {
  get name() {
    return this.props.name;
  }

  get phone() {
    return this.props.phone;
  }

  get email() {
    return this.props.email;
  }

  get address() {
    return this.props.address;
  }

  get deliveryInstructions() {
    return this.props.deliveryInstructions;
  }

  get isProblematic() {
    return this.props.isProblematic;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(
    props: Optional<RecipientsProps, "deliveryInstructions" | "isProblematic">,
    id?: UniqueEntityId
  ) {
    const recipients = new Recipients(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );

    return recipients;
  }
}
