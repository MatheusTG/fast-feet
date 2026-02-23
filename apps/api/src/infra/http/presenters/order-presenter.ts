import { Order } from "@/domain/logistics/enterprise/entities/order";

export class OrderPresenter {
  static toHTTP(order: Order) {
    return {
      id: order.id.toString(),

      recipientId: order.recipientId.toString(),
      deliverymanId: order.deliverymanId?.toString() ?? null,

      status: order.status,
      proofOfDeliveryName: order.proofOfDeliveryName,
      proofOfDeliveryUrl: order.proofOfDeliveryUrl,

      deliveryAddress: {
        street: order.deliveryAddress.street,
        number: order.deliveryAddress.number,
        complement: order.deliveryAddress.complement,
        neighborhood: order.deliveryAddress.neighborhood,
        city: order.deliveryAddress.city,
        state: order.deliveryAddress.state,
        zipCode: order.deliveryAddress.zipCode,
        latitude: order.deliveryAddress.latitude,
        longitude: order.deliveryAddress.longitude,
      },

      notes: order.notes,

      postedAt: order.postedAt,
      deliveredAt: order.deliveredAt,

      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}
