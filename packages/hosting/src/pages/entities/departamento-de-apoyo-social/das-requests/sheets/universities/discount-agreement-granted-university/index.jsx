import React from "react";
import { PDF, Sheet } from "../../../../../../../components";
import { PdfDiscountAgreementGrantedUniversitySheet } from "./PdfDiscountAgreementGrantedUniversity";

export const PdfDiscountAgreementGrantedUniversitySheets = () => {
  return (
    <PDF>
      <Sheet>
        <PdfDiscountAgreementGrantedUniversitySheet />
      </Sheet>
    </PDF>
  );
};
