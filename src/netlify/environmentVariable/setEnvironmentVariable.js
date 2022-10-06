import { getAccountId } from "./getAccountId.js";
import { isEnvironmentVariableDeployed } from "./isEnvironmentVariableDeployed.js";
import { netlify } from "../netlify.js";

/**
 * @param {{ siteId: string, branch: string, key: string, value: string }} options
 */
export async function setEnvironmentVariable(options) {
  const { siteId, branch, key, value } = options;

  const accountId = await getAccountId({ siteId });

  const environmentVariableIsDeployed = await isEnvironmentVariableDeployed({ key, branch, accountId, siteId });

  if (!environmentVariableIsDeployed) {
    console.log(`Setting environment variable ${key} for branch ${branch}...`);
    await netlify(
      `accounts/${accountId}/env/${key}?site_id=${siteId}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          context: "branch",
          context_parameter: branch,
          value,
        }),
      }
    );
    console.log(`Environment variable ${key} for branch ${branch} set.`);
  }
}