# Netlify Preview Deployments with Snaplet Preview Databases

<p align="center">
  <img width="360" src="logo.png" alt="Snappy playing with branched databases plugged into netlify">
</p>

> Create an isolated preview database for each preview deployment in Netlify

This plugin gives you a new and isolated database for your preview deployments in Netlify. A new database is created from a Snaplet snapshot for each of your Pull Requests. Giving you realistic data to preview your upcoming feature or test migrations with ease and without side-effects.

## Usage

### 1. Install the plugin

- [UI Installation](https://docs.netlify.com/integrations/build-plugins/#ui-installation) (UI installation will run on all [deploy contexts](https://docs.netlify.com/site-deploys/overview/#deploy-contexts), but this plugin will only run where the context is set to `deploy-preview`).
- [File-based installation](https://docs.netlify.com/integrations/build-plugins/#ui-installation). Install the `@snaplet/netlify-plugin` npm package, by adding it as a dependency to your project.

### 2. Configure settings in your project repo

```toml
# netlify.toml

[[plugins]]
 package = "@snaplet/netlify-preview-database-plugin"

  [plugins.inputs]
    databaseEnvVar = "DATABASE_URL"
    databaseCreateCommand = "snaplet db create --git --latest"
    databaseUrlCommand = "snaplet db url --git"
    reset = false
```
**Note:** We check the deploy context associated with the build. You can configure your settings by deploy context.

#### Inputs (All inputs are optional)

```yaml
- name: databaseEnvVar
  description: Database environment variable name

- name: databaseCreateCommand
  description: Command used to generate the instant database

- name: databaseUrlCommand
  description: Command used to get the instant database url

- name: reset
  description: Reset the database state on each commit
```

### 3. Set environment variables

- In the [Dashboard](https://app.netlify.com/). Navigate to your site then `Site settings` > `Environment Variables`. Select `Specific scopes` and pick the `Build` option.
- [Using build environments](https://docs.netlify.com/configure-builds/file-based-configuration/#deploy-contexts), you can define them in your project.

```toml
# netlify.toml

[[plugins]]
# ...
	
  [context.deploy-preview.environment]
  SNAPLET_ACCESS_TOKEN="<YOUR_SNAPLET_ACCESS_TOKEN>"
```

#### Required Environment variables

```
NETLIFY_ACCESS_TOKEN=// API Access token found in Netlify user settings.
NETLIFY_ACCOUNT_ID=// Account ID found in team settings
SNAPLET_ACCESS_TOKEN=// CLI Access token found in Snaplet UI
SNAPLET_PROJECT_ID=// Project ID found in Snaplet project settings.
```

## How it works
<img width="1260" alt="Screenshot 2022-09-14 at 18 00 22" src="https://user-images.githubusercontent.com/39437696/190385467-0d704a59-7a89-4dba-a68b-eb8b2ca7c1fe.png">

> Netlify + Snaplet Preview Database + Snaplet Snapshots = Love.

Combining preview databases with Snaplet snapshots and Netlify preview deployments gives your team a consistent experience to evaluate your deployment's Environment Variables.

Each commit triggers a build in Netlify. Before the build starts, the plugin will create an instant database using your latest snapshot. Once the create command is done, we will inject the URL returned, into the environment variable, linked to your database (By default this variable is `DATABASE_URL`).

Once the pre-build step is executed successfully, your build will continue and a site will be deployed with the preview database.

## Additional resources

https://docs.netlify.com/integrations/build-plugins/#manage-plugin-versions
