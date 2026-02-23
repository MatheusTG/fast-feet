import { Either, left, right } from "@/core/errors/abstractions/either";
import { UseCaseError } from "@/core/errors/abstractions/use-case-error";
import { UnauthorizedError } from "@/core/errors/application/unauthorized-error";
import { OrderFilters } from "@/core/repositories/order-filter";
import { Injectable } from "@nestjs/common";
import { Order } from "../../enterprise/entities/order";
import { OrdersRepository } from "../repositories/orders-repository";

type FetchOrdersUseCaseRequest = {
  actorId: string | undefined;
  filters?: Omit<OrderFilters, "deliverymanId">;
  page: number;
};

type FetchOrdersUseCaseResponse = Either<UseCaseError, { orders: Order[] }>;

@Injectable()
export class FetchOrdersUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute(request: FetchOrdersUseCaseRequest): Promise<FetchOrdersUseCaseResponse> {
    const { actorId, filters = {}, page } = request;

    if (!actorId) {
      return left(new UnauthorizedError());
    }

    const orders = await this.ordersRepository.findMany(
      { ...filters, deliverymanId: actorId },
      { page }
    );

    return right({ orders });
  }
}
