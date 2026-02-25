import { AggregateRoot } from "../entities/aggregate-root";
import { UniqueEntityId } from "../entities/unique-entity-id";
import { DomainEvent } from "./domain-event";

type DomainEventCallback<T extends DomainEvent = DomainEvent> = (event: T) => Promise<void>;

export class DomainEvents {
  private static handlersMap: Record<string, DomainEventCallback[]> = {};
  private static markedAggregates: AggregateRoot<unknown>[] = [];

  public static shouldRun = true;

  public static markAggregateForDispatch(aggregate: AggregateRoot<unknown>) {
    const aggregateFound = !!this.findMarkedAggregateByID(aggregate.id);

    if (!aggregateFound) {
      this.markedAggregates.push(aggregate);
    }
  }

  private static async dispatchAggregateEvents(aggregate: AggregateRoot<unknown>) {
    for (const event of aggregate.domainEvents) {
      await this.dispatch(event);
    }
  }

  private static removeAggregateFromMarkedDispatchList(aggregate: AggregateRoot<unknown>) {
    const index = this.markedAggregates.findIndex((a) => a.equals(aggregate));

    if (index !== -1) {
      this.markedAggregates.splice(index, 1);
    }
  }

  private static findMarkedAggregateByID(id: UniqueEntityId): AggregateRoot<unknown> | undefined {
    return this.markedAggregates.find((aggregate) => aggregate.id.equals(id));
  }

  public static async dispatchEventsForAggregate(id: UniqueEntityId) {
    const aggregate = this.findMarkedAggregateByID(id);

    if (aggregate) {
      await this.dispatchAggregateEvents(aggregate);
      aggregate.clearEvents();
      this.removeAggregateFromMarkedDispatchList(aggregate);
    }
  }

  public static register<T extends DomainEvent>(
    callback: DomainEventCallback<T>,
    eventClassName: string
  ) {
    const wasEventRegisteredBefore = eventClassName in this.handlersMap;

    if (!wasEventRegisteredBefore) {
      this.handlersMap[eventClassName] = [];
    }

    this.handlersMap[eventClassName]?.push(callback as DomainEventCallback);
  }

  public static clearHandlers() {
    this.handlersMap = {};
  }

  public static clearMarkedAggregates() {
    this.markedAggregates = [];
  }

  private static async dispatch(event: DomainEvent) {
    const eventClassName: string = event.constructor.name;

    const isEventRegistered = eventClassName in this.handlersMap;

    if (!this.shouldRun) {
      return;
    }

    if (isEventRegistered) {
      const handlers = this.handlersMap[eventClassName];

      if (handlers) {
        for (const handler of handlers) {
          await handler(event);
        }
      }
    }
  }
}
