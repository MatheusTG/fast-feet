import { CompositeValueObject } from "@/core/entities/composite-value-object";
import { DomainError } from "@/core/errors/abstractions/domain-error";
import { Either, left, right } from "@/core/errors/abstractions/either";
import { InvalidAddressError } from "../errors/invalid-address-error";

export type AddressProps = {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
};

export class Address extends CompositeValueObject<AddressProps> {
  get street() {
    return this.props.street;
  }

  get number() {
    return this.props.number;
  }

  get complement() {
    return this.props.complement;
  }

  get neighborhood() {
    return this.props.neighborhood;
  }

  get city() {
    return this.props.city;
  }

  get state() {
    return this.props.state;
  }

  get zipCode() {
    return this.props.zipCode;
  }

  get latitude() {
    return this.props.latitude;
  }

  get longitude() {
    return this.props.longitude;
  }

  static create(props: AddressProps): Either<DomainError, Address> {
    if (!props.street) return left(new InvalidAddressError("Street is required!"));
    if (!props.number) return left(new InvalidAddressError("Number is required!"));
    if (!props.neighborhood) return left(new InvalidAddressError("Neighborhood is required!"));
    if (!props.city) return left(new InvalidAddressError("City is required!"));
    if (!props.state) return left(new InvalidAddressError("State is required!"));
    if (!props.zipCode) return left(new InvalidAddressError("ZipCode is required!"));

    if ((props.latitude && !props.longitude) || (!props.latitude && props.longitude)) {
      return left(new InvalidAddressError("Latitude and longitude must be provided together"));
    }

    return right(new Address(props));
  }
}
