import React from "react";
import { PdfRegistrationClinicHistory } from "./PdfRegistrationClinicHistory";
import { PDF, Sheet } from "../../../../../../components";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { firestore } from "../../../../../../firebase";
import { useParams } from "react-router-dom";
import { chunk } from "lodash";

export const PdfClinicHistorySheets = () => {
  const { livestockAndEquineId } = useParams();

  const [clinicHistories = [], clinicHistoriesLoading, clinicHistoriesError] =
    useCollectionData(
      firestore
        .collection("livestock-and-equines")
        .doc(livestockAndEquineId)
        .collection("clinic-history")
        .where("isDeleted", "==", false)
    );

  return (
    <PDF>
      {chunk(clinicHistories, 20).map((clinicHistory, index) => (
        <Sheet key={index} layout="portrait">
          <PdfRegistrationClinicHistory clinicHistory={clinicHistory} />
        </Sheet>
      ))}
    </PDF>
  );
};
