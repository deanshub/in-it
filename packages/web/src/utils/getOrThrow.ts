export function getOrThrow(envVarName: string, defaultValue?: string): string {
  const value = process.env[envVarName];
  if (value === undefined && defaultValue === undefined) {
    throw new Error(`Missing env var ${envVarName}`);
  }
  return (value ?? defaultValue) as string;
}
