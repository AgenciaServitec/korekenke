import React from "react";
import { PdfEquineLivestockRegistrationCard } from "./PdfEquineLivestockRegistrationCard";
import { PDF, Sheet } from "../../../../../components";

export const PdfEquineLivestockRegistrationCardSheet = () => {
  return (
    <PDF>
      <Sheet layout="portrait">
        <PdfEquineLivestockRegistrationCard />
      </Sheet>
    </PDF>
  );
};
