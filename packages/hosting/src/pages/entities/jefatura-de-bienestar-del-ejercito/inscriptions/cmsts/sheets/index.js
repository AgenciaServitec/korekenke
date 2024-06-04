import React from "react";
import { PDF } from "./PDF";
import { PdfRegistrationCmsts } from "./PdfRegistrationCmsts";
import { Sheet } from "./Sheet";
import { useAuthentication } from "../../../../../../providers";
import { Acl } from "../../../../../../components";

export const InscriptionFile = () => {
  const { authUser } = useAuthentication();

  return (
    <Acl
      category="jefatura-de-bienestar-del-ejercito"
      subCategory="inscriptions"
      name="/inscriptions/cmsts/sheet"
      redirect
    >
      <PDF>
        <Sheet layout="portrait">
          <PdfRegistrationCmsts user={authUser} />
        </Sheet>
      </PDF>
    </Acl>
  );
};
