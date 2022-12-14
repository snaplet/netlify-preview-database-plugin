<div align="center">
  <h1 align="center">Netlify Preview Database Plugin</h1>
  <p align="center">Create an isolated preview database for each preview deployment in Netlify without affecting production.</p>
  <img align="center" width="480" src="logo.png" alt="you branch?">
  <br /><br />
  <a href="https://docs.snaplet.dev/guides/netlify-preview-plugin/">Guide</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://www.snaplet.dev/">Website</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://docs.snaplet.dev/">Docs</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://app.snaplet.dev/chat">Discord</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://twitter.com/_snaplet">Twitter</a>
</div>
<br />

This plugin gives you a new, isolated database with data for your preview deployments in Netlify. When a pull request is created, a new database is created and seeded with a Snaplet snapshot, giving you a database (with data) to test your branch, without affecting production.

## Usage

**Need a detailed installation guide?** View it <a href="https://docs.snaplet.dev/guides/netlify-preview-plugin/">here</a>.

### 1. Install the plugin

- [UI Installation via Netlify Integration Hub](https://www.netlify.com/integrations/snaplet/) (UI installation will run on all [deploy contexts](https://docs.netlify.com/site-deploys/overview/#deploy-contexts), but this plugin will only run where the context is set to `deploy-preview`).
- [File-based installation](https://docs.netlify.com/integrations/build-plugins/#ui-installation). Install the `@snaplet/netlify-preview-database-plugin` [npm package](https://www.npmjs.com/package/@snaplet/netlify-preview-database-plugin), by adding it as a dependency to your project.

### 2. Configure settings in your project repo

```toml
# netlify.toml

[[plugins]]
 package = "@snaplet/netlify-preview-database-plugin"
```
**Note:** We check the deploy context associated with the build. You can configure your settings by deploy context.

#### Inputs

```yaml
- name: databaseCreateCommand
  required: false
  description: Command used to create the preview database
  default: "snaplet db create --git --latest"

- name: databaseDeleteCommand
  required: false
  description: Command used to delete the preview database
  default: "snaplet db delete --git"

- name: databaseUrlCommand
  required: false
  description: Command used to get the preview database url
  default: "snaplet db url --git"

- name: databaseUrlEnvKey
  required: false
  description: Preview database environment variable key
  default: "DATABASE_URL"

- name: reset
  required: false
  description: Reset the preview database state on each commit
  default: false
```

### 3. Set environment variables

- In the [Dashboard](https://app.netlify.com/). Navigate to your site then `Site settings` > `Environment Variables`. Select `Specific scopes` and pick the `Build` option.

> Note: To enable deploy contexts for environment variables in the Netlify Dashboard. Navigate to `Netlify Labs` > `Scopes and Deploy Contexts for Environment Variables` and click the enable button.

- [Using build environments](https://docs.netlify.com/configure-builds/file-based-configuration/#deploy-contexts), you can define them in your project.

```toml
# netlify.toml

[[plugins]]
# ...

  [context.deploy-preview.environment]
  SNAPLET_ACCESS_TOKEN="<YOUR_SNAPLET_ACCESS_TOKEN>"
```

#### Required Environment variables

```bash
# Personal Access Token with "repo" scope, found in GitHub user settings
GITHUB_ACCESS_TOKEN=
# API Access token found in Netlify user settings
NETLIFY_ACCESS_TOKEN=
# CLI Access token found in Snaplet UI
SNAPLET_ACCESS_TOKEN=
# Project ID found in Snaplet project settings
SNAPLET_PROJECT_ID=
```

## How it works
<img width="800" alt="How it works" src="architecture.svg">

> Netlify + Snaplet Preview Database + Snaplet Snapshots = Love.

Combining preview databases with Snaplet snapshots and Netlify preview deployments gives your team a consistent experience to evaluate your deployment's Environment Variables.

Each commit triggers a build in Netlify. Before the build starts, the plugin will create an preview database using your latest snapshot. Once the create command is done, we will inject the URL returned, into the environment variable, linked to your database (By default this variable is `DATABASE_URL`).

Once the pre-build step is executed successfully, your build will continue and a site will be deployed with the preview database.

## Additional resources

[Detailed step-by-step guide](https://docs.snaplet.dev/guides/netlify-preview-plugin/)
[Snaplet Netlify npm package](https://www.npmjs.com/package/@snaplet/netlify-preview-database-plugin) 
[Get help via Snaplet Discord](https://app.snaplet.dev/chat)
