export async function installSnapletCLI(ctx) {
  await ctx.run.command("curl -sL https://app.snaplet.dev/get-cli/ | bash", { shell: true, stdio: "ignore" });
}