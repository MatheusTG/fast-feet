import { Either, left, right } from "@/core/errors/abstractions/either";
import { UseCaseError } from "@/core/errors/abstractions/use-case-error";
import { UnauthorizedError } from "@/core/errors/application/unauthorized-error";
import { LocationParams } from "@/core/repositories/location-params";
import { OrderFilters } from "@/core/repositories/order-filter";
import { Injectable } from "@nestjs/common";
import { Order } from "../../enterprise/entities/order";
import { OrdersRepository } from "../repositories/orders-repository";

type FetchOrdersUseCaseRequest = {
  actorId: string | undefined;
  page: number;
  filters?: Omit<OrderFilters, "deliverymanId">;
  locationParams?: LocationParams;
};

type FetchOrdersUseCaseResponse = Either<UseCaseError, { orders: Order[] }>;

@Injectable()
export class FetchOrdersUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute(request: FetchOrdersUseCaseRequest): Promise<FetchOrdersUseCaseResponse> {
    const { actorId, filters = {}, page, locationParams = {} } = request;

    const { userLatitude, userLongitude, radiusInKm } = locationParams;

    if (!actorId) {
      return left(new UnauthorizedError());
    }

    const orders = await this.ordersRepository.findMany(
      { ...filters, deliverymanId: actorId },
      { page },
      { userLatitude, userLongitude, radiusInKm }
    );

    return right({ orders });
  }
}
