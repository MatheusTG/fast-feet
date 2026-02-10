export abstract class SimpleValueObject<T> {
  public readonly value: T;

  protected constructor(value: T) {
    this.value = value;
    Object.freeze(this);
  }

  equals(other?: SimpleValueObject<T>): boolean {
    if (!other) return false;
    if (other.constructor !== this.constructor) return false;

    return this.value === other.value;
  }
}
