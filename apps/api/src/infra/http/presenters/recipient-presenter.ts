import { Recipient } from "@/domain/logistics/enterprise/entities/recipient";

export class RecipientPresenter {
  static toHTTP(recipient: Recipient) {
    return {
      id: recipient.id.toString(),
      name: recipient.name,
      phone: recipient.phone,
      email: recipient.email,
      address: {
        street: recipient.address.street,
        number: recipient.address.number,
        complement: recipient.address.complement,
        neighborhood: recipient.address.neighborhood,
        city: recipient.address.city,
        state: recipient.address.state,
        zipCode: recipient.address.zipCode,
        latitude: recipient.address.latitude,
        longitude: recipient.address.longitude,
      },
      deliveryInstructions: recipient.deliveryInstructions,
      isProblematic: recipient.isProblematic,
      createdAt: recipient.createdAt,
      updatedAt: recipient.updatedAt,
    };
  }
}
