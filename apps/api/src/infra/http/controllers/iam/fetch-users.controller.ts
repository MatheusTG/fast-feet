import { FetchUsersUseCase } from "@/domain/user/application/use-cases/fetch-users";
import { USER_ROLES } from "@/domain/user/enterprise/entities/user";
import { Controller, Get, Query } from "@nestjs/common";
import { z } from "zod";
import { resolveUseCase } from "../../helpers/resolve-use-case";
import { ZodValidationsPipe } from "../../pipes/zod-validation-pipe";
import { UserPresenter } from "../../presenters/user-presenter";

const fetchusersQuerySchema = z.object({
  page: z.string().optional().default("1").transform(Number).pipe(z.number().min(1)),
  role: z.enum(USER_ROLES).optional(),
});

const queryValidationPipe = new ZodValidationsPipe(fetchusersQuerySchema);

type FetchUsersQuerySchema = z.infer<typeof fetchusersQuerySchema>;

@Controller("/users")
export class FetchUsersController {
  constructor(private fetchusersUseCase: FetchUsersUseCase) {}

  @Get()
  async handle(@Query(queryValidationPipe) query: FetchUsersQuerySchema) {
    const { page, role } = query;

    const result = await this.fetchusersUseCase.execute({
      page,
      role,
    });

    const { users } = resolveUseCase(result);

    return {
      users: users.map(UserPresenter.toHTTP),
    };
  }
}
