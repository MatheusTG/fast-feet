import { HashGenerator } from "@/domain/user/application/cryptography/hash-generator";

export class FakeHasher implements HashGenerator {
  async hash(plain: string): Promise<string> {
    return plain + "-hashed";
  }
}
