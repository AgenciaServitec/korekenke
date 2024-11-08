import { html, sendMail } from "../sendMail";
import { template } from "./templates";
import { getFullName, getResponseType } from "../../utils";
import { militaryServiceRecruitmentStatus } from "../../data-list";

interface Mail {
  militaryRecruitment: MilitaryRecruiment;
  militaryRecruitmentName: string;
  militaryRecruitmentStatus: string;
  response: string | undefined;
}

export const sendMailMilitaryServiceRecruitmentFinalized = async (
  militaryRecruitment: MilitaryRecruiment
): Promise<void> => {
  await sendMail({
    to: militaryRecruitment?.email,
    bcc: "",
    subject: `Solicitud finalizada: Revisa el estado de tu trámite`,
    html: html(
      template.militaryServiceRecruitmentFinalizedEmailTemplate,
      mapMail(militaryRecruitment)
    ),
  });
};

const mapMail = (militaryRecruitment: MilitaryRecruiment): Mail => ({
  militaryRecruitment: militaryRecruitment,
  militaryRecruitmentName: getFullName(militaryRecruitment, "reverse"),
  militaryRecruitmentStatus:
    militaryServiceRecruitmentStatus[militaryRecruitment.status],
  response:
    militaryRecruitment?.response &&
    getResponseType(militaryRecruitment?.response.type),
});
