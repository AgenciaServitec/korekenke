import React from "react";
import { PdfRegistrationClinicHistory } from "./PdfRegistrationClinicHistory";
import { PDF, Sheet, Spinner } from "../../../../../../components";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { firestore } from "../../../../../../firebase";
import { useParams } from "react-router-dom";
import { chunk, orderBy } from "lodash";

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

  if (clinicHistoriesLoading) return <Spinner height="80vh" />;

  const addRows = (dataSource = [], maxLength = 20) => {
    for (let i = dataSource.length; i < maxLength; i++) {
      dataSource.push({});
    }

    return dataSource;
  };

  return (
    <PDF>
      {chunk(orderBy(clinicHistories, ["createAt"], ["desc"]), 20).map(
        (_clinicHistories, index) => (
          <Sheet key={index} layout="portrait">
            <PdfRegistrationClinicHistory
              clinicHistories={addRows(_clinicHistories, 20)}
            />
          </Sheet>
        )
      )}
    </PDF>
  );
};
