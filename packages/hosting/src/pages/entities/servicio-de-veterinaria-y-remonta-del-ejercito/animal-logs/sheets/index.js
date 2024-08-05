import React from "react";
import { PdfAnimalRegistrationCard } from "./PdfAnimalRegistrationCard";
import { PDF, Sheet } from "../../../../../components";

export const PdfAnimalLogRegistrationCardSheet = () => {
  return (
    <PDF>
      <Sheet layout="landscape">
        <PdfAnimalRegistrationCard />
      </Sheet>
    </PDF>
  );
};
