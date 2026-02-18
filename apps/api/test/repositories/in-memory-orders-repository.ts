import {
  OrderFilters,
  OrdersRepository,
} from "@/domain/logistics/application/repositories/orders-repository";
import { Order } from "@/domain/logistics/enterprise/entities/order";

export class InMemoryOrdersRepository implements OrdersRepository {
  items: Order[] = [];

  async findById(id: string): Promise<Order | null> {
    const order = this.items.find((recipient) => recipient.id.toString() === id);

    return order || null;
  }

  async findMany(filters: OrderFilters, params: { page: number }): Promise<Order[]> {
    const pageSize = 20;

    const orders = this.items
      .filter((order) => {
        if (filters.recipientId && order.recipientId.toString() !== filters.recipientId) {
          return false;
        }

        if (filters.status && order.status !== filters.status) {
          return false;
        }

        if (filters.createdAfter && order.createdAt < filters.createdAfter) {
          return false;
        }

        if (filters.createdBefore && order.createdAt > filters.createdBefore) {
          return false;
        }

        if (filters.postedAfter && order.postedAt && order.postedAt < filters.postedAfter) {
          return false;
        }

        if (filters.postedBefore && order.postedAt && order.postedAt > filters.postedBefore) {
          return false;
        }

        if (
          filters.deliveredAfter &&
          order.deliveredAt &&
          order.deliveredAt < filters.deliveredAfter
        ) {
          return false;
        }

        if (
          filters.deliveredBefore &&
          order.deliveredAt &&
          order.deliveredAt > filters.deliveredBefore
        ) {
          return false;
        }

        return true;
      })
      .slice((params.page - 1) * pageSize, params.page * pageSize);

    return orders;
  }

  async create(order: Order): Promise<void> {
    this.items.push(order);
  }

  async update(order: Order): Promise<void> {
    const index = this.items.findIndex((r) => r.id === order.id);

    if (index !== -1) {
      this.items[index] = order;
    }
  }

  async delete(order: Order): Promise<void> {
    const orderIndex = this.items.findIndex((item) => item.id === order.id);

    this.items.splice(orderIndex, 1);
  }
}
