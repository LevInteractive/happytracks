# Happy Tracks

Make efficient CLI runners without all the bloat and dependency hell.

Basically, this will group the output of multiple processes by name so you can
better read it in your terminal. Output can be difficult to read when you have
multiple concurrent scripts running and this aims to solve that problem.

### Installation

```
npm i happytracks
```

### Use

There's only one method: `track(name, childProcess)`

```javascript
happy.track("compile-js", spawn("./build-js", []));
happy.track("compile-styles", spawn("./build-css", []));
```

For convenience, you may also run them synchronously. This would be useful for a script which must run before others (e.g. processing a graphql json file).

```javascript
happy.track("server", spawn("npm", ["run-script", "server"]));

await happy.track("compile-js", spawn("yarn", ["run", "relay"])); // <= wait until done

happy.track("server", spawn("npm", ["run-script", "server"]));
```

### Real life example

```javascript
const spawn = require("child_process").spawn;
const happy = require("happytracks");

happy.track(
  "server",
  spawn(
    "nodemon",
    [
      "-V",
      "-x",
      "node --harmony --use_strict",
      "--watch",
      `${ROOT_DIR}/src/server/`,
      "--ignore",
      "schema.json",
      "--ignore",
      "public/",
      `${ROOT_DIR}/src/server/bin/www`
    ],
    {
      env: Object.assign(
        {}, 
        {
          DEBUG: "app:*",
          NODE_PATH: `${ROOT_DIR}/src/server`,
          NODE_CONFIG_DIR: `${ROOT_DIR}/src/server/config`,
          PORT: 3000
        },
        process.env
      )
    }
  )
);

happy.track(
  "build-css",
  spawn(
    "nodemon",
    [
      path.join(__dirname, "/build-css"),
      "-x",
      "node --harmony",
      "-e",
      "styl",
      "--watch",
      `${ROOT_DIR}/src/client/stylus/`
    ],
    {
      env: Object.assign(
        {},
        {
          CLIENT_PATH: `${ROOT_DIR}/src/client`,
          SERVER_PATH: `${ROOT_DIR}/src/server`
        },
        process.env
      )
    }
  )
);

happy.track(
  "build-js",
  spawn(path.join(__dirname, "/build-js"), [], {
    env: Object.assign(
      {},
      {
        CLIENT_PATH: `${ROOT_DIR}/src/client`,
        SERVER_PATH: `${ROOT_DIR}/src/server`
      },
      process.env
    )
  })
);
```
