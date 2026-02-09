import { User, UserProps } from "../../enterprise/entities/user";
import { HashGenerator } from "../cryptography/hash-generator";
import { UserRepository } from "../repositories/user-repository";

type RegisterUseCaseRequest = Omit<UserProps, "role">;

type RegisterUseCaseResponse = {};

export class RegisterUseCase {
  constructor(
    private userRepository: UserRepository,
    private hashGenerator: HashGenerator
  ) {}

  async execute(request: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const { name, cpf, password } = request;

    const userWithSameCpf = this.userRepository.findByCpf(cpf);

    if (userWithSameCpf) {
      throw new Error("Error handling not yet completed (use-cases/register.ts).");
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const user = User.create({
      name,
      cpf,
      password: hashedPassword,
    });

    this.userRepository.create(user);

    return {
      user,
    };
  }
}
