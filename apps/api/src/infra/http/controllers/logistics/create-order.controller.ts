import { CreateOrderUseCase } from "@/domain/logistics/application/use-cases/create-order";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { z } from "zod";
import { resolveUseCase } from "../../helpers/resolve-use-case";
import { ZodValidationsPipe } from "../../pipes/zod-validation-pipe";

const createOrderBodySchema = z.object({
  recipientId: z.string(),
  deliveryAddress: z.object({
    street: z.string(),
    number: z.string(),
    complement: z.string().optional(),
    neighborhood: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
  }),
  postedAt: z.coerce.date().optional(),
});

const bodyValidationPipe = new ZodValidationsPipe(createOrderBodySchema);

type CreateOrderBodySchema = z.infer<typeof createOrderBodySchema>;

@Controller("/orders")
export class CreateOrderController {
  constructor(private createOrderUseCase: CreateOrderUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: CreateOrderBodySchema,
    @CurrentUser() user: UserPayload
  ) {
    const result = await this.createOrderUseCase.execute({
      actorId: user?.sub,
      order: body,
    });

    const { order } = resolveUseCase(result);

    return { id: order.id.toString() };
  }
}
