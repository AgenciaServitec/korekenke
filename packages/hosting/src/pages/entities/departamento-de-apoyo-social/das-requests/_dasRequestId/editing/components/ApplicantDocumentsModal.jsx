import React, { useState } from "react";
import { Col, notification, Row } from "../../../../../../../components";
import {
  BecaEstudioPostgradoUniversidadApplicantDocuments,
  BecaEstudiosInstitutoApplicantDocuments,
  BecaEstudiosUniversidadApplicantDocuments,
  DescuentoConvenioInstitutoApplicantDocuments,
  DescuentoConvenioPostgradoUniversidadApplicantDocuments,
  DescuentoConvenioUniversidadApplicantDocuments,
  MediaBecaInstitutoApplicantDocuments,
  MediaBecaPostgradoUniversidadApplicantDocuments,
  MediaBecaUniversidadApplicantDocuments,
  NoDocuments,
} from "../../steps/components";
import { updateDasApplication } from "../../../../../../../firebase/collections/dasApplications";

export const ApplicantDocumentsModal = ({
  isNew,
  dasRequest,
  onCloseDasRequestModal,
}) => {
  const [loading, setLoading] = useState(false);

  const onSaveApplicantDocuments = async (formData) => {
    try {
      setLoading(true);

      await updateDasApplication(dasRequest.id, {
        applicant: {
          ...dasRequest.applicant,
          documents: {
            ...dasRequest.applicant?.documents,
            ...formData.applicant.documents,
          },
        },
      });

      onCloseDasRequestModal();
      notification({ type: "success" });
    } catch (e) {
      console.error("onSaveApplicantDocuments: ", e);
      notification({ type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ApplicantDocuments
      isNew={isNew}
      dasRequest={dasRequest}
      loading={loading}
      onCloseDasRequestModal={onCloseDasRequestModal}
      onSaveApplicantDocuments={onSaveApplicantDocuments}
    />
  );
};

const ApplicantDocuments = ({
  isNew,
  dasRequest,
  loading,
  onCloseDasRequestModal,
  onSaveApplicantDocuments,
}) => {
  const showApplicantDocumentByRequestType = () => {
    switch (dasRequest?.requestType) {
      case "descuento_por_convenio_en_universidad":
        return (
          <DescuentoConvenioUniversidadApplicantDocuments
            isNew={isNew}
            onPrevStep={onCloseDasRequestModal}
            dasRequest={dasRequest}
            loading={loading}
            onSaveApplicantDocuments={onSaveApplicantDocuments}
          />
        );
      case "descuento_por_convenio_postgrado_en_universidad":
        return (
          <DescuentoConvenioPostgradoUniversidadApplicantDocuments
            isNew={isNew}
            onPrevStep={onCloseDasRequestModal}
            dasRequest={dasRequest}
            loading={loading}
            onSaveApplicantDocuments={onSaveApplicantDocuments}
          />
        );
      case "beca_de_estudios_en_universidad":
        return (
          <BecaEstudiosUniversidadApplicantDocuments
            isNew={isNew}
            onPrevStep={onCloseDasRequestModal}
            dasRequest={dasRequest}
            loading={loading}
            onSaveApplicantDocuments={onSaveApplicantDocuments}
          />
        );
      case "beca_de_estudio_para_postgrado_en_universidad":
        return (
          <BecaEstudioPostgradoUniversidadApplicantDocuments
            isNew={isNew}
            onPrevStep={onCloseDasRequestModal}
            dasRequest={dasRequest}
            loading={loading}
            onSaveApplicantDocuments={onSaveApplicantDocuments}
          />
        );
      case "media_beca_en_universidad":
        return (
          <MediaBecaUniversidadApplicantDocuments
            isNew={isNew}
            onPrevStep={onCloseDasRequestModal}
            dasRequest={dasRequest}
            loading={loading}
            onSaveApplicantDocuments={onSaveApplicantDocuments}
          />
        );
      case "media_beca_para_postgrado_en_universidad":
        return (
          <MediaBecaPostgradoUniversidadApplicantDocuments
            isNew={isNew}
            onPrevStep={onCloseDasRequestModal}
            dasRequest={dasRequest}
            loading={loading}
            onSaveApplicantDocuments={onSaveApplicantDocuments}
          />
        );
      case "descuento_por_convenio_en_instituto":
        return (
          <DescuentoConvenioInstitutoApplicantDocuments
            isNew={isNew}
            onPrevStep={onCloseDasRequestModal}
            dasRequest={dasRequest}
            loading={loading}
            onSaveApplicantDocuments={onSaveApplicantDocuments}
          />
        );
      case "beca_de_estudios_en_instituto":
        return (
          <BecaEstudiosInstitutoApplicantDocuments
            isNew={isNew}
            onPrevStep={onCloseDasRequestModal}
            dasRequest={dasRequest}
            loading={loading}
            onSaveApplicantDocuments={onSaveApplicantDocuments}
          />
        );
      case "media_beca_en_instituto":
        return (
          <MediaBecaInstitutoApplicantDocuments
            isNew={isNew}
            onPrevStep={onCloseDasRequestModal}
            dasRequest={dasRequest}
            loading={loading}
            onSaveApplicantDocuments={onSaveApplicantDocuments}
          />
        );
      default:
        return <NoDocuments />;
    }
  };

  return (
    <Row justify="end" gutter={[16, 16]}>
      <Col span={24}>{showApplicantDocumentByRequestType()}</Col>
    </Row>
  );
};
