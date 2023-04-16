# SelfHosted Everything

A self-contained set of tools and infrastructure designed to interface with each other.

## Description

SelfHosted Everything is a self-contained set of tools and infrastructure designed to interface with each other. It is designed to be run on a Raspberry PI as a home server.

## Running Yourself

1. Clone the repo

```shell
$ git clone https://github.com/coderkearns/selfhosted-everything
```

2. Install dependencies using NPM (or your favorite package manager)

```shell
$ npm install
```

3. Run using the "start" script

```shell
$ npm run start
```

The start script (`www.js`) handles most shutdown signals gracefully, so you can run it with manager like `nodemon` or `pm2`.

That aside, here are some details about your specific instance's configuration and storage:
### Storage

For now, general storage exists in the `data/` folder. Global user-lists and settings live in `global.json`. Each subapp can choose to create their own separate `.json` file in the `data/` folder by "borrowing" the users in `global.json`.

In addition, some subapps require extra storage ("files").

In the future, subapps will likely be able to accept configuration. For now, everything is hardcoded.

#### `global.json`

A JSON representation would look something like this:

```json
{
    "<username>": {
        "username": "<username>",
        "settings": {}
    }
}
```

#### `files.json`

A JSON representation would look something like this:

```json
{
    "<username>": {
        "files": {
            "<name>": "<file>",
            "<name>": "<file>",
            "<name-n>": "<file-n>",
        }
    }
}
```

## Live Debugging Instructions

1. Run in inspect mode

```shell
$ node --inspect www.js
```

2. Open chrome inspector

[chrome://inspect](chrome://inspect)

3. Control using `global.app` and `global.server`

## TODO

- [X] Add file delete functionality
- [X] Add files and chat connections
- [ ] Redo notes to allow markdown/rich text/other content
- [ ] Add files and notes connections
- [ ] Dark mode? via adding user settings

## License

This project is licensed under the [MIT](https://choosealicense.com/licenses/mit/) License - see the [LICENSE](./LICENSE) file for details.
