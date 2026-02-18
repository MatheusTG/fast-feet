import { UpdateOrderUseCase } from "@/domain/logistics/application/use-cases/update-order";
import { ORDER_STATUS } from "@/domain/logistics/enterprise/entities/order";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { Body, Controller, HttpCode, Param, Patch } from "@nestjs/common";
import { z } from "zod";
import { resolveUseCase } from "../../helpers/resolve-use-case";
import { ZodValidationsPipe } from "../../pipes/zod-validation-pipe";

const updateOrderBodySchema = z.object({
  deliveryAddress: z
    .object({
      street: z.string().optional(),
      number: z.string().optional(),
      complement: z.string().optional(),
      neighborhood: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zipCode: z.string().optional(),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
    })
    .optional(),
  postedAt: z.coerce.date().optional(),
  deliveredAt: z.coerce.date().nullable().optional(),
  status: z.enum(ORDER_STATUS).optional(),
});

const bodyValidationPipe = new ZodValidationsPipe(updateOrderBodySchema);

type UpdateOrderBodySchema = z.infer<typeof updateOrderBodySchema>;

@Controller("/orders/:id")
export class UpdateOrderController {
  constructor(private updateOrderUseCase: UpdateOrderUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: UpdateOrderBodySchema,
    @Param("id") orderId: string,
    @CurrentUser() user: UserPayload
  ) {
    const result = await this.updateOrderUseCase.execute({
      actorId: user?.sub,
      orderId,
      order: body,
    });

    console.log(result);

    resolveUseCase(result);
  }
}
