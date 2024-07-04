import React, { useEffect } from "react";
import { OrganizationalClimateStudiesSheet } from "./organizationalClimateStudiesSheet";
import { notification, PDF, Sheet, Spinner } from "../../../../components";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { firestore } from "../../../../firebase";
import { chunk, orderBy } from "lodash";

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

  const organizationClimateStudiesView = orderBy(
    organizationClimateStudies,
    ["createAt"],
    ["desc"]
  ).map((organizationClimateStudy, index) => ({
    ...organizationClimateStudy,
    number: index + 1,
  }));

  return (
    <PDF>
      {chunk(organizationClimateStudiesView, 25).map(
        (_organizationClimateStudies, index) => (
          <Sheet key={index} layout="landscape">
            <OrganizationalClimateStudiesSheet
              organizationClimateStudies={orderBy(
                _organizationClimateStudies,
                ["createAt"],
                ["desc"]
              )}
            />
          </Sheet>
        )
      )}
    </PDF>
  );
};
