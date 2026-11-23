import express from "express";
import path from "path";

function getPort(): number {
  if (process.env.DEFAULT_APP_PORT) {
    return Number(process.env.DEFAULT_APP_PORT) || 3000;
  }
  if (process.env.PORT) {
    const parsed = Number(process.env.PORT);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  return 3000;
}

async function startServer() {
  const app = express();
  const PORT = getPort();

  // Start listening immediately so platform health/port probes succeed without waiting on Vite/API module graph
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  // Block public access to the accidentally shared preview URL (ais-pre-...)
  // while leaving ais-dev-... (AI Studio workspace), trickytoddlers.vercel.app, and localhost 100% active
  const DISABLED_SHARED_HOST = "ais-pre-l45mxxgh4lq2v2k6cbni3q-26432502266.asia-southeast1.run.app";
  app.use((req, res, next) => {
    if (req.method === "HEAD" || req.path === "/api/health") {
      return next();
    }
    const forwardedHost = String(req.headers["x-forwarded-host"] || "").toLowerCase();
    const directHost = String(req.headers.host || "").toLowerCase();
    const originHeader = String(req.headers.origin || "").toLowerCase();
    const refererHeader = String(req.headers.referer || "").toLowerCase();

    const isDisabledHost =
      forwardedHost.includes(DISABLED_SHARED_HOST) ||
      directHost.includes(DISABLED_SHARED_HOST) ||
      originHeader.includes(DISABLED_SHARED_HOST) ||
      refererHeader.includes(DISABLED_SHARED_HOST);

    if (isDisabledHost) {
      if (req.path.startsWith("/api")) {
        return res.status(403).json({ error: "This preview link is inactive." });
      }
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      return res
        .status(403)
        .send(
          `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Preview Link Inactive</title></head><body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#060a16;color:#f8fafc;font-family:system-ui,-apple-system,sans-serif;padding:24px;text-align:center;"><div style="max-width:440px;background:#0f172a;border:1px solid rgba(255,255,255,0.12);border-radius:20px;padding:32px;box-shadow:0 20px 50px rgba(0,0,0,0.6);"><h1 style="font-size:20px;margin:0 0 10px;color:#ffffff;">This Preview Link is Inactive</h1><p style="font-size:14px;line-height:1.6;color:#94a3b8;margin:0;">This temporary development link has been deactivated by the administrator and is no longer accessible.</p></div></body></html>`
        );
    }
    next();
  });

  const distPath = path.join(process.cwd(), "dist");
  const isDev = process.env.NODE_ENV !== "production";

  const publicPath = path.join(process.cwd(), "public");
  app.use(
    express.static(publicPath, {
      maxAge: "1d",
      setHeaders: (res, filePath) => {
        if (/\.(png|jpe?g|webp|svg|gif|ico|woff2?)$/i.test(filePath)) {
          res.setHeader("Cache-Control", "public, max-age=86400, immutable");
        }
      },
    })
  );

  // Lazy-load the heavy API router in the background
  let apiApp: express.Express | null = null;
  const apiReady = import("./src/server/api.ts")
    .then(({ createApiApp }) => {
      apiApp = createApiApp();
    })
    .catch((err) => {
      console.error("Failed to initialize API router:", err);
    });

  app.use(async (req, res, next) => {
    if (req.path.startsWith("/api")) {
      if (!apiApp) {
        await apiReady;
      }
      if (apiApp) {
        return apiApp(req, res, next);
      }
    }
    next();
  });

  if (isDev) {
    let viteMiddleware: express.RequestHandler | null = null;
    const viteReady = import("vite")
      .then(({ createServer: createViteServer }) =>
        createViteServer({
          server: {
            middlewareMode: true,
            hmr: false,
            watch: null,
          },
          appType: "spa",
        })
      )
      .then((vite) => {
        viteMiddleware = vite.middlewares;
      })
      .catch((err) => {
        console.error("Failed to initialize Vite server:", err);
      });

    app.use(async (req, res, next) => {
      if (!viteMiddleware) {
        if (req.method === "HEAD") {
          res.status(200).end();
          return;
        }
        await viteReady;
      }
      if (viteMiddleware) {
        return viteMiddleware(req, res, next);
      }
      next();
    });
  } else {
    app.use(
      express.static(distPath, {
        setHeaders: (res, filePath) => {
          if (filePath.endsWith(".html")) {
            res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
          } else if (/\.(png|jpe?g|webp|svg|gif|ico|woff2?|js|css)$/i.test(filePath)) {
            res.setHeader("Cache-Control", "public, max-age=86400, immutable");
          } else {
            res.setHeader("Cache-Control", "public, max-age=3600");
          }
        },
      })
    );
    app.get("*", (req, res) => {
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
}

startServer();
