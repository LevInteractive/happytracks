const spawn = require("child_process").spawn;
const colors = require("colors");

exports.track = function track(name, cp) {
  return new Promise((resolve, reject) => {
    cp.stdout.on("data", data => log(name, data.toString()));
    cp.stderr.on("data", data => log(name, colors.red(data.toString())));
    cp.on("close", code => {
      log(name, colors.yellow(`exit code: ${code}`));
      resolve();
    });
    cp.on("error", reject);
  });
};

let _last;

function log(name, str) {
  process.stdout.write(label(name) + str);
  _last = name;
}

function label(name) {
  return name === _last ? "" : colors.bold.underline(`${name}:`) + "\n";
}
