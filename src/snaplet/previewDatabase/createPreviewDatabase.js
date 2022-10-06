import { getPreviewDatabaseUrl } from "./getPreviewDatabaseUrl.js";

/**
 * @param {{ run: { command: (cmd: string, options: Record<string, any>) => { stdout: string } } }} ctx
 * @param {{ databaseCreateCommand: string, databaseUrlCommand: string, reset: boolean }} options
 * @returns {Promise<string>}
 */
export async function createPreviewDatabase(ctx, options) {
  const { databaseCreateCommand, databaseUrlCommand, reset } = options;

  let databaseUrl = await getPreviewDatabaseUrl(ctx, { databaseUrlCommand });

  const previewDatabaseIsDeployed = Boolean(databaseUrl);

  if (!previewDatabaseIsDeployed) {
    console.log("Creating a preview database...");
    await ctx.run.command(databaseCreateCommand, { env: { PATH: `/opt/buildhome/.local/bin/:${process.env.PATH}` } });
    console.log("Preview database created");
    databaseUrl = await getPreviewDatabaseUrl(ctx, { databaseUrlCommand });
  }

  if (previewDatabaseIsDeployed && reset) {
    console.log("Resetting the preview database state...");
    await ctx.run.command(`${databaseCreateCommand} --force`, { env: { PATH: `/opt/buildhome/.local/bin/:${process.env.PATH}` } });
    console.log("Preview database state reset");
  }

  return databaseUrl;
}