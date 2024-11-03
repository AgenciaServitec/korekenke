import { html, sendMail } from "../sendMail";
import { template } from "./templates";

export const verifyEmailSendCode = async (
  sessionVerification: SessionVerification
): Promise<void> =>
  await sendMail({
    to: sessionVerification.email,
    bcc: "",
    subject: `${sessionVerification.verifyCode} es tu código para iniciar sesión en Korekenke`,
    html: html(
      template.verifyEmailSendCodeEmailTemplate,
      mapMail(sessionVerification)
    ),
  });

const mapMail = (
  sessionVerification: SessionVerification
): Pick<SessionVerification, "email" | "verifyCode"> => ({
  email: sessionVerification.email,
  verifyCode: sessionVerification.verifyCode,
});
