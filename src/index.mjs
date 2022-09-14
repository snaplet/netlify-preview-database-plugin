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

    const branch = netlifyConfig.build.environment.BRANCH;

    console.log(`Creating instant db from ${branch} branch...`);

    const { stdout } = await run.command(
      path.join(__dirname, "/plugin/snaplet.sh"),
      {
        env: {
          DATABASE_CREATE_COMMAND: databaseCreateCommand,
          DATABASE_URL_COMMAND: databaseUrlCommand,
          DATABASE_RESET: reset,
        },
      }
    );

    console.log("Instant db created.");

    console.log("Setting DATABASE_URL environment variable...");

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
      console.log("Environment variable DATABASE_URL set.\n");
    } else {
      console.log({ resp });
    }
  }
};

export const onError = async ({
  utils: { run },
  inputs: {
    databaseCreateCommand = "snaplet db create --git --latest",
    databaseDeleteCommand = "snaplet db delete --git",
  },
}) => {
  if (process.env.CONTEXT === "deploy-preview") {
    const __dirname = path.resolve();

    await run.command(path.join(__dirname, "/plugin/delete.sh"), {
      env: {
        DATABASE_DELETE_COMMAND: databaseDeleteCommand,
        DATABASE_CREATE_COMMAND: databaseCreateCommand,
      },
    });
  }
};
