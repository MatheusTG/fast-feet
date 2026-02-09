import { RegisterUseCase } from "@/domain/user/application/use-cases/register";
import { USER_ROLES } from "@/domain/user/enterprise/entities/user";
import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { z } from "zod";
import { resolveUseCase } from "../helpers/resolve-use-case";
import { ZodValidationsPipe } from "../pipes/zod-validation-pipe";

const registerBodySchema = z.object({
  cpf: z.string().regex(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/),
  name: z.string(),
  password: z.string().min(6),
  role: z.enum(USER_ROLES).optional(),
});

const bodyValidationPipe = new ZodValidationsPipe(registerBodySchema);

type RegisterBodySchema = z.infer<typeof registerBodySchema>;

@Controller("/sessions")
export class RegisterController {
  constructor(private registerUseCase: RegisterUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(@Body(bodyValidationPipe) body: RegisterBodySchema) {
    const { cpf, name, password } = body;

    const result = await this.registerUseCase.execute({
      cpf,
      name,
      password,
    });

    resolveUseCase(result);
  }
}
