import { spawn } from "node:child_process";
import process from "node:process";

const command = process.platform === "win32" ? "cmd.exe" : "npm";
const prefix = process.platform === "win32" ? ["/d", "/s", "/c", "npm"] : ["npm"];

function start(args) {
  const commandArgs = process.platform === "win32" ? [...prefix, ...args] : args;
  return spawn(command, commandArgs, { stdio: "inherit" });
}

const frontend = start(["run", "dev:frontend"]);
const backend = start(["run", "dev:backend"]);

function stop() {
  if (!frontend.killed) frontend.kill();
  if (!backend.killed) backend.kill();
}

process.on("SIGINT", stop);
process.on("SIGTERM", stop);
process.on("exit", stop);

frontend.on("exit", code => {
  if (code && code !== 130) backend.kill();
});

backend.on("exit", code => {
  if (code && code !== 130) frontend.kill();
});
