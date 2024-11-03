import { html, sendMail } from "../sendMail";
import { template } from "./templates";
import { getFullName } from "../../utils";
import assert from "assert";

interface Mail {
  user: User;
  userName: string;
  verifyCode: string;
}

export const sendMailSendcodeEmail = async (
  user: User,
  generatedCode: string
): Promise<void> => {
  const email = user?.email;
  assert(email, "Missing email!");

  await sendMail({
    to: email,
    bcc: "",
    subject: `Código de Verificación para Tu Inicio de Sesión [Korekenke]`,
    html: html(template.sendCodeEmailTemplate, mapMail(user, generatedCode)),
  });
};

const mapMail = (user: User, generatedCode: string): Mail => ({
  user: user,
  userName: getFullName(user, "reverse"),
  verifyCode: generatedCode,
});
