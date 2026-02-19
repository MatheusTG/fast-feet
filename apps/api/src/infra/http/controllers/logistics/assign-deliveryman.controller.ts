import { AssignDeliverymanToOrderUseCase } from "@/domain/logistics/application/use-cases/assign-deliveryman-to-order";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { Body, Controller, HttpCode, Param, Patch } from "@nestjs/common";
import { z } from "zod";
import { resolveUseCase } from "../../helpers/resolve-use-case";
import { ZodValidationsPipe } from "../../pipes/zod-validation-pipe";

const bodySchema = z.object({
  deliverymanId: z.uuid(),
});

const bodyValidation = new ZodValidationsPipe(bodySchema);
type BodySchema = z.infer<typeof bodySchema>;

@Controller("/orders/:orderId/assign")
export class AssignDeliverymanController {
  constructor(private assignDeliverymanToOrderUseCase: AssignDeliverymanToOrderUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Param("orderId") orderId: string,
    @Body(bodyValidation) body: BodySchema,
    @CurrentUser() user: UserPayload
  ) {
    const result = await this.assignDeliverymanToOrderUseCase.execute({
      actorId: user.sub,
      orderId,
      deliverymanId: body.deliverymanId,
    });

    resolveUseCase(result);
  }
}
