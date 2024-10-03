import { html, sendMail } from "../sendMail";
import { template } from "./templates";
import { environmentConfig } from "../../config";

interface Mail {
  dasApplication: DasApplication;
  dasApplicationLink: string;
}

export const sendMailDasRequestNotification = async (
  dasApplication: DasApplication
): Promise<void> =>
  await sendMail({
    to: "galafloresangelemilio@gmail.com",
    bcc: "",
    subject: `Test`,
    html: html(
      template.newDasApplicationEmailTemplate,
      mapMail(dasApplication)
    ),
  });

const mapMail = (dasApplication: DasApplication): Mail => ({
  dasApplication: dasApplication,
  dasApplicationLink: `${environmentConfig.hosting.domain}/entities/departamento-de-apoyo-social/das-requests/${dasApplication.id}/${dasApplication.requestType}/sheets`,
});
