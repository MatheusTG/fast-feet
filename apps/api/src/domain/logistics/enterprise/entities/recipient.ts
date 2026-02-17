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

  set name(name: string) {
    this.props.name = name;
    this.touch();
  }

  get phone() {
    return this.props.phone;
  }

  set phone(phone: string) {
    this.props.phone = phone;
    this.touch();
  }

  get email() {
    return this.props.email;
  }

  set email(email: string) {
    this.props.email = email;
    this.touch();
  }

  get address() {
    return this.props.address;
  }

  set address(address: Address) {
    this.props.address = address;
    this.touch();
  }

  get deliveryInstructions() {
    return this.props.deliveryInstructions;
  }

  set deliveryInstructions(deliveryInstructions: string | undefined) {
    this.props.deliveryInstructions = deliveryInstructions;
    this.touch();
  }

  get isProblematic() {
    return this.props.isProblematic;
  }

  set isProblematic(isProblematic: boolean | undefined) {
    this.props.isProblematic = isProblematic;
    this.touch();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
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
