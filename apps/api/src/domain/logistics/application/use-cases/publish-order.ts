import { Either, left, right } from "@/core/errors/abstractions/either";
import { UserRoleAuthorizationService } from "@/core/security/user-role-authorization.service";
import { Injectable } from "@nestjs/common";
import { OrdersRepository } from "../repositories/orders-repository";
import { InvalidOrderStatusForWaitingError } from "./errors/invalid-order-status-for-waiting-error";
import { OrderNotFoundError } from "./errors/order-not-found-error";

type Request = {
  actorId: string | undefined;
  orderId: string;
};

type Response = Either<OrderNotFoundError | InvalidOrderStatusForWaitingError, null>;

@Injectable()
export class PublishOrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private authService: UserRoleAuthorizationService
  ) {}

  async execute({ actorId, orderId }: Request): Promise<Response> {
    const authorization = await this.authService.ensureUserHasRole(actorId, "ADMIN");

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const order = await this.ordersRepository.findById(orderId);

    if (!order) {
      return left(new OrderNotFoundError("id", orderId));
    }

    if (order.status !== "PENDING") {
      return left(new InvalidOrderStatusForWaitingError(order.status));
    }

    order.markAsAvailable();

    await this.ordersRepository.update(order);

    return right(null);
  }
}
