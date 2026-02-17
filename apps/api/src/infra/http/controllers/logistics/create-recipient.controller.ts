import { CreateRecipientUseCase } from "@/domain/logistics/application/use-cases/create-recipient";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { z } from "zod";
import { resolveUseCase } from "../../helpers/resolve-use-case";
import { ZodValidationsPipe } from "../../pipes/zod-validation-pipe";

const createRecipientBodySchema = z.object({
  name: z.string(),
  phone: z.string(),
  email: z.email(),
  address: z.object({
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
  deliveryInstructions: z.string().optional(),
  isProblematic: z.boolean().optional(),
});

const bodyValidationPipe = new ZodValidationsPipe(createRecipientBodySchema);

type CreateRecipientBodySchema = z.infer<typeof createRecipientBodySchema>;

@Controller("/recipients")
export class CreateRecipientController {
  constructor(private createrecipientUseCase: CreateRecipientUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: CreateRecipientBodySchema,
    @CurrentUser() user: UserPayload
  ) {
    const result = await this.createrecipientUseCase.execute({
      actorId: user?.sub,
      recipient: body,
    });

    const { recipient } = resolveUseCase(result);

    return { id: recipient.id.toString() };
  }
}
