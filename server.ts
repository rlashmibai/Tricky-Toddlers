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
