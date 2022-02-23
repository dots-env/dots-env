# dots-env

A simple node program for executing commands using an environment from **any** env file.

## 💾 Install

`npm install dots-env --save-dev` or `yarn add dots-env -D`

## ⌨️ Basic Usage

**Create your `.env.development` file as:**

```text
# This is a comment
ENV1=THANKS
ENV2=FOR ALL
ENV3=THE FISH
```

**Package.json**

```json
{
  "scripts": {
    "start": "dots-env -c 'node index.js'"
  }
}
```

**Terminal**

```sh
./node_modules/.bin/dots-env -c "node index.js"
```

### Examples
- Using dots-env with [Create React App](https://github.com/dots-env/react-example)
- Using dots-env with [Create Next App](https://github.com/dots-env/next-example)

### Ignoring .env

Change your .env section from .gitignore to: 

```
# env files
.env
.env.*.local
```

### Using env file

This package assume that your project have an `.env.development` file to use it.
The dots-env will create an `.env` at the root of the application with the content of your `.env.*` and it will inject the content on `process.env`.
So, we recommend that you add the `.env` into `.gitignore` because it will be reconstruct always that dots-env script run.

### Using other env files

To use other env files, create your `.env.staging` or `.env.production` or `.env.*`, and pass the argument `--env` or just `-e` with the option:

```sh
dots-env -c 'node index.js' # use .env.development
dots-env -c 'node index.js' -e staging # use .env.staging
dots-env -c 'node index.js' -e production # use .env.production
dots-env -c 'node index.js' -e my_env_file # use .env.my_env_file
```

### Using custom **local** env file 

To use a local env file, just create it with `.local` on the end of filename, and pass the argument `--local` or just `-l` 

```sh
dots-env -c 'node index.js' -l # use .env.development.local
dots-env -c 'node index.js' -e staging -l # use .env.staging.local
dots-env -c 'node index.js' -e production -l # use .env.production.local
dots-env -c 'node index.js' -e my_env_file -l # use .env.my_env_file.local
```

### Using custom env file path

If yours .env files are into another directory, you can use the argument `--envPath`, or just `-p` to change this:

```sh
# - envs/
#   - .env.development
#   - .env.staging
#   - .env.production
#   - .env.my_env_file
# - index.js

dots-env -p './envs/' -c 'node index.js'  # use ./envs/.env.development
dots-env -p './envs/' -c 'node index.js' -e staging  # use /envs/.env.staging
dots-env -p './envs/' -c 'node index.js' -e production  # use /envs/.env.production
dots-env -p './envs/' -c 'node index.js' -e my_env_file  # use /envs/.env.my_env_file
```

## Programmatically

You can use the dots-env on your node script like this:

```js
// start.js
const { processEnv, execCommand } = require('dots-env')

processEnv({
  // local: false,
  // env: 'development',
  // destinationPath: '',
  envPath: './envs/'
}).then(() => {
  execCommand('yarn start')
})

```

If you do not pass some parameters to `processEnv`, you can set the values of this missing arguments by cli when executing your script. Example:
```sh
node start.js -e staging -l
```

#### processEnv

This script will do all magic and return a promise that will be resolved when .env file was created. This promise return an object with:
```
{
  envName, // environment name
  envFile, // .env[envName]
  originalEnvPath, // path of .env[envName]
  destinationEnvPath, // path of .env created by dots-env
  local, // boolean flag
  getEnvValues, // function that return an object with env values
  reloadEnvValues, // function to reload process.env
}
```

#### execCommand
This method are a promise that execute one shell script with the env selected.


## Setting default configs

You can set custom configs to your project creating the `dots-env.config.js` file on root of your project and export your default configurations as a object. You are able to overwrite the configurations when you invoke CLI or call the `processEnv` method.

```js
// dots-env.config.js
module.exports = {
  env: 'development',
  local: false,
  envPath: '.',
  destinationPath: '.'
}
```


## 📜 Help

```text
Usage: _ [options] <command> [...args]

Arguments:
  -e, --env [envName]              Set the file `.env.[envName]` to use (default envName: development)
  -l, --local [boolean]            Set the `.local` file based on `--env`
  -p, --envPath [path]             Set the path of your `.env.*` files (default path: '.')
  -d, --destinationPath [path]     Set the path that `.env` will be created (default path: '.')
  -c, --command [command]          REQUIRED! Set the command that will execute with the selected env. 
```

## 📋 Contributing Guide

If you would like to write types, tests or improve this package, please sent your PR! :D  
