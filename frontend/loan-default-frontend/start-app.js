const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const BACKEND_DIR = path.resolve(__dirname, "..", "..", "backend");
const BACKEND_URL = "http://127.0.0.1:8000";
const PORT = 8000;
const REACT_SCRIPTS_JS = path.join(
  __dirname, "node_modules", "react-scripts", "bin", "react-scripts.js"
);

let backendProcess = null;

function pythonCommand() {
  return process.platform === "win32" ? "python" : "python3";
}

function portOpen(port) {
  return new Promise((resolve) => {
    const net = require("net");
    const socket = new net.Socket();
    socket.setTimeout(800);
    socket.once("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.once("error", () => resolve(false));
    socket.once("timeout", () => {
      socket.destroy();
      resolve(false);
    });
    socket.connect(port, "127.0.0.1");
  });
}

function backendHealthy() {
  const http = require("http");
  return new Promise((resolve) => {
    const req = http.get(`${BACKEND_URL}/health`, (res) => {
      res.resume();
      resolve(res.statusCode === 200);
    });
    req.on("error", () => resolve(false));
    req.setTimeout(1000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function waitForBackend(timeoutMs) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    if (await backendHealthy()) return true;
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
}

async function startBackend() {
  if (await portOpen(PORT)) {
    console.log("[start-app] Backend already running on port 8000, reusing it.");
    return;
  }

  if (!fs.existsSync(path.join(BACKEND_DIR, "main.py"))) {
    console.error("[start-app] Backend not found at", BACKEND_DIR);
    process.exit(1);
  }

  console.log("[start-app] Starting FastAPI backend...");
  backendProcess = spawn(
    pythonCommand(),
    ["-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", String(PORT)],
    { cwd: BACKEND_DIR, stdio: "inherit" }
  );

  backendProcess.on("exit", (code) => {
    if (code && code !== 0) {
      console.error(`[start-app] Backend exited with code ${code}.`);
    }
  });

  const up = await waitForBackend(30000);
  if (!up) {
    console.error("[start-app] Backend failed to start within 30s.");
    if (backendProcess) backendProcess.kill();
    process.exit(1);
  }
  console.log("[start-app] Backend is up at", BACKEND_URL);
}

function startFrontend() {
  const child = spawn(
    process.execPath,
    [REACT_SCRIPTS_JS, "start"],
    { stdio: "inherit" }
  );

  child.on("exit", (code) => {
    if (backendProcess) backendProcess.kill();
    process.exit(code ?? 0);
  });
}

(async () => {
  await startBackend();
  startFrontend();
})();