export function validateAndGetEnvVars<K extends string>(envVarKeys: K[]) {
  const envVars: Record<K, string> = {} as Record<K, string>;
  const errors: string[] = [];

  envVarKeys.forEach((envVar) => {
    const value = process.env[envVar];
    if (typeof value === 'undefined' || (typeof value === 'string' && value === '')) {
      errors.push(envVar);
    }
    envVars[envVar] = value!;
  });

  return { envVars, errors };
}
