import { Either, left, right } from "@/core/errors/abstractions/either";
import { ForbiddenError } from "@/core/errors/application/forbidden-error";
import { UserRoleAuthorizationService } from "@/core/security/user-role-authorization.service";
import { Injectable } from "@nestjs/common";
import { OrdersRepository } from "../repositories/orders-repository";
import { InvalidOrderStatusForAssignmentError } from "./errors/invalid-order-status-for-assignment-error";
import { OrderAlreadyHasDeliverymanError } from "./errors/order-already-has-deliveryman-error";
import { OrderNotFoundError } from "./errors/order-not-found-error";

interface Request {
  actorId: string;
  orderId: string;
  deliverymanId: string;
}

type Response = Either<
  | ForbiddenError
  | OrderNotFoundError
  | OrderAlreadyHasDeliverymanError
  | InvalidOrderStatusForAssignmentError,
  null
>;

@Injectable()
export class AssignDeliverymanToOrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private userRoleAuthorizationService: UserRoleAuthorizationService
  ) {}

  async execute({ actorId, orderId, deliverymanId }: Request): Promise<Response> {
    const authorization = await this.userRoleAuthorizationService.ensureUserHasRole(
      actorId,
      "ADMIN"
    );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const order = await this.ordersRepository.findById(orderId);

    if (!order) {
      return left(new OrderNotFoundError("id", orderId));
    }

    if (order.deliverymanId) {
      return left(new OrderAlreadyHasDeliverymanError());
    }

    if (order.status !== "PENDING") {
      return left(new InvalidOrderStatusForAssignmentError(order.status));
    }

    await this.ordersRepository.assignDeliveryman(orderId, deliverymanId);

    return right(null);
  }
}
