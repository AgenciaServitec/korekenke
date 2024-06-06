import React, { useEffect } from "react";
import {
  notification,
  PDF,
  Sheet,
  Spinner,
} from "../../../../../../components";
import { BodyWeightEstimationSheet } from "./BodyWeightEstimationSheet";
import { useParams } from "react-router";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { livestockAndEquinesRef } from "../../../../../../firebase/collections";
import { useGlobalData } from "../../../../../../providers";
import { EquineMagazineProfileSheet } from "./EquineMagazineProfileSheet";

export const PdfEquineMagazineProfilesSheets = () => {
  const { livestockAndEquineId, equineMagazineProfileId } = useParams();
  const { livestockAndEquines } = useGlobalData();

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

  const livestockAndEquine = livestockAndEquines.find(
    (_livestockAndEquine) => _livestockAndEquine.id === livestockAndEquineId
  );

  if (equineMagazineProfileLoading || !livestockAndEquine)
    return <Spinner height="80vh" />;

  return (
    <PDF>
      <Sheet layout="portrait">
        <EquineMagazineProfileSheet
          livestockAndEquine={livestockAndEquine}
          equineMagazineProfile={equineMagazineProfile}
        />
      </Sheet>
      <Sheet layout="portrait">
        <BodyWeightEstimationSheet
          equineMagazineProfile={equineMagazineProfile}
        />
      </Sheet>
    </PDF>
  );
};
