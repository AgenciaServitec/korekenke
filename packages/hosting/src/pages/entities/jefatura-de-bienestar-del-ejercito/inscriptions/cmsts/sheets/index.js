import React, { useEffect, useState } from "react";
import { PdfRegistrationCmsts } from "./PdfRegistrationCmsts";
import { useAuthentication } from "../../../../../../providers";
import { Acl, PDF, Sheet } from "../../../../../../components";
import { useParams } from "react-router";
import { fetchCmstsEnrollment } from "../../../../../../firebase/collections";

export const InscriptionFile = () => {
  const { cmstsEnrollmentId } = useParams();
  const { authUser } = useAuthentication();

  const [cmstsEnrollment, setCmstsEnrollment] = useState(null);

  useEffect(() => {
    (async () => {
      const cmstsEnrollment = await fetchCmstsEnrollment(cmstsEnrollmentId);

      setCmstsEnrollment(cmstsEnrollment);
    })();
  }, []);

  return (
    <Acl
      category="jefatura-de-bienestar-del-ejercito"
      subCategory="inscriptions"
      name="/inscriptions/cmsts/sheet/:cmstsEnrollmentId"
      redirect
    >
      <PDF>
        <Sheet layout="portrait">
          <PdfRegistrationCmsts
            user={authUser}
            cmstsEnrollment={cmstsEnrollment}
          />
        </Sheet>
      </PDF>
    </Acl>
  );
};
