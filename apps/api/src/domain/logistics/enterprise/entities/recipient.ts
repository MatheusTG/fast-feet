import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";
import { Address } from "./value-objects/address";

export interface RecipientProps {
  name: string;
  phone: string;
  email: string;
  address: Address;
  deliveryInstructions?: string;
  isProblematic?: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export class Recipient extends Entity<RecipientProps> {
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
    props: Optional<RecipientProps, "createdAt" | "isProblematic">,
    id?: UniqueEntityId
  ) {
    const recipients = new Recipient(
      {
        ...props,
        isProblematic: props.isProblematic ?? false,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );

    return recipients;
  }
}
