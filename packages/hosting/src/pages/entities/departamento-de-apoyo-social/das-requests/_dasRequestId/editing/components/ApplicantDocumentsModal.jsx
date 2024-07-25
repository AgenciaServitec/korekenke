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
import { updateUser } from "../../../../../../../firebase/collections";
import { useDefaultFirestoreProps } from "../../../../../../../hooks";

export const ApplicantDocumentsModal = ({
  isNew,
  user,
  dasRequest,
  onCloseDasRequestModal,
}) => {
  const { assignUpdateProps } = useDefaultFirestoreProps();

  const [loading, setLoading] = useState(false);
  const [cipPhotoCopy, setCipPhotoCopy] = useState(null);
  const [dniPhotoCopy, setDniPhotoCopy] = useState(null);
  const [signaturePhotoCopy, setSignaturePhotoCopy] = useState(null);

  const onSaveApplicantDocuments = async (formData) => {
    try {
      setLoading(true);

      await updateUser(
        user.id,
        assignUpdateProps({
          ...(!user?.cipPhoto && { cipPhoto: cipPhotoCopy }),
          ...(!user?.dniPhoto && { dniPhoto: dniPhotoCopy }),
          ...(!user?.signaturePhoto && { signaturePhoto: signaturePhotoCopy }),
        })
      );

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
      user={user}
      onSetCipPhotoCopy={setCipPhotoCopy}
      onSetDniPhotoCopy={setDniPhotoCopy}
      onSetSignaturePhotoCopy={setSignaturePhotoCopy}
      dasRequest={dasRequest}
      loading={loading}
      onCloseDasRequestModal={onCloseDasRequestModal}
      onSaveApplicantDocuments={onSaveApplicantDocuments}
    />
  );
};

const ApplicantDocuments = ({
  isNew,
  user,
  onSetCipPhotoCopy,
  onSetDniPhotoCopy,
  onSetSignaturePhotoCopy,
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
            user={user}
            onSetCipPhotoCopy={onSetCipPhotoCopy}
            onSetDniPhotoCopy={onSetDniPhotoCopy}
            onSetSignaturePhotoCopy={onSetSignaturePhotoCopy}
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
            user={user}
            onSetCipPhotoCopy={onSetCipPhotoCopy}
            onSetDniPhotoCopy={onSetDniPhotoCopy}
            onSetSignaturePhotoCopy={onSetSignaturePhotoCopy}
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
            user={user}
            onSetCipPhotoCopy={onSetCipPhotoCopy}
            onSetDniPhotoCopy={onSetDniPhotoCopy}
            onSetSignaturePhotoCopy={onSetSignaturePhotoCopy}
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
            user={user}
            onSetCipPhotoCopy={onSetCipPhotoCopy}
            onSetDniPhotoCopy={onSetDniPhotoCopy}
            onSetSignaturePhotoCopy={onSetSignaturePhotoCopy}
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
            user={user}
            onSetCipPhotoCopy={onSetCipPhotoCopy}
            onSetDniPhotoCopy={onSetDniPhotoCopy}
            onSetSignaturePhotoCopy={onSetSignaturePhotoCopy}
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
            user={user}
            onSetCipPhotoCopy={onSetCipPhotoCopy}
            onSetDniPhotoCopy={onSetDniPhotoCopy}
            onSetSignaturePhotoCopy={onSetSignaturePhotoCopy}
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
            user={user}
            onSetCipPhotoCopy={onSetCipPhotoCopy}
            onSetDniPhotoCopy={onSetDniPhotoCopy}
            onSetSignaturePhotoCopy={onSetSignaturePhotoCopy}
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
            user={user}
            onSetCipPhotoCopy={onSetCipPhotoCopy}
            onSetDniPhotoCopy={onSetDniPhotoCopy}
            onSetSignaturePhotoCopy={onSetSignaturePhotoCopy}
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
            user={user}
            onSetCipPhotoCopy={onSetCipPhotoCopy}
            onSetDniPhotoCopy={onSetDniPhotoCopy}
            onSetSignaturePhotoCopy={onSetSignaturePhotoCopy}
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
