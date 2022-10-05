import { createPreviewDatabase } from "./createPreviewDatabase.js"
import { installSnapletCLI } from "./installSnapletCLI.js";
import { setEnvironmentVariable } from "./setEnvironmentVariable.js";

export async function onPreBuild({
  utils: { run },
  constants,
  netlifyConfig,
  inputs: {
    databaseEnvVar,
    databaseCreateCommand,
    databaseUrlCommand,
    reset,
  },
}) {
  if (process.env.CONTEXT === "deploy-preview") {
    await installSnapletCLI({ run });

    const databaseUrl = await createPreviewDatabase({ run }, {
      databaseCreateCommand,
      databaseUrlCommand,
      reset,
    });

    await setEnvironmentVariable({
      siteId: constants.SITE_ID,
      branch: netlifyConfig.build.environment.BRANCH,
      key: databaseEnvVar,
      value: databaseUrl,
    });
  }
};
