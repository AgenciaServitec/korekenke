import React from "react";
import { PdfRegistrationClinicHistory } from "./PdfRegistrationClinicHistory";
import { PDF, Sheet } from "../../../../../../components";

export const PdfEquineMagazineProfilesSheets = () => {
  return (
    <PDF>
      <Sheet layout="portrait">
        <PdfRegistrationClinicHistory />
      </Sheet>
    </PDF>
  );
};
