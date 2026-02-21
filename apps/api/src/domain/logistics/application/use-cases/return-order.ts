import { Either, left, right } from "@/core/errors/abstractions/either";
import { UnauthorizedError } from "@/core/errors/application/unauthorized-error";
import { UserRoleAuthorizationService } from "@/core/security/user-role-authorization.service";
import { Injectable } from "@nestjs/common";
import { OrdersRepository } from "../repositories/orders-repository";
import { OrderNotAssignedToDeliverymanError } from "./errors/order-not-assigned-to-deliveryman-error";
import { OrderNotFoundError } from "./errors/order-not-found-error";

type ReturnOrderUseCaseRequest = {
  actorId: string | undefined;
  orderId: string;
};

type ReturnOrderUseCaseResponse = Either<
  UnauthorizedError | OrderNotFoundError | OrderNotAssignedToDeliverymanError,
  null
>;

@Injectable()
export class ReturnOrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private userRoleAuthorizationService: UserRoleAuthorizationService
  ) {}

  async execute({
    actorId,
    orderId,
  }: ReturnOrderUseCaseRequest): Promise<ReturnOrderUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId);

    if (!order) {
      return left(new OrderNotFoundError("id", orderId));
    }

    if (actorId !== order?.deliverymanId?.toString()) {
      const authorization = await this.userRoleAuthorizationService.ensureUserHasRole(
        actorId,
        "ADMIN"
      );

      if (authorization.isLeft()) {
        return left(new OrderNotAssignedToDeliverymanError());
      }
    }

    order.return();

    await this.ordersRepository.update(order);

    return right(null);
  }
}
