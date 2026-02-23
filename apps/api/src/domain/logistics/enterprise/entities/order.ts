import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";
import { Address } from "./value-objects/address";

export const ORDER_STATUS = [
  "PENDING",
  "AVAILABLE_FOR_PICKUP",
  "AWAITING_PICKUP",
  "PICKED_UP",
  "IN_TRANSIT",
  "DELIVERED",
  "RETURNED",
  "CANCELED",
] as const;

export type OrderStatus = (typeof ORDER_STATUS)[number];

export interface OrderProps {
  recipientId: UniqueEntityId;
  deliverymanId?: UniqueEntityId;

  status: OrderStatus;
  deliveryAddress: Address;
  proofOfDeliveryName?: string;
  proofOfDeliveryUrl?: string;

  postedAt: Date;
  pickedUpAt?: Date;
  deliveredAt?: Date;
  returnedAt?: Date;
  canceledAt?: Date;

  notes?: string;

  createdAt: Date;
  updatedAt?: Date;
}

export class Order extends Entity<OrderProps> {
  get recipientId() {
    return this.props.recipientId;
  }

  get deliverymanId() {
    return this.props.deliverymanId;
  }

  set deliverymanId(id: UniqueEntityId | undefined) {
    this.props.deliverymanId = id;
    this.touch();
  }

  get status() {
    return this.props.status;
  }

  set status(status: OrderStatus) {
    this.props.status = status;
    this.touch();
  }

  get deliveryAddress() {
    return this.props.deliveryAddress;
  }

  set deliveryAddress(deliveryAddress: Address) {
    this.props.deliveryAddress = deliveryAddress;
    this.touch();
  }

  get proofOfDeliveryName() {
    return this.props.proofOfDeliveryName;
  }

  get proofOfDeliveryUrl() {
    return this.props.proofOfDeliveryUrl;
  }

  get postedAt() {
    return this.props.postedAt;
  }

  get pickedUpAt() {
    return this.props.pickedUpAt;
  }

  set pickedUpAt(date: Date | undefined) {
    this.props.pickedUpAt = date;
    this.touch();
  }

  get deliveredAt() {
    return this.props.deliveredAt;
  }

  set deliveredAt(date: Date | undefined) {
    this.props.deliveredAt = date;
    this.touch();
  }

  get returnedAt() {
    return this.props.returnedAt;
  }

  set returnedAt(date: Date | undefined) {
    this.props.returnedAt = date;
    this.touch();
  }

  get canceledAt() {
    return this.props.canceledAt;
  }

  set canceledAt(date: Date | undefined) {
    this.props.canceledAt = date;
    this.touch();
  }

  get notes() {
    return this.props.notes;
  }

  set notes(notes: string | undefined) {
    this.props.notes = notes;
    this.touch();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  public markAsAvailable() {
    this.status = "AVAILABLE_FOR_PICKUP";
    this.props.postedAt = new Date();
    this.touch();
  }

  public pickUp() {
    this.status = "PICKED_UP";
    this.touch();
  }

  public deliver(fileName: string, url: string) {
    this.status = "DELIVERED";
    this.deliveredAt = new Date();
    this.props.proofOfDeliveryName = fileName;
    this.props.proofOfDeliveryUrl = url;
    this.touch();
  }

  public return() {
    this.status = "RETURNED";
    this.touch();
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<OrderProps, "createdAt" | "status" | "postedAt">,
    id?: UniqueEntityId
  ) {
    const order = new Order(
      {
        ...props,
        status: props.status ?? "PENDING",
        postedAt: props.postedAt ?? new Date(),
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );

    return order;
  }
}
