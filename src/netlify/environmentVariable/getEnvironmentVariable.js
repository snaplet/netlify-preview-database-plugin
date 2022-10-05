import { netlify } from "../netlify.js";

/**
 * @param {{ accountId: string, siteId: string, key: string }} options
 * @returns {Promise<{ values: { id: string, context: string, context_parameter?: string }[]} | null>}
 */
export async function getEnvironmentVariable(options) {
  const { accountId, siteId, key } = options;

  try {
    /** @type {{ values: { id: string, context: string, context_parameter?: string }[]}} */
    const environmentVariable = await netlify(`accounts/${accountId}/env/${key}?site_id=${siteId}`);

    return environmentVariable;
  } catch (_) {
    return null;
  }
}