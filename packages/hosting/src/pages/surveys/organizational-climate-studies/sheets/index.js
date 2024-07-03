import React, { useEffect } from "react";
import { OrganizationalClimateStudiesSheet } from "./organizationalClimateStudiesSheet";
import { notification, PDF, Sheet, Spinner } from "../../../../components";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { firestore } from "../../../../firebase";

export const OrganizationalClimateStudiesSheets = () => {
  const [
    organizationClimateStudies = [],
    organizationClimateStudiesLoading,
    organizationClimateStudiesError,
  ] = useCollectionData(
    firestore
      .collection("organizational-climate-studies-surveys")
      .where("isDeleted", "==", false)
  );

  useEffect(() => {
    organizationClimateStudiesError && notification({ type: "error" });
  }, [organizationClimateStudiesError]);

  if (organizationClimateStudiesLoading) return <Spinner height="80vh" />;

  return (
    <PDF>
      <Sheet layout="landscape">
        <OrganizationalClimateStudiesSheet
          organizationClimateStudies={organizationClimateStudies}
        />
      </Sheet>
    </PDF>
  );
};
