import {
  Address,
  AddressProps,
} from "@/domain/logistics/enterprise/entities/value-objects/address";
import { fakerPT_BR as faker } from "@faker-js/faker";

export function makeAddress(override?: Partial<AddressProps>) {
  const uncheckedAddress = {
    street: faker.location.street(),
    number: faker.location.buildingNumber(),
    complement: faker.helpers.maybe(() => faker.location.secondaryAddress()),
    neighborhood: faker.location.county(),
    city: faker.location.city(),
    state: faker.location.state({ abbreviated: true }),
    zipCode: faker.location.zipCode("#####-###"),
    latitude: faker.location.latitude(),
    longitude: faker.location.longitude(),
    ...override,
  };

  const addressOrError = Address.create(uncheckedAddress);

  if (addressOrError.isLeft()) {
    throw new Error(`Test setup failed: generated invalid address (${uncheckedAddress})`);
  }

  const address = addressOrError.value;

  return address;
}
