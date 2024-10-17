import { html, sendMail } from "../sendMail";
import { template } from "./templates";
import { environmentConfig } from "../../config";
import { dasRequestStatus, relationships } from "../../data-list";
import { getFullName, getRequestType, getResponseType } from "../../utils";

interface Mail {
  dasApplication: DasApplication;
  dasApplicationStatus: string;
  requestType: string | undefined;
  response: string | undefined;
  dasApplicationLink: string;
  applicant?: string;
  headlineName: string;
  applicantName: string;
}

export const sendMailDasRequestFinalized = async (
  dasApplication: DasApplication
): Promise<void> =>
  await sendMail({
    to: dasApplication.headline?.email,
    bcc: "",
    subject: `Solicitud finalizada: Revisa el estado de tu trámite`,
    html: html(
      template.dasRequestFinalizedEmailTemplate,
      mapMail(dasApplication)
    ),
  });

const mapMail = (dasApplication: DasApplication): Mail => ({
  dasApplication: dasApplication,
  dasApplicationStatus: dasRequestStatus[dasApplication?.status],
  requestType: getRequestType(dasApplication?.requestType),
  response:
    dasApplication?.response && getResponseType(dasApplication?.response.type),
  dasApplicationLink: `${environmentConfig.hosting.domain}/entities/departamento-de-apoyo-social/das-requests/${dasApplication.id}/${dasApplication.requestType}/sheets`,
  applicant: dasApplication?.familiar
    ? relationships[dasApplication?.familiar.relationship]
    : relationships.headline,
  headlineName: getFullName(dasApplication?.headline, "reverse"),
  applicantName: dasApplication?.familiar
    ? getFullName(dasApplication?.familiar, "reverse")
    : "Mi persona",
});
