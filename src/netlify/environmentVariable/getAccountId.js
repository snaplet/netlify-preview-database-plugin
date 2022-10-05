import { netlify } from "../netlify.js";

/**
 * @param {{ siteId: string }} options
 */
export async function getAccountId(options) {
  const { siteId } = options;

  /** @type [{ account_name: string, account_slug: string }, { id: string, name: string, slug: string }[]] */
  const [{ account_name, account_slug }, accounts] = await Promise.all([netlify(`sites/${siteId}`), netlify("accounts")]);

  const account = accounts.find(account => account.name === account_name && account.slug === account_slug);

  return account.id;
}