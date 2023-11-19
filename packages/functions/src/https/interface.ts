import { Request } from "firebase-functions/lib/common/providers/https";
import * as express from "express";

export type OnRequest = (
  req: Request,
  res: express.Response
) => void | Promise<void>;
