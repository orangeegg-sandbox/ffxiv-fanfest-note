import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
};

export function createServer({ base = "/", directory = root } = {}) {
  if (!base.startsWith("/") || !base.endsWith("/"))
    throw new Error("base must begin and end with /");
  return http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, "http://localhost");
      const pathname = decodeURIComponent(url.pathname);
      if (!pathname.startsWith(base) || !["GET", "HEAD"].includes(req.method)) {
        res.writeHead(404);
        res.end("Not found");
        return;
      }
      const relative = pathname.slice(base.length) || "index.html";
      const file = path.resolve(directory, relative);
      if (
        !file.startsWith(directory + path.sep) ||
        relative.split("/").some((p) => p.startsWith("."))
      ) {
        res.writeHead(404);
        res.end("Not found");
        return;
      }
      if (!(await stat(file)).isFile()) {
        res.writeHead(404);
        res.end("Not found");
        return;
      }
      res.writeHead(200, {
        "Content-Type": types[path.extname(file)] || "application/octet-stream",
        "Cache-Control": "no-cache",
        "X-Content-Type-Options": "nosniff",
      });
      res.end(req.method === "HEAD" ? undefined : await readFile(file));
    } catch {
      res.writeHead(404);
      res.end("Not found");
    }
  });
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const port = Number(process.env.PORT || 4173);
  const base = process.env.BASE_PATH || "/";
  createServer({ base }).listen(port, "0.0.0.0", () =>
    console.log(`Static guide server listening on port ${port}, base ${base}`),
  );
}
