import admin from "firebase-admin";
import { NextFunction, Request, Response } from "express";

export const validateFirebaseIdToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  const token = req.cookies.authToken;

  if (!token) {
    return res
      .status(401)
      .json({ error: "Acceso denegado. Token no proporcionado." });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (e) {
    console.error("Error al verificar el token:", e);
    return res.status(403).json({ error: "Token inválido" });
  }
};
