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

### Using env file

This package assume that your project have an `.env.development` file to use it.
The dots-env will create an `.env` at the root of the application with the content of your `.env.*` and will inject this content on `process.env`.
So, we recommend that you add the `.env` into `.gitignore` because it will be reconstruct always that dots-env script run.

### Using other env files

To use other env files, create your `.env.staging` or `.env.production` or `.env.*`, and pass the parameter `--env` or just `-e` with the option:

```sh
dots-env -c 'node index.js' # use .env.development
dots-env -c 'node index.js' -e staging # use .env.staging
dots-env -c 'node index.js' -e production # use .env.production
dots-env -c 'node index.js' -e my_env_file # use .env.my_env_file
```

### Using custom **local** env file 

To use a local env file, just create it with `.local` on the end of filename, and pass the parameter `--local` or just `-l` 

```sh
dots-env -c 'node index.js' -l # use .env.development.local
dots-env -c 'node index.js' -e staging -l # use .env.staging.local
dots-env -c 'node index.js' -e production -l # use .env.production.local
dots-env -c 'node index.js' -e my_env_file -l # use .env.my_env_file.local
```

### Using custom env file path

If yours .env files are into another directory, you can use the `--envPath`, or just `-p` to change this:

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


## 📜 Help

```text
Usage: _ [options] <command> [...args]

Options:
  -e, --env [name]                 Set the file `.env.[fileName]` to use (default name: development)
  -l, --local [boolean]            Set the `.local` file based on `--env`
  -p, --envPath [path]             Set the path of your `.env.*` files (default path: '.')
  -c, --command [command]          REQUIRED! Set the command that will execute with the selected env. 
```


## 📋 Contributing Guide

If you would like to write tests or improve this package, please sent your PR! :D  