import React from "react";
import { PDF } from "./PDF";
import { PdfRegistrationCmsts } from "./PdfRegistrationCmsts";
import { Sheet } from "./Sheet";
import { useAuthentication } from "../../../../providers";

export const InscriptionFile = () => {
  const { authUser } = useAuthentication();

  return (
    <PDF>
      <Sheet layout="portrait">
        <PdfRegistrationCmsts user={authUser} />
      </Sheet>
    </PDF>
  );
};
