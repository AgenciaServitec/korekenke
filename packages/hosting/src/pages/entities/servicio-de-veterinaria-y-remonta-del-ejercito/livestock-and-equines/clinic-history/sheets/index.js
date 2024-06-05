import React from "react";
import { PdfRegistrationClinicHistory } from "./PdfRegistrationClinicHistory";
import { PDF, Sheet } from "../../../../../../components";

export const PdfClinicHistorySheets = () => {
  return (
    <PDF>
      <Sheet layout="portrait">
        <PdfRegistrationClinicHistory />
      </Sheet>
    </PDF>
  );
};
