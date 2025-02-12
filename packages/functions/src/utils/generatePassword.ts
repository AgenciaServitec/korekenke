import crypto from "crypto";

export const generatePassword = (length = 6) => {
  return crypto
    .randomBytes(length)
    .toString("base64")
    .slice(0, length)
    .replace(/[^a-zA-Z0-9]/g, "");
};
