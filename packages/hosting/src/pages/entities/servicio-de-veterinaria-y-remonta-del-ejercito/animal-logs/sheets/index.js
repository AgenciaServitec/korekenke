import React, { useEffect } from "react";
import {
  AnimalCardSheet,
  notification,
  PDF,
  Sheet,
  Spinner,
} from "../../../../../components";
import { useParams } from "react-router";
import { animalLogsRef } from "../../../../../firebase/collections";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { AnimalsType } from "../../../../../data-list";

export const PdfAnimalLogRegistrationCardSheet = () => {
  const { animalId } = useParams();

  const [animal = {}, animalLoading, animalError] = useDocumentData(
    animalId ? animalLogsRef.doc(animalId) : null
  );

  useEffect(() => {
    animalError && notification({ type: "error" });
  }, [animalError]);

  if (animalLoading) return <Spinner height="80vh" />;

  const animalMapper = (animal) => {
    const cardTitle = AnimalsType?.[animal.type]?.cardTitle;
    const cardSubTitle = AnimalsType?.[animal.type]?.cardSubTitle;

    return {
      ...animal,
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
    </PDF>
  );
};
