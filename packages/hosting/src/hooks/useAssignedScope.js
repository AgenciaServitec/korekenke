import { firestore } from "../firebase";
import { fetchDocumentOnce } from "../firebase/utils";

const groups = {
  entity: "entities",
  department: "departments",
  unit: "units",
  office: "offices",
  section: "sections",
};

export const useAssignedScope = () => {
  const fetchOrganization = async (organizationId, organizationType) => {
    if (!organizationId && !organizationType) return;

    const mainDocRef = firestore
      .collection(groups[organizationType])
      .doc(organizationId);

    const mainData = await fetchDocumentOnce(mainDocRef);

    if (!mainData) return null;

    const relatedIds = {
      entity: mainData.entityId,
      department: mainData.departmentId,
      unit: mainData.unitId,
      office: mainData.officeId,
      section: mainData.sectionId,
    };

    const structure = {
      [organizationType]: mainData,
    };

    const fetchPromises = Object.entries(relatedIds)
      .filter(([_, id]) => typeof id === "string" && id.trim() !== "")
      .map(async ([type, id]) => {
        const docRef = firestore.collection(groups[type]).doc(id);
        const data = await fetchDocumentOnce(docRef);
        return [type, data];
      });

    const results = await Promise.all(fetchPromises);

    for (const [type, data] of results) {
      if (data) {
        structure[type] = data;
      }
    }

    console.log({ structure, level: organizationType, id: organizationId });

    return {
      structure,
      level: organizationType,
      id: organizationId,
    };
  };

  return { fetchOrganization };
};
