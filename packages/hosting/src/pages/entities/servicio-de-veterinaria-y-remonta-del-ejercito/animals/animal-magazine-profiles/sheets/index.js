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
import { animalsRef } from "../../../../../../firebase/collections";
import { useGlobalData } from "../../../../../../providers";
import { AnimalMagazineProfilesheet } from "./AnimalMagazineProfileSheet";

export const PdfAnimalMagazineProfilesSheets = () => {
  const { animalId, animalMagazineProfileId } = useParams();
  const { animals } = useGlobalData();

  const [
    animalMagazineProfile,
    animalMagazineProfileLoading,
    animalMagazineProfileError,
  ] = useDocumentData(
    animalsRef
      .doc(animalId)
      .collection("animal-magazine-profiles")
      .doc(animalMagazineProfileId),
  );

  useEffect(() => {
    animalMagazineProfileError && notification({ type: "error" });
  }, [animalMagazineProfileError]);

  const animal = animals.find((_animal) => _animal.id === animalId);

  if (animalMagazineProfileLoading || !animal) return <Spinner height="80vh" />;

  return (
    <PDF>
      <Sheet layout="portrait">
        <AnimalMagazineProfilesheet
          animal={animal}
          animalMagazineProfile={animalMagazineProfile}
        />
      </Sheet>
      <Sheet layout="portrait">
        <BodyWeightEstimationSheet
          animalMagazineProfile={animalMagazineProfile}
        />
      </Sheet>
    </PDF>
  );
};
