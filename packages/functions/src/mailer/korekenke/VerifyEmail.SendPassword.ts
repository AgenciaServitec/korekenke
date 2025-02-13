import { html, sendMail } from "../sendMail";
import { template } from "./templates";

interface MapMailProps {
  email: string;
  password: string;
}

export const verifyEmailSendPassword = async (
  user: User,
  password: string
): Promise<void> =>
  await sendMail({
    to: user.email,
    bcc: "",
    subject: `Contraseña para iniciar sesión en Korekenke`,
    html: html(
      template.verifyEmailSendPasswordEmailTemplate,
      mapMail(user, password)
    ),
  });

const mapMail = (user: User, password: string): MapMailProps => ({
  email: user.email,
  password,
});
