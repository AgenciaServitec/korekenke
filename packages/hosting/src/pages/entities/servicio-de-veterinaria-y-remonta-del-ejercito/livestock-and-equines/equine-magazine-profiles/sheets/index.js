import React, { useEffect } from "react";
import {
  notification,
  PDF,
  Sheet,
  Spinner,
} from "../../../../../../components";
import { PdfRegistrationClinicHistory } from "./PdfRegistrationClinicHistory";
import { BodyWeightEstimationSheet } from "./BodyWeightEstimationSheet";
import { useParams } from "react-router";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { livestockAndEquinesRef } from "../../../../../../firebase/collections";

export const PdfEquineMagazineProfilesSheets = () => {
  const { livestockAndEquineId, equineMagazineProfileId } = useParams();

  const [
    equineMagazineProfile,
    equineMagazineProfileLoading,
    equineMagazineProfileError,
  ] = useDocumentData(
    livestockAndEquinesRef
      .doc(livestockAndEquineId)
      .collection("equine-magazine-profiles")
      .doc(equineMagazineProfileId)
  );

  useEffect(() => {
    equineMagazineProfileError && notification({ type: "error" });
  }, [equineMagazineProfileError]);

  if (equineMagazineProfileLoading) return <Spinner height="80vh" />;

  return (
    <PDF>
      <Sheet layout="portrait">
        <PdfRegistrationClinicHistory />
      </Sheet>
      <Sheet layout="portrait">
        <BodyWeightEstimationSheet
          equineMagazineProfile={equineMagazineProfile}
        />
      </Sheet>
    </PDF>
  );
};
