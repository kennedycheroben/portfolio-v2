import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleApiRequest } from "../src/lib/server/apiRouter";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await handleApiRequest(req as any, res as any);
}
