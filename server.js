const http = require("http");
const fs = require("fs");
const path = require("path");

const port = Number(process.env.PORT || 8001);
const publicRoot = __dirname;
const presetsRoot = path.resolve(__dirname, "presets");

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};

function sendJson(response, statusCode, data) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8"
  });
  response.end(JSON.stringify(data));
}

function ensurePresetFolder() {
  fs.mkdirSync(presetsRoot, {
    recursive: true
  });
}

function presetFileName(name) {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${slug || "preset"}.json`;
}

function presetPath(fileName) {
  const safeName = path.basename(fileName);
  return path.join(presetsRoot, safeName);
}

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;

      if (body.length > 1024 * 1024) {
        reject(new Error("Request body too large"));
        request.destroy();
      }
    });

    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

function listPresets(response) {
  ensurePresetFolder();

  const presets = fs.readdirSync(presetsRoot)
    .filter((file) => file.toLowerCase().endsWith(".json"))
    .map((file) => {
      const fullPath = presetPath(file);
      const fallbackName = path.basename(file, ".json");

      try {
        const preset = JSON.parse(fs.readFileSync(fullPath, "utf8"));
        return {
          file,
          name: preset.name || fallbackName
        };
      } catch (error) {
        return {
          file,
          name: fallbackName
        };
      }
    })
    .sort((left, right) => left.name.localeCompare(right.name));

  sendJson(response, 200, presets);
}

async function savePreset(request, response) {
  try {
    ensurePresetFolder();

    const body = await readRequestBody(request);
    const preset = JSON.parse(body);

    if (!preset || typeof preset.name !== "string" || !preset.name.trim()) {
      sendJson(response, 400, {
        error: "Preset name is required"
      });
      return;
    }

    const file = presetFileName(preset.name);
    const fullPath = presetPath(file);
    fs.writeFileSync(fullPath, JSON.stringify(preset, null, 2));

    sendJson(response, 200, {
      file,
      name: preset.name
    });
  } catch (error) {
    sendJson(response, 500, {
      error: "Preset save failed"
    });
  }
}

function loadPreset(requestUrl, response) {
  ensurePresetFolder();

  const file = decodeURIComponent(requestUrl.pathname.replace("/api/presets/", ""));

  if (!file || file.includes("/") || file.includes("\\")) {
    sendJson(response, 400, {
      error: "Invalid preset"
    });
    return;
  }

  const fullPath = presetPath(file);

  if (!fs.existsSync(fullPath)) {
    sendJson(response, 404, {
      error: "Preset not found"
    });
    return;
  }

  sendJson(response, 200, JSON.parse(fs.readFileSync(fullPath, "utf8")));
}

function serveStatic(requestUrl, response) {
  const requestedPath = requestUrl.pathname === "/"
    ? "/index.html"
    : decodeURIComponent(requestUrl.pathname);
  const fullPath = path.resolve(publicRoot, `.${requestedPath}`);

  if (!fullPath.startsWith(publicRoot)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  if (!fs.existsSync(fullPath) || fs.statSync(fullPath).isDirectory()) {
    response.writeHead(404);
    response.end("Not found");
    return;
  }

  const extension = path.extname(fullPath).toLowerCase();
  response.writeHead(200, {
    "Content-Type": mimeTypes[extension] || "application/octet-stream"
  });
  fs.createReadStream(fullPath).pipe(response);
}

const server = http.createServer((request, response) => {
  const requestUrl = new URL(request.url, `http://${request.headers.host}`);

  if (request.method === "GET" && requestUrl.pathname === "/api/presets") {
    listPresets(response);
    return;
  }

  if (request.method === "POST" && requestUrl.pathname === "/api/presets") {
    savePreset(request, response);
    return;
  }

  if (request.method === "GET" && requestUrl.pathname.startsWith("/api/presets/")) {
    loadPreset(requestUrl, response);
    return;
  }

  if (request.method === "GET") {
    serveStatic(requestUrl, response);
    return;
  }

  response.writeHead(405);
  response.end("Method not allowed");
});

ensurePresetFolder();
server.listen(port, () => {
  console.log(`Collimation Circles server running at http://localhost:${port}`);
});
