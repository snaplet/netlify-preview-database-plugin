import { getAccountId } from "./getAccountId.js";
import { isEnvironmentVariableDeployed } from "./isEnvironmentVariableDeployed.js";
import { netlify } from "../netlify.js";
import { getEnvironmentVariable } from "./getEnvironmentVariable.js";

/**
 * @param {{ siteId: string, branch: string, key: string }} options
 */
export async function deleteEnvironmentVariable(options) {
  const { siteId, branch, key } = options;

  const accountId = await getAccountId({ siteId });

  const environmentVariable = await getEnvironmentVariable({ accountId, siteId, key });

  const environmentVariableValue = environmentVariable?.values?.find(v => v.context === "branch" && v.context_parameter === branch);

  if (environmentVariableValue) {
    console.log(`Deleting environment variable ${key} for branch ${branch}...`);
    await netlify(
      `accounts/${accountId}/env/${key}/value/${environmentVariableValue.id}?site_id=${siteId}`,
      {
        method: "DELETE",
      }
    );
    console.log(`Environment variable ${key} for branch ${branch} deleted.`);
  }
}