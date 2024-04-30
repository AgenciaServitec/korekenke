import React from "react";
import { PDF } from "./PDF";
import { PdfRegistrationCmsts } from "./PdfRegistrationCmsts";
import { Sheet } from "./Sheet";

export const InscriptionFile = () => {
  return (
    <PDF>
      <Sheet layout="portrait">
        <PdfRegistrationCmsts />
      </Sheet>
    </PDF>
  );
};
