#!/usr/bin/env node
import { execSync, spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import process from "node:process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const PORT_ENV_KEYS = ["DEV_SERVER_PORT", "VITE_PORT", "PORT"];

function resolvePort(defaultPort = 5173) {
  for (const key of PORT_ENV_KEYS) {
    const value = process.env[key];
    if (!value) continue;
    const parsed = Number.parseInt(value, 10);
    if (!Number.isNaN(parsed) && parsed > 0 && parsed < 65536) {
      return parsed;
    }
  }
  return defaultPort;
}

function parsePidsFromOutput(output) {
  if (!output) return [];
  return output
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split(/\s+/);
      const maybePid = parts[parts.length - 1];
      const parsed = Number.parseInt(maybePid, 10);
      return Number.isNaN(parsed) ? null : parsed;
    })
    .filter((pid, index, arr) => pid !== null && arr.indexOf(pid) === index);
}

function getPidsOnPort(port) {
  const commands =
    process.platform === "win32"
      ? [
          `powershell -NoLogo -NoProfile -Command "Get-NetTCPConnection -State Listen -LocalPort ${port} | Select-Object -ExpandProperty OwningProcess -Unique"`,
          `cmd /c "netstat -ano | findstr :${port}"`
        ]
      : [`lsof -ti tcp:${port}`];

  for (const command of commands) {
    try {
      const output = execSync(command, {
        stdio: ["ignore", "pipe", "ignore"]
      })
        .toString()
        .trim();
      const pids =
        command.includes("Get-NetTCPConnection") && output
          ? output
              .split(/\r?\n/)
              .map((line) => line.trim())
              .filter(Boolean)
              .map((line) => Number.parseInt(line, 10))
              .filter((pid) => !Number.isNaN(pid))
          : parsePidsFromOutput(output);
      if (pids.length) {
        return [...new Set(pids)];
      }
    } catch {
      // ignore and try next command
    }
  }
  return [];
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function ensurePortFree(port) {
  let pids = getPidsOnPort(port);
  if (!pids.length) {
    console.log(`Port ${port} is free.`);
    return;
  }

  console.log(`Stopping ${pids.length} process(es) on port ${port}...`);
  for (const pid of pids) {
    try {
      process.kill(pid, "SIGTERM");
      console.log(`  Sent SIGTERM to PID ${pid}`);
    } catch (error) {
      console.warn(`  Failed to SIGTERM PID ${pid}: ${error.message}`);
    }
  }

  await wait(500);
  pids = getPidsOnPort(port);
  if (!pids.length) return;

  console.log(`Force stopping ${pids.length} stubborn process(es)...`);
  for (const pid of pids) {
    try {
      process.kill(pid, "SIGKILL");
      console.log(`  Sent SIGKILL to PID ${pid}`);
    } catch (error) {
      console.warn(`  Failed to SIGKILL PID ${pid}: ${error.message}`);
    }
  }

  await wait(200);
  if (getPidsOnPort(port).length) {
    console.warn(
      `Warning: port ${port} still appears busy. You might need to free it manually.`
    );
  }
}

function startDevServer(port) {
  process.chdir(repoRoot);
  const npmCommand = "npm";
  const env = {
    ...process.env,
    PORT: String(port),
    VITE_PORT: String(port),
    DEV_SERVER_PORT: String(port)
  };

  console.log(`Starting Vite dev server on port ${port}...\n`);
  const spawnOptions = {
    stdio: "inherit",
    env
  };

  if (process.platform === "win32") {
    spawnOptions.shell = true;
  }

  const child = spawn(npmCommand, ["run", "dev:serve"], spawnOptions);

  const forwardSignal = (signal) => {
    if (child.killed) return;
    child.kill(signal);
  };

  process.on("SIGINT", forwardSignal);
  process.on("SIGTERM", forwardSignal);

  child.on("exit", (code) => {
    process.exit(code ?? 0);
  });
}

async function main() {
  const port = resolvePort();
  console.log(`Ensuring port ${port} is available...`);
  await ensurePortFree(port);
  startDevServer(port);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
