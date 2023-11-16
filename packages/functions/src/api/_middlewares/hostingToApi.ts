import { Handler } from "express";

export const hostingToApi: Handler = (req, res, next) => {
  if (req.url.startsWith("/api/")) {
    req.url = req.url.replace("/api", "");
  }

  next();
};
