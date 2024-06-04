import React from "react";
import { PdfRegistrationClinicHistory } from "./PdfRegistrationClinicHistory";
import { PDF } from "./PDF";
import { Sheet } from "./Sheet";

export const SheetsEquineMagazineProfiles = () => {
  return (
    <PDF>
      <Sheet layout="portrait">
        <PdfRegistrationClinicHistory />
      </Sheet>
    </PDF>
  );
};
