import { FetchRecipientsUseCase } from "@/domain/logistics/application/use-cases/fetch-recipients";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { Controller, Get, Query } from "@nestjs/common";
import { z } from "zod";
import { resolveUseCase } from "../../helpers/resolve-use-case";
import { ZodValidationsPipe } from "../../pipes/zod-validation-pipe";
import { RecipientPresenter } from "../../presenters/recipient-presenter";

const fetchrecipientsQuerySchema = z.object({
  page: z.string().optional().default("1").transform(Number).pipe(z.number().min(1)),
  name: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  isProblematic: z.boolean().optional().default(false),
  createdAfter: z.date().optional(),
  createdBefore: z.date().optional(),
});

const queryValidationPipe = new ZodValidationsPipe(fetchrecipientsQuerySchema);

type FetchRecipientsQuerySchema = z.infer<typeof fetchrecipientsQuerySchema>;

@Controller("/recipients")
export class FetchRecipientsController {
  constructor(private fetchrecipientsUseCase: FetchRecipientsUseCase) {}

  @Get()
  async handle(
    @Query(queryValidationPipe) query: FetchRecipientsQuerySchema,
    @CurrentUser() user: UserPayload
  ) {
    const { page, ...filters } = query;

    const result = await this.fetchrecipientsUseCase.execute({
      actorId: user?.sub,
      filters,
      page,
    });

    const { recipients } = resolveUseCase(result);

    return {
      recipients: recipients.map(RecipientPresenter.toHTTP),
    };
  }
}
