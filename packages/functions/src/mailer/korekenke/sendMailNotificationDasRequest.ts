import { html, sendMail } from "../sendMail";
import { template } from "./templates";
import { environmentConfig } from "../../config";
import { DasRequest, relationships } from "../../data-list";
import { getDegreesArmy, getFullName } from "../../utils";

interface Mail {
  dasApplication: DasApplication;
  requestType: string | undefined;
  institutionName: string;
  dasApplicationLink: string;
  headline?: Headline;
  familiar?: Familiar;
  headlineName: string;
  headlineDegree?: string;
  applicant?: string;
}

export const sendMailNotificationDasRequest = async (
  dasApplication: DasApplication
): Promise<void> =>
  await sendMail({
    to: environmentConfig.mailer.sendMailerNotifyDasRequest.to,
    bcc: environmentConfig.mailer.sendMailerNotifyDasRequest.bcc,
    subject: `Nueva solicitud recibida a revisar`,
    html: html(
      template.newDasApplicationEmailTemplate,
      mapMail(dasApplication)
    ),
  });

const mapMail = (dasApplication: DasApplication): Mail => ({
  dasApplication: dasApplication,
  requestType: DasRequest.find(
    (_dasRequest) => _dasRequest.id === dasApplication?.requestType
  )?.name,
  institutionName: dasApplication.institution.id,
  dasApplicationLink: `${environmentConfig.hosting.domain}/entities/departamento-de-apoyo-social/das-requests/${dasApplication.id}/${dasApplication.requestType}/sheets`,
  headline: dasApplication?.headline,
  familiar: dasApplication?.familiar,
  headlineName: getFullName(dasApplication?.headline, "reverse"),
  headlineDegree: getDegreesArmy(dasApplication?.headline?.degree),
  applicant: dasApplication?.familiar
    ? relationships[dasApplication?.familiar.relationship]
    : relationships.headline,
});
