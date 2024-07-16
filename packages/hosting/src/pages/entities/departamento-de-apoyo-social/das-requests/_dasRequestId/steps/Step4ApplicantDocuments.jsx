import React, { useState } from "react";
import styled from "styled-components";
import { getLocalStorage, setLocalStorage } from "../../../../../../utils";
import { mediaQuery } from "../../../../../../styles";
import { Card } from "../../../../../../components";
import {
  NoDocuments,
  DescuentoConvenioUniversidadApplicantDocuments,
  DescuentoConvenioInstitutoApplicantDocuments,
  MediaBecaInstitutoApplicantDocuments,
  BecaEstudiosInstitutoApplicantDocuments,
  MediaBecaPostgradoUniversidadApplicantDocuments,
  DescuentoConvenioPostgradoUniversidadApplicantDocuments,
  BecaEstudiosUniversidadApplicantDocuments,
  MediaBecaUniversidadApplicantDocuments,
  BecaEstudioPostgradoUniversidadApplicantDocuments,
} from "./components";

export const Step4ApplicantDocuments = ({ isNew, onNextStep, onPrevStep }) => {
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
            isNew={isNew}
            onPrevStep={onPrevStep}
            dasRequest={dasRequest}
            loadingStep4={loadingStep4}
            onSaveApplicantDocuments={onSaveApplicantDocumentsStep4}
          />
        );
      case "descuento_por_convenio_postgrado_en_universidad":
        return (
          <DescuentoConvenioPostgradoUniversidadApplicantDocuments
            isNew={isNew}
            onPrevStep={onPrevStep}
            dasRequest={dasRequest}
            loadingStep4={loadingStep4}
            onSaveApplicantDocuments={onSaveApplicantDocumentsStep4}
          />
        );
      case "beca_de_estudios_en_universidad":
        return (
          <BecaEstudiosUniversidadApplicantDocuments
            isNew={isNew}
            onPrevStep={onPrevStep}
            dasRequest={dasRequest}
            loadingStep4={loadingStep4}
            onSaveApplicantDocuments={onSaveApplicantDocumentsStep4}
          />
        );
      case "beca_de_estudio_para_postgrado_en_universidad":
        return (
          <BecaEstudioPostgradoUniversidadApplicantDocuments
            isNew={isNew}
            onPrevStep={onPrevStep}
            dasRequest={dasRequest}
            loadingStep4={loadingStep4}
            onSaveApplicantDocuments={onSaveApplicantDocumentsStep4}
          />
        );
      case "media_beca_en_universidad":
        return (
          <MediaBecaUniversidadApplicantDocuments
            isNew={isNew}
            onPrevStep={onPrevStep}
            dasRequest={dasRequest}
            loadingStep4={loadingStep4}
            onSaveApplicantDocuments={onSaveApplicantDocumentsStep4}
          />
        );
      case "media_beca_para_postgrado_en_universidad":
        return (
          <MediaBecaPostgradoUniversidadApplicantDocuments
            isNew={isNew}
            onPrevStep={onPrevStep}
            dasRequest={dasRequest}
            loadingStep4={loadingStep4}
            onSaveApplicantDocuments={onSaveApplicantDocumentsStep4}
          />
        );
      case "descuento_por_convenio_en_instituto":
        return (
          <DescuentoConvenioInstitutoApplicantDocuments
            isNew={isNew}
            onPrevStep={onPrevStep}
            dasRequest={dasRequest}
            loadingStep4={loadingStep4}
            onSaveApplicantDocuments={onSaveApplicantDocumentsStep4}
          />
        );
      case "beca_de_estudios_en_instituto":
        return (
          <BecaEstudiosInstitutoApplicantDocuments
            isNew={isNew}
            onPrevStep={onPrevStep}
            dasRequest={dasRequest}
            loadingStep4={loadingStep4}
            onSaveApplicantDocuments={onSaveApplicantDocumentsStep4}
          />
        );
      case "media_beca_en_instituto":
        return (
          <MediaBecaInstitutoApplicantDocuments
            isNew={isNew}
            onPrevStep={onPrevStep}
            dasRequest={dasRequest}
            loadingStep4={loadingStep4}
            onSaveApplicantDocuments={onSaveApplicantDocumentsStep4}
          />
        );
      default:
        return (
          <NoDocuments
            isNew={isNew}
            onPrevStep={onPrevStep}
            onNextStep={onNextStep}
          />
        );
    }
  };

  return (
    <Container>
      <div className="form-wrapper">
        <Card
          title={
            <span style={{ fontSize: "1.5em" }}>Documentos del aplicante</span>
          }
          bordered={false}
          type="inner"
        >
          {showApplicantDocumentByRequestType()}
        </Card>
      </div>
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
