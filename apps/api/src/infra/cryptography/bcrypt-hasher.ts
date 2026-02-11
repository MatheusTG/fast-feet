import { HashGenerator } from "@/domain/user/application/cryptography/hash-generator";
import { Injectable } from "@nestjs/common";
import { compare, hash } from "bcryptjs";
import { EnvService } from "../env/env.service";

@Injectable()
export class BcryptHasher implements HashGenerator {
  constructor(private envService: EnvService) {}

  hash(plain: string): Promise<string> {
    return hash(plain, this.envService.get("HASH_SALT_ROUNDS"));
  }

  compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash);
  }
}
