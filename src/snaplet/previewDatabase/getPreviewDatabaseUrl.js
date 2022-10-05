/**
 * @param {{ run: { command: (cmd: string, options: Record<string, any>) => { stdout: string } } }} ctx
 * @param {{ databaseUrlCommand: string, branch?: string }} options
 */
export async function getPreviewDatabaseUrl(ctx, options) {
  const { databaseUrlCommand, branch } = options;

  const env = {
    PATH: `/opt/buildhome/.local/bin/:${process.env.PATH}`,
    ...(branch && { HEAD: branch }),
  };

  try {
    const { stdout: databaseUrl } = await ctx.run.command(databaseUrlCommand, { env, stdio: "pipe" });
    return databaseUrl;
  } catch (_) {
    return null;
  }
}