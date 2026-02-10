import { SimpleValueObject } from "@/core/entities/simple-value-object";

export class Cpf extends SimpleValueObject<string> {
  static create(cpf: string): Cpf | null {
    const normalizedCpf = Cpf.normalize(cpf);

    if (!Cpf.isValid(normalizedCpf)) {
      return null;
    }

    return new Cpf(normalizedCpf);
  }

  /**
   * Removes mask and keeps only digits.
   *
   * Examples:
   * "111.111.111-11" -> "11111111111"
   * "11111111111"    -> "11111111111"
   */
  private static normalize(cpf: string): string {
    return cpf.replace(/\D/g, "");
  }

  private static isValid(cpf: string): boolean {
    if (cpf.length !== 11) {
      return false;
    }

    // Blocks CPFs with repeated digits
    if (/^(\d)\1{10}$/.test(cpf)) {
      return false;
    }

    const digits = cpf.split("").map(Number);

    const calcDigit = (base: number[]) => {
      const sum = base.reduce((acc, digit, index) => acc + digit * (base.length + 1 - index), 0);

      const rest = (sum * 10) % 11;
      return rest === 10 ? 0 : rest;
    };

    const d1 = calcDigit(digits.slice(0, 9));
    const d2 = calcDigit(digits.slice(0, 10));

    return d1 === digits[9] && d2 === digits[10];
  }
}
