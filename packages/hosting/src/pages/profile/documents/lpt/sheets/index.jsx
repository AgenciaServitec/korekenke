import React from "react";
import { PDF, Sheet } from "../../../../../components";

export const PdfLptSheets = () => {
  return (
    <PDF>
      <Sheet layout="portrait">
        <h1>Hola</h1>
      </Sheet>
    </PDF>
  );
};
