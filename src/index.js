import { createPreviewDatabase } from "./createPreviewDatabase.js"
import { installSnapletCLI } from "./installSnapletCLI.js";
import { setEnvironmentVariable } from "./setEnvironmentVariable.js";

const DEFAULT_INPUTS = {
  databaseEnvVar: "DATABASE_URL",
  databaseCreateCommand: "snaplet db create --git --latest",
  databaseUrlCommand: "snaplet db url --git",
  reset: false,
};

export async function onPreBuild({
  utils: { run },
  constants,
  netlifyConfig,
  inputs,
}) {
  const {
    databaseEnvVar,
    databaseCreateCommand,
    databaseUrlCommand,
    reset,
  } = { ...DEFAULT_INPUTS, ...inputs };

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
