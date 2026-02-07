import type { FlatConfig } from "eslint";

declare module "@find-a-friend/config/eslint" {
  const config: FlatConfig[];
  export default config;
}
