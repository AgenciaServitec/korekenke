import React from "react";
import { PDF, Sheet } from "../../../../../components";
import { IndividualFingerprintRecordSheet } from "./IndividualFingerprintRecordSheet";
import { PersonalDataSheet } from "./PersonalDataSheet";
import { FSCECDeclarationLetterSheet } from "./FSCECDeclarationLetterSheet";
import { DomiciliarySketchOwnerSheet } from "./DomiciliarySketchOwnerSheet";

export const PdfLptSheets = () => {
  return (
    <PDF>
      <Sheet layout="portrait">
        <IndividualFingerprintRecordSheet />
      </Sheet>
      <Sheet layout="portrait">
        <PersonalDataSheet />
      </Sheet>
      <Sheet layout="portrait">
        <FSCECDeclarationLetterSheet />
      </Sheet>
      <Sheet layout="portrait">
        <DomiciliarySketchOwnerSheet />
      </Sheet>
    </PDF>
  );
};
