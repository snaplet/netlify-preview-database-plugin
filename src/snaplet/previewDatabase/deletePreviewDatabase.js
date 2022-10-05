import { getPreviewDatabaseUrl } from "./getPreviewDatabaseUrl.js";

/**
 * @param {{ run: { command: (cmd: string, options: Record<string, any>) => { stdout: string } } }} ctx
 * @param {{ databaseDeleteCommand: string, databaseUrlCommand: string, branch: string }} options
 */
export async function deletePreviewDatabase(ctx, options) {
  const { databaseDeleteCommand, databaseUrlCommand, branch } = options;

  let databaseUrl = await getPreviewDatabaseUrl(ctx, { databaseUrlCommand, branch });

  const previewDatabaseIsDeployed = Boolean(databaseUrl);

  if (previewDatabaseIsDeployed) {
    console.log(`Deleting the preview database for branch ${branch}...`);

    const env = { PATH: `/opt/buildhome/.local/bin/:${process.env.PATH}`, HEAD: branch };
    await ctx.run.command(databaseDeleteCommand, { env });

    console.log(`Preview database for branch ${branch} deleted`);
  }
}