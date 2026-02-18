import { Order } from "../../enterprise/entities/order";

export interface OrderFilters {
  recipientId?: string;
  status?: string;
  createdAfter?: Date;
  createdBefore?: Date;
  postedAfter?: Date;
  postedBefore?: Date;
  deliveredAfter?: Date;
  deliveredBefore?: Date;
}

export abstract class OrdersRepository {
  abstract findById(id: string): Promise<Order | null>;
  abstract findMany(filters: OrderFilters, params: { page: number }): Promise<Order[]>;
  abstract create(order: Order): Promise<void>;
  abstract update(order: Order): Promise<void>;
  abstract delete(order: Order): Promise<void>;
}
