import { handleDeployPreview } from "./handleDeployPreview.js";
import { handleDeployProduction } from "./handleDeployProduction.js";

/**
 * @param {{
 *   utils: { run: { command: (cmd: string, options: Record<string, any>) => { stdout: string } } },
 *   inputs: { databaseCreateCommand: string, databaseDeleteCommand: string, databaseUrlCommand: string, databaseUrlEnvKey: string, reset: boolean }
 * }} config
 */
export async function onPreBuild(config) {
  switch (process.env.CONTEXT) {
    case "deploy-preview":
      await handleDeployPreview(config);
      break;
    case "production":
      try {
        await handleDeployProduction(config);
      } catch (e) {
        // We don't want the production build to fail because of resources clean up
        console.error(`Failed to clean up resources for this commit`);
        console.error(e);
      }
      break;
    default:
  }
};
