import { html, sendMail } from "../sendMail";
import { template } from "./templates";

export const verifyEmailSendCode = async (
  sessionVerification: SessionVerification
): Promise<void> =>
  await sendMail({
    to: sessionVerification.email,
    bcc: "",
    subject: "Código de verificación por Email",
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
