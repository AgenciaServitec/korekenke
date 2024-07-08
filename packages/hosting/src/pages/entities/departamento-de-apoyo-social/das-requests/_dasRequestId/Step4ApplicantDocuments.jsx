import React, { useState } from "react";
import styled from "styled-components";
import { getLocalStorage, setLocalStorage } from "../../../../../utils";
import { mediaQuery } from "../../../../../styles";
import {
  DescuentoConvenioUniversidadApplicantDocuments,
  DescuentoConvenioInstitutoApplicantDocuments,
  MediaBecaInstitutoApplicantDocuments,
  BecaEstudiosInstitutoApplicantDocuments,
  MediaBecaPostgradoUniversidadApplicantDocuments,
  NoDocuments,
} from "./components";
import { DescuentoConvenioPostgradoUniversidadApplicantDocuments } from "./components/step4-applicant/DescuentoConvenioPostgradoUniversidadApplicantDocuments";

export const Step4ApplicantDocuments = ({ onNextStep, onPrevStep }) => {
  const dasRequest = getLocalStorage("dasRequest");

  const [loadingStep4, setLoadingStep4] = useState(false);

  const onSaveApplicantDocumentsStep4 = (formData) => {
    try {
      setLoadingStep4(true);
      setLocalStorage("dasRequest", {
        ...dasRequest,
        ...formData,
      });

      onNextStep();
    } catch (e) {
      console.error("onSaveApplicantDocumentsStep4: ", e);
    } finally {
      setLoadingStep4(false);
    }
  };

  const showApplicantDocumentByRequestType = () => {
    switch (dasRequest?.requestType) {
      case "descuento_por_convenio_en_universidad":
        return (
          <DescuentoConvenioUniversidadApplicantDocuments
            onPrevStep={onPrevStep}
            dasRequest={dasRequest}
            loadingStep4={loadingStep4}
            onSaveApplicantDocumentsStep4={onSaveApplicantDocumentsStep4}
          />
        );
      case "descuento_por_convenio_en_instituto":
        return (
          <DescuentoConvenioInstitutoApplicantDocuments
            onPrevStep={onPrevStep}
            dasRequest={dasRequest}
            loadingStep4={loadingStep4}
            onSaveApplicantDocumentsStep4={onSaveApplicantDocumentsStep4}
          />
        );
      case "descuento_por_convenio_postgrado_en_universidad":
        return (
          <DescuentoConvenioPostgradoUniversidadApplicantDocuments
            onPrevStep={onPrevStep}
            dasRequest={dasRequest}
            loadingStep4={loadingStep4}
            onSaveApplicantDocumentsStep4={onSaveApplicantDocumentsStep4}
          />
        );
      case "media_beca_en_instituto":
        return (
          <MediaBecaInstitutoApplicantDocuments
            onPrevStep={onPrevStep}
            dasRequest={dasRequest}
            loadingStep4={loadingStep4}
            onSaveApplicantDocumentsStep4={onSaveApplicantDocumentsStep4}
          />
        );
      case "beca_de_estudios_en_instituto":
        return (
          <BecaEstudiosInstitutoApplicantDocuments
            onPrevStep={onPrevStep}
            dasRequest={dasRequest}
            loadingStep4={loadingStep4}
            onSaveApplicantDocumentsStep4={onSaveApplicantDocumentsStep4}
          />
        );
      case "media_beca_para_postgrado_en_universidad":
        return (
          <MediaBecaPostgradoUniversidadApplicantDocuments
            onPrevStep={onPrevStep}
            dasRequest={dasRequest}
            loadingStep4={loadingStep4}
            onSaveApplicantDocumentsStep4={onSaveApplicantDocumentsStep4}
          />
        );
      default:
        return <NoDocuments onPrevStep={onPrevStep} onNextStep={onNextStep} />;
    }
  };

  return (
    <Container>
      <div className="form-wrapper">{showApplicantDocumentByRequestType()}</div>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  .form-wrapper {
    width: 100%;
    margin: auto;
    ${mediaQuery.minDesktop} {
      width: 70%;
    }
  }
`;
