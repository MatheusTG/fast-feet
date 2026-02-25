import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { DomainEvents } from "@/core/events/domain-events";
import { OrderFilters } from "@/core/repositories/order-filters";
import { OrdersRepository } from "@/domain/logistics/application/repositories/orders-repository";
import { Order } from "@/domain/logistics/enterprise/entities/order";
import { getDistanceBetweenCoordinates } from "@test/utils/get-distance-beteween-coordinates";

export class InMemoryOrdersRepository implements OrdersRepository {
  items: Order[] = [];

  async findById(id: string): Promise<Order | null> {
    const order = this.items.find((recipient) => recipient.id.toString() === id);

    return order || null;
  }

  async findMany(
    filters: OrderFilters,
    paginationParams: { page: number },
    locationFilters: {
      userLatitude?: number;
      userLongitude?: number;
      radiusInKm?: number;
    }
  ): Promise<Order[]> {
    const pageSize = 20;

    const { userLatitude, userLongitude, radiusInKm = 10 } = locationFilters;

    const orders = this.items
      .filter((order) => {
        if (filters.recipientId && order.recipientId.toString() !== filters.recipientId) {
          return false;
        }
        if (filters.deliverymanId && order.deliverymanId?.toString() !== filters.deliverymanId) {
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

        if (
          userLatitude !== undefined &&
          userLongitude !== undefined &&
          order.deliveryAddress.latitude !== undefined &&
          order.deliveryAddress.longitude !== undefined
        ) {
          const distance = getDistanceBetweenCoordinates(
            {
              latitude: userLatitude,
              longitude: userLongitude,
            },
            {
              latitude: order.deliveryAddress.latitude,
              longitude: order.deliveryAddress.longitude,
            }
          );

          if (distance > radiusInKm) {
            return false;
          }
        }

        return true;
      })
      .slice((paginationParams.page - 1) * pageSize, paginationParams.page * pageSize);

    return orders;
  }

  async create(order: Order): Promise<void> {
    this.items.push(order);
  }

  async update(order: Order): Promise<void> {
    const index = this.items.findIndex((r) => r.id === order.id);

    if (order.status) {
      DomainEvents.dispatchEventsForAggregate(order.id);
    }

    if (index !== -1) {
      this.items[index] = order;
    }
  }

  async assignDeliveryman(orderId: string, deliverymanId: string): Promise<void> {
    const order = this.items.find((item) => item.id.toString() === orderId);

    if (!order) return;

    order.deliverymanId = new UniqueEntityId(deliverymanId);
    order.status = "AWAITING_PICKUP";
  }

  async delete(order: Order): Promise<void> {
    const orderIndex = this.items.findIndex((item) => item.id === order.id);

    this.items.splice(orderIndex, 1);
  }
}
