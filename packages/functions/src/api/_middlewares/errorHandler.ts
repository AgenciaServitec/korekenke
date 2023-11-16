import { ErrorRequestHandler, Request } from "express";
import { logger } from "../../utils";
import { isString } from "lodash";
import { ApiError412 } from "../_utils";

export const errorHandler: ErrorRequestHandler = (
  error,
  req,
  res,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next // next is required to detect "ErrorRequestHandler"
): void => {
  const errorHandler = new ErrorHandler(error, req);
  logger.warn(routePath(req), {
    body: req.body,
    query: req.query,
    params: req.params,
    headers: req.headers,
  });

  if (error instanceof ApiError412) {
    logger.warn(errorHandler);

    res.status(412).send(error.apiError).send();
  } else {
    logger.error(errorHandler);

    res.status(500).end();
  }
};

const routePath = ({ route, path }: Request): string => {
  const routePath = route.path;

  if (!isString(routePath) || routePath === "/") return path;

  const routePaths = routePath.slice(1).split("/");
  const paths = path.slice(1).split("/");

  return `/${paths
    .slice(0, paths.length - routePaths.length)
    .concat(routePaths)
    .join("/")}`;
};

class ErrorHandler extends Error {
  request: Record<string, unknown>;

  constructor(error: Error, req: Request) {
    super();

    const { originalUrl, path, method } = req;

    this.stack = `${routePath(req)} | ${error.stack}`;
    this.request = { method, originalUrl, path };
  }
}
