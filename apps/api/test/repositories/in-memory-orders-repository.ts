import { OrdersRepository } from "@/domain/logistics/application/repositories/orders-repository";
import { Order } from "@/domain/logistics/enterprise/entities/order";

export class InMemoryOrdersRepository implements OrdersRepository {
  items: Order[] = [];

  async findById(id: string): Promise<Order | null> {
    const order = this.items.find((recipient) => recipient.id.toString() === id);

    return order || null;
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
}
