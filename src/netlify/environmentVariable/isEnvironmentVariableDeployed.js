import { getEnvironmentVariable } from "./getEnvironmentVariable.js";

/**
 * @param {{ accountId: string, siteId: string, key: string, branch: string }} options
 */
export async function isEnvironmentVariableDeployed(options) {
  const { accountId, siteId, key, branch } = options;

  let environmentVariableIsDeployed = false;

  const environmentVariable = await getEnvironmentVariable({ accountId, siteId, key });

  if (environmentVariable) {
    environmentVariableIsDeployed = environmentVariable.values.some(v => v.context === "branch" && v.context_parameter === branch);
  }

  return environmentVariableIsDeployed;
}