import { OrderFilters } from "@/core/repositories/order-filter";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { Order } from "../../enterprise/entities/order";
import { LocationParams } from "@/core/repositories/location-params";

export abstract class OrdersRepository {
  abstract findById(id: string): Promise<Order | null>;
  abstract findMany(
    filters: OrderFilters,
    paginationParams: PaginationParams,
    locationParams?: LocationParams
  ): Promise<Order[]>;
  abstract create(order: Order): Promise<void>;
  abstract update(order: Order): Promise<void>;
  abstract assignDeliveryman(orderId: string, deliverymanId: string): Promise<void>;
  abstract delete(order: Order): Promise<void>;
}
