import { NextFunction, Request, Response } from "express";
import { getPersonDataByDni } from "../../client-api/api-peru-devs";

interface Params {
  dni: string;
}

export const getEntityDataByDni = async (
  req: Request<Params, unknown, unknown, unknown>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const {
    params: { dni },
  } = req;

  console.log("「Get entity data」Initialize", dni, {
    params: req.params,
  });

  try {
    const entityData = await getPersonDataByDni({ dni });

    res.send(entityData).end();
  } catch (error) {
    console.error(error);
    next(error);
  }
};
