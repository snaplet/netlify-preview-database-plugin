export async function getPreviewDatabaseUrl(ctx, options) {
  const { databaseUrlCommand } = options;

  const { stdout: databaseUrl } = await ctx.run.command(databaseUrlCommand, { env: { PATH: `/opt/buildhome/.local/bin/:${process.env.PATH}` } });

  return databaseUrl;
}