import path from "path";

import fetch from "node-fetch";

export const onPreBuild = async function ({
  utils: { run },
  constants,
  netlifyConfig,
  inputs: {
    databaseEnvVar = "DATABASE_URL",
    databaseCreateCommand = "snaplet db create --git --latest",
    databaseUrlCommand = "snaplet db url --git",
    reset = false,
  },
}) {
  if (process.env.CONTEXT === "deploy-preview") {
    const __dirname = path.resolve();
    const pluginPath =
      "node_modules/@snaplet/netlify-preview-database-plugin/src";

    const branch = netlifyConfig.build.environment.BRANCH;

    console.log(`Creating preview db from ${branch} branch...`);

    await run.command(path.join(__dirname, `${pluginPath}/create.sh`), {
      env: {
        DATABASE_CREATE_COMMAND: databaseCreateCommand,
        DATABASE_URL_COMMAND: databaseUrlCommand,
        DATABASE_RESET: reset,
      },
    });

    console.log("Preview db created.");

    const { stdout } = await run.command(
      path.join(__dirname, `${pluginPath}/url.sh`),
      {
        env: { DATABASE_URL_COMMAND: databaseUrlCommand },
      }
    );

    console.log(`Setting ${branch} environment variable...`);

    const resp = await fetch(
      `https://api.netlify.com/api/v1/accounts/${process.env.NETLIFY_ACCOUNT_ID}/env/${databaseEnvVar}?site_id=${constants.SITE_ID}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          context: "branch",
          context_parameter: branch,
          value: stdout,
        }),
        headers: {
          Authorization: `Bearer ${process.env.NETLIFY_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (resp.status === 200) {
      console.log(`Environment variable ${branch} set.`);
    } else {
      console.log({ resp });
    }
  }
};
