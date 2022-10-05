import { createPreviewDatabase } from "./snaplet/previewDatabase/createPreviewDatabase.js"
import { installSnapletCLI } from "./snaplet/installSnapletCLI.js";
import { setEnvironmentVariable } from "./netlify/environmentVariable/setEnvironmentVariable.js";

/**
 * @param {{
 *   utils: { run: { command: (cmd: string, options: Record<string, any>) => { stdout: string } } },
 *   inputs: { databaseCreateCommand: string, databaseUrlCommand: string, databaseUrlEnvKey: string, reset: boolean }
 * }} config
 */
export async function handleDeployPreview({
  utils: { run },
  inputs: {
    databaseCreateCommand,
    databaseUrlCommand,
    databaseUrlEnvKey,
    reset,
  },
}) {
  await installSnapletCLI({ run });

  const databaseUrl = await createPreviewDatabase({ run }, {
    databaseCreateCommand,
    databaseUrlCommand,
    reset,
  });

  await setEnvironmentVariable({
    siteId: process.env.SITE_ID,
    branch: process.env.BRANCH,
    key: databaseUrlEnvKey,
    value: databaseUrl,
  });
};
