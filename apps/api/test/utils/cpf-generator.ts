export function cpfGenerator(): string {
  const digits = Array.from({ length: 9 }, () => Math.floor(Math.random() * 9));

  const calcDigit = (base: number[]) => {
    const sum = base.reduce((acc, digit, index) => acc + digit * (base.length + 1 - index), 0);
    const rest = (sum * 10) % 11;
    return rest === 10 ? 0 : rest;
  };

  const d1 = calcDigit(digits);
  const d2 = calcDigit([...digits, d1]);

  return [...digits, d1, d2].join("");
}
