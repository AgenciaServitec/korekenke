import React from "react";
import { PdfAnimalRegistrationCard } from "./PdfAnimalRegistrationCard";
import { PDF, Sheet } from "../../../../../components";

export const PdfAnimalRegistrationCardSheet = () => {
  return (
    <PDF>
      <Sheet layout="landscape">
        <PdfAnimalRegistrationCard />
      </Sheet>
    </PDF>
  );
};
