import { html, sendMail } from "../sendMail";
import { template } from "./templates";

interface MapMailProps
  extends Pick<SessionVerification, "email" | "verifyCode"> {
  password: string;
}

export const verifyEmailSendCode = async (
  sessionVerification: SessionVerification,
  password: string
): Promise<void> =>
  await sendMail({
    to: sessionVerification.email,
    bcc: "",
    subject: `Código y contraseña para iniciar sesión en Korekenke`,
    html: html(
      template.verifyEmailSendCodeEmailTemplate,
      mapMail(sessionVerification, password)
    ),
  });

const mapMail = (
  sessionVerification: SessionVerification,
  password: string
): MapMailProps => ({
  email: sessionVerification.email,
  verifyCode: sessionVerification.verifyCode,
  password,
});
