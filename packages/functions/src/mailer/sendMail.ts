import mustache from "mustache";
import { createTransport } from "nodemailer";
import { environmentConfig } from "../config";
import Mail from "nodemailer/lib/mailer";

const { host, from, pass, user, port } = environmentConfig["node-mailer"];

export const sendMail = async (mailOptions: Mail.Options): Promise<void> => {
  mailOptions.from = `${from} <${user}>`;

  await createTransport({
    port,
    host,
    auth: {
      user,
      pass,
    },
  }).sendMail(mailOptions);
};

export const html = (template: string, view: unknown): string =>
  mustache.render(template, view);
