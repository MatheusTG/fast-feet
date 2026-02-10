export abstract class CompositeValueObject<T extends object> {
  protected readonly props: Readonly<T>;

  protected constructor(props: T) {
    this.props = Object.freeze(props);
  }

  equals(other?: CompositeValueObject<T>): boolean {
    if (!other) return false;
    if (other.constructor !== this.constructor) return false;

    return JSON.stringify(this.props) === JSON.stringify(other.props);
  }
}
