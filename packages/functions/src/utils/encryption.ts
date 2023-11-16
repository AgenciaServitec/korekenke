import sha256 from "crypto-js/sha256";
import hmacSha256 from "crypto-js/hmac-sha256";

export const encryptSha256 = (text: string): string => sha256(text).toString();

export const encryptHmacSha256 = (message: string, secret: string): string =>
  hmacSha256(message, secret).toString();

export const encryptBase64 = (string: string): string => {
  const buffer = Buffer.from(string, "utf-8");
  return buffer.toString("base64");
};
