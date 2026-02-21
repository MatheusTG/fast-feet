import { Either, left, right } from "@/core/errors/abstractions/either";
import { UnauthorizedError } from "@/core/errors/application/unauthorized-error";
import { Injectable } from "@nestjs/common";
import { OrdersRepository } from "../repositories/orders-repository";
import { InvalidOrderStatusForPickupError } from "./errors/invalid-order-status-for-pickup-error";
import { OrderNotAssignedToDeliverymanError } from "./errors/order-not-assigned-to-deliveryman-error";
import { OrderNotFoundError } from "./errors/order-not-found-error";

type PickUpOrderUseCaseRequest = {
  actorId: string | undefined;
  orderId: string;
};

type PickUpOrderUseCaseResponse = Either<
  | UnauthorizedError
  | OrderNotFoundError
  | OrderNotAssignedToDeliverymanError
  | InvalidOrderStatusForPickupError,
  null
>;

@Injectable()
export class PickUpOrderUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    actorId,
    orderId,
  }: PickUpOrderUseCaseRequest): Promise<PickUpOrderUseCaseResponse> {
    if (!actorId) return left(new UnauthorizedError());

    const order = await this.ordersRepository.findById(orderId);

    if (!order) {
      return left(new OrderNotFoundError("id", orderId));
    }

    if (!order.deliverymanId || order.deliverymanId.toString() !== actorId) {
      return left(new OrderNotAssignedToDeliverymanError());
    }

    if (order.status !== "AWAITING_PICKUP") {
      return left(new InvalidOrderStatusForPickupError(order.status));
    }

    order.pickUp();

    await this.ordersRepository.update(order);

    return right(null);
  }
}
