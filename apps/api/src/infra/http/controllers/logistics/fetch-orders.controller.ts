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
  userLatitude: z.coerce
    .number()
    .refine((value) => {
      return Math.abs(value) <= 90;
    })
    .optional(),
  userLongitude: z.coerce
    .number()
    .refine((value) => {
      return Math.abs(value) <= 180;
    })
    .optional(),
  radiusInKm: z.coerce.number().optional(),
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
    const { page, userLatitude, userLongitude, radiusInKm, ...filters } = query;

    const result = await this.fetchOrdersUseCase.execute({
      actorId: user?.sub,
      page,
      filters,
      locationFilters: { userLatitude, userLongitude, radiusInKm },
    });

    const { orders } = resolveUseCase(result);

    return {
      orders: orders.map(OrderPresenter.toHTTP),
    };
  }
}
