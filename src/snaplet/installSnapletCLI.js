/**
 * @param {{ run: { command: (cmd: string, options: Record<string, any>) => { stdout: string } } }} ctx
 */
export async function installSnapletCLI(ctx) {
  await ctx.run.command("curl -sL https://app.snaplet.dev/get-cli/ | bash", { shell: true, stdio: "ignore" });
}