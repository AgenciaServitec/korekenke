import { fetchDocumentOnce } from "../firebase/utils";
import { firestore } from "../firebase";
import collection from "react-virtualized/dist/commonjs/Collection";

export const useOrganizationData = () => {
  const groups = {
    department: "departments",
    entity: "entities",
    office: "offices",
    section: "sections",
  };

  const fetchOrganization = async (organizationId, organizationType) =>
    await fetchDocumentOnce(
      firestore.collection(organizationType).doc(organizationId),
    );

  const fetchOrganizationalStructure = async (
    organizationId,
    organizationType,
  ) => {
    const mainOrganization = await fetchOrganization(
      organizationId,
      groups[organizationType],
    );

    const relatedIds = {
      entityId: {
        type: "entity",
        collection: "entities",
        id: mainOrganization.entityId || null,
      },
      departmentId: {
        type: "department",
        collection: "departments",
        id: mainOrganization.departmentId || null,
      },
      unitId: {
        type: "unit",
        collection: "units",
        id: mainOrganization.unitId || null,
      },
      officeId: {
        type: "office",
        collection: "offices",
        id: mainOrganization.officeId || null,
      },
      sectionId: {
        type: "section",
        collection: "sections",
        id: mainOrganization.sectionId || null,
      },
    };

    const fetchOrganizationName = (organizationId) =>
      Object.entries(relatedIds).find(([_, { id }]) => id !== organizationId);

    const fetchPromises = Object.entries(relatedIds)
      .filter(([_, { id }]) => id !== null)
      .map(([_, { collection, id }]) => fetchOrganization(id, collection));

    const otherOrganizations = await Promise.all(fetchPromises);

    console.log(otherOrganizations);

    // return {
    //   [organizationType]: mainOrganization,
    //   ...[otherOrganizations?.map(([type, data]) => ({ type, data }))],
    // };
  };

  return { fetchOrganizationalStructure };
};
