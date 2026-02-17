import { UpdateRecipientUseCase } from "@/domain/logistics/application/use-cases/update-recipient";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { Body, Controller, HttpCode, Param, Patch } from "@nestjs/common";
import { z } from "zod";
import { resolveUseCase } from "../../helpers/resolve-use-case";
import { ZodValidationsPipe } from "../../pipes/zod-validation-pipe";

const updateRecipientBodySchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  email: z.email().optional(),
  address: z
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
  deliveryInstructions: z.string().optional(),
  isProblematic: z.boolean().optional(),
});

const bodyValidationPipe = new ZodValidationsPipe(updateRecipientBodySchema);

type UpdateRecipientBodySchema = z.infer<typeof updateRecipientBodySchema>;

@Controller("/recipients/:id")
export class UpdateRecipientController {
  constructor(private updaterecipientUseCase: UpdateRecipientUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: UpdateRecipientBodySchema,
    @Param("id") recipientId: string,
    @CurrentUser() user: UserPayload
  ) {
    const result = await this.updaterecipientUseCase.execute({
      actorId: user?.sub,
      recipientId,
      recipient: body,
    });

    resolveUseCase(result);
  }
}
