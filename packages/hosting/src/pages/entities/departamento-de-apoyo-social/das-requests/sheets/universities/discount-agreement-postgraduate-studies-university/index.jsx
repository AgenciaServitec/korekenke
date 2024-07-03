import React from "react";
import { PDF, Sheet } from "../../../../../../../components";
import { PdfDiscountAgreementPostgraduateStudiesUniversity } from "./PdfDiscountAgreementPostgraduateStudiesUniversity";

export const DiscountAgreementPostgraduateStudiesUniversity = () => {
  return (
    <PDF>
      <Sheet layout="landscape">
        <PdfDiscountAgreementPostgraduateStudiesUniversity />
      </Sheet>
    </PDF>
  );
};
