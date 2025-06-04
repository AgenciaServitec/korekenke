import { fetchDocumentOnce } from "../firebase/utils";
import { firestore } from "../firebase";

export const useOrganizationData = () => {
  const groups = {
    department: "departments",
    entity: "entities",
    office: "offices",
    section: "sections",
  };

  const fecthOrganization = async ({ organizationId, organizationType }) =>
    await fetchDocumentOnce(
      firestore.collection(groups[organizationType]).doc(organizationId),
    );

  return { fecthOrganization };
};
