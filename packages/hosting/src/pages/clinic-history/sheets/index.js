import React from "react";
import { Sheet } from "../../inscriptions/cmsts/sheets/Sheet";
import { PdfRegistrationClinicHistory } from "./PdfRegistrationClinicHistory";
import { PDF } from "../../inscriptions/cmsts/sheets/PDF";

export const Index = () => {
  return (
    <PDF>
      <Sheet layout="portrait">
        <PdfRegistrationClinicHistory />
      </Sheet>
    </PDF>
  );
};
