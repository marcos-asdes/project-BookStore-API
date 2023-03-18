import { Request, Response, NextFunction } from "express";
import appLog from "./appLog.js";

export async function routeEvent(req: Request, _res: Response, next: NextFunction): Promise<void> {
  appLog('Route', `Route ${req.url} accessed with method ${req.method}`)
  next()
}