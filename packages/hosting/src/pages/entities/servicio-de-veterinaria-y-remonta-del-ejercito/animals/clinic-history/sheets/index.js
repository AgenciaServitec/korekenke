import React, { useEffect, useState } from "react";
import { PdfRegistrationClinicHistory } from "./PdfRegistrationClinicHistory";
import {
  notification,
  PDF,
  Sheet,
  Spinner,
} from "../../../../../../components";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { firestore } from "../../../../../../firebase";
import { useParams } from "react-router-dom";
import { chunk, orderBy } from "lodash";
import { fetchAnimal } from "../../../../../../firebase/collections";
import { getAnimalEntitiesAndBosses } from "../../../../../../utils";

export const PdfClinicHistorySheets = () => {
  const { animalId } = useParams();

  const [loading, setLoading] = useState(true);
  const [animal, setAnimal] = useState(null);
  const [animalEntitiesAndBosses, setAnimalEntitiesAndBosses] = useState({});

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const _animal = await fetchAnimal(animalId);
        const result = await getAnimalEntitiesAndBosses(_animal);

        setAnimal(_animal);
        setAnimalEntitiesAndBosses(result);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const [clinicHistories = [], clinicHistoriesLoading, clinicHistoriesError] =
    useCollectionData(
      firestore
        .collection("animals")
        .doc(animalId)
        .collection("clinic-history")
        .where("isDeleted", "==", false),
    );

  useEffect(() => {
    clinicHistoriesError && notification({ type: "error" });
  }, [clinicHistoriesError]);

  if (clinicHistoriesLoading || loading) return <Spinner height="80vh" />;

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
              animal={animal}
              animalEntitiesAndBosses={animalEntitiesAndBosses}
            />
          </Sheet>
        ),
      )}
    </PDF>
  );
};
