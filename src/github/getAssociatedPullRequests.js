import { github } from "./github.js";

/**
 * @param {{ commitRef: string }} options
 */
export async function getAssociatedPullRequests(options) {
  /** @type {{ head: { ref: string }}[]} */
  const associatedPullRequests = await github(`commits/${options.commitRef}/pulls`);

  return associatedPullRequests;
}