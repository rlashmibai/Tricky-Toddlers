import type { IncomingMessage, ServerResponse } from "http";
import { createApiApp } from "../src/server/api.ts";

const app = createApiApp();

export default function handler(req: IncomingMessage, res: ServerResponse) {
  return app(req as any, res as any);
}
