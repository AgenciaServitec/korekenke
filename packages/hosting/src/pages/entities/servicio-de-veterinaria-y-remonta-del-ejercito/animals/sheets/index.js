import React, { useEffect, useState } from "react";
import {
  AnimalCardSheet,
  notification,
  PDF,
  Sheet,
  Spinner,
} from "../../../../../components";
import { useParams } from "react-router";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { animalsRef } from "../../../../../firebase/collections";
import { AnimalsType } from "../../../../../data-list";
import { getAnimalEntitiesAndBosses } from "../../../../../utils";
import { FamilyTreeSheet } from "./FamilyTreeSheet";

export const PdfAnimalRegistrationCardSheet = () => {
  const { animalId } = useParams();
  const [animalEntitiesAndBosses, setAnimalEntitiesAndBosses] = useState({});

  const [animal = {}, animalLoading, animalError] = useDocumentData(
    animalId ? animalsRef.doc(animalId) : null,
  );

  useEffect(() => {
    animalError && notification({ type: "error" });
  }, [animalError]);

  useEffect(() => {
    (async () => {
      const result = animal ? await getAnimalEntitiesAndBosses(animal) : {};
      setAnimalEntitiesAndBosses(result);
    })();
  }, [animal]);

  if (animalLoading || !animalEntitiesAndBosses)
    return <Spinner height="80vh" />;

  const animalMapper = (animal) => {
    const cardTitle = AnimalsType?.[animal.type]?.cardTitle;
    const cardSubTitle = AnimalsType?.[animal.type]?.cardSubTitle;

    return {
      ...animal,
      ...animalEntitiesAndBosses,
      cardTitle,
      cardSubTitle,
    };
  };

  const animalView = animalMapper(animal);

  return (
    <PDF>
      <Sheet layout="landscape">
        <AnimalCardSheet animal={animalView} />
      </Sheet>
      <Sheet layout="landscape">
        <FamilyTreeSheet animal={animalView} />
      </Sheet>
    </PDF>
  );
};
