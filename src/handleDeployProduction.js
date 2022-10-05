import { installSnapletCLI } from "./snaplet/installSnapletCLI.js";
import { getAssociatedPullRequests } from "./github/getAssociatedPullRequests.js";
import { deletePreviewDatabase } from "./snaplet/previewDatabase/deletePreviewDatabase.js";
import { deleteEnvironmentVariable } from "./netlify/environmentVariable/deleteEnvironmentVariable.js";

/**
 * @param {{
 *   utils: { run: { command: (cmd: string, options: Record<string, any>) => { stdout: string } } },
 *   inputs: { databaseDeleteCommand: string, databaseUrlCommand: string, databaseUrlEnvKey: string }
 * }} config
 */
export async function handleDeployProduction({
  utils: { run },
  inputs: {
    databaseDeleteCommand,
    databaseUrlCommand,
    databaseUrlEnvKey,
  },
}) {
  await installSnapletCLI({ run });

  const associatedPullRequests = await getAssociatedPullRequests({ commitRef: process.env.COMMIT_REF });

  await Promise.all(associatedPullRequests.map(async (pullRequest) => {
    const branch = pullRequest.head.ref;

    await Promise.all([
      deleteEnvironmentVariable({ branch, key: databaseUrlEnvKey, siteId: process.env.SITE_ID }),
      deletePreviewDatabase({ run }, { branch, databaseDeleteCommand, databaseUrlCommand }),
    ]);
  }));
}