import { Either, left, right } from "@/core/errors/abstractions/either";
import { UseCaseError } from "@/core/errors/abstractions/use-case-error";
import { UserRoleAuthorizationService } from "@/core/security/user-role-authorization.service";
import { Injectable } from "@nestjs/common";
import { Order } from "../../enterprise/entities/order";
import { OrderFilters, OrdersRepository } from "../repositories/orders-repository";

type FetchOrdersUseCaseRequest = {
  actorId: string | undefined;
  filters?: OrderFilters;
  page: number;
};

type FetchOrdersUseCaseResponse = Either<UseCaseError, { orders: Order[] }>;

@Injectable()
export class FetchOrdersUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private userRoleAuthorizationService: UserRoleAuthorizationService
  ) {}

  async execute(request: FetchOrdersUseCaseRequest): Promise<FetchOrdersUseCaseResponse> {
    const { actorId, filters = {}, page } = request;

    const authorization = await this.userRoleAuthorizationService.ensureUserHasRole(
      actorId,
      "ADMIN"
    );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const orders = await this.ordersRepository.findMany(filters, { page });

    return right({ orders });
  }
}
