import { FetchOrdersUseCase } from "@/domain/logistics/application/use-cases/fetch-orders";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { Controller, Get, Query } from "@nestjs/common";
import { z } from "zod";
import { resolveUseCase } from "../../helpers/resolve-use-case";
import { ZodValidationsPipe } from "../../pipes/zod-validation-pipe";
import { OrderPresenter } from "../../presenters/order-presenter";

const fetchOrdersQuerySchema = z.object({
  page: z.string().optional().default("1").transform(Number).pipe(z.number().min(1)),
  status: z.string().optional(),
  recipientId: z.string().optional(),
  createdAfter: z.coerce.date().optional(),
  createdBefore: z.coerce.date().optional(),
});

const queryValidationPipe = new ZodValidationsPipe(fetchOrdersQuerySchema);

type FetchOrdersQuerySchema = z.infer<typeof fetchOrdersQuerySchema>;

@Controller("/orders")
export class FetchOrdersController {
  constructor(private fetchOrdersUseCase: FetchOrdersUseCase) {}

  @Get()
  async handle(
    @Query(queryValidationPipe) query: FetchOrdersQuerySchema,
    @CurrentUser() user: UserPayload
  ) {
    const { page, ...filters } = query;

    const result = await this.fetchOrdersUseCase.execute({
      actorId: user?.sub,
      filters,
      page,
    });

    const { orders } = resolveUseCase(result);

    return {
      orders: orders.map(OrderPresenter.toHTTP),
    };
  }
}
