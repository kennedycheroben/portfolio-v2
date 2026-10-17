import type { IncomingMessage, ServerResponse } from "node:http";
import { handleApiRequest } from "../src/lib/server/apiRouter";

/**
 * Standard serverless / edge function adapter.
 * Accepts standard Node.js HTTP request and response objects.
 */
export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  await handleApiRequest(req, res);
}
