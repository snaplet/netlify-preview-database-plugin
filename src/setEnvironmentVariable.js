import { netlify } from "./netlify.js";

async function getAccountId(options) {
  const { siteId } = options;

  const [{ account_name, account_slug }, accounts] = await Promise.all([netlify(`sites/${siteId}`), netlify("accounts")]);

  const account = accounts.find(account => account.name === account_name && account.slug === account_slug);

  return account.id;
}

async function isEnvironmentVariableDeployed(options) {
  const { accountId, siteId, key, branch } = options;

  let environmentVariableIsDeployed = false;

  try {
    const environmentVariable = await netlify(`accounts/${accountId}/env/${key}?site_id=${siteId}`);
    environmentVariableIsDeployed = environmentVariable.values.some(v => v.context === "branch" && v.context_parameter === branch);
  } catch (_) { }

  return environmentVariableIsDeployed;
}

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