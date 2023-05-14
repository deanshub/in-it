export function getOrThrow(envVarName: string): string {
  const value = process.env[envVarName];
  if (value === undefined) {
    throw new Error(`Missing env var ${envVarName}`);
  }
  return value;
}
