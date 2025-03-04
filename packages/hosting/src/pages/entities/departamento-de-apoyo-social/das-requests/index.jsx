import React, { useEffect } from "react";
import {
  Acl,
  Col,
  modalConfirm,
  notification,
  Row,
  Title,
} from "../../../../components";
import { DasRequestsTable } from "./DasRequestsTable";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useNavigate } from "react-router";
import { useDefaultFirestoreProps, useDevice } from "../../../../hooks";
import {
  dasRequestsRef,
  updateDasRequest,
} from "../../../../firebase/collections/dasApplications";
import {
  ModalProvider,
  useAuthentication,
  useModal,
} from "../../../../providers";
import { ReplyDasRequestModal } from "./ReplyDasRequest";
import { ReplyDasRequestInformationModal } from "./ReplyDasRequestInformation";
import { DasRequestProceedsModal } from "./DasRequestProceedsModal";

export const DasRequestsListIntegration = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthentication();
  const { assignDeleteProps } = useDefaultFirestoreProps();

  const [dasRequests = [], dasRequestsLoading, dasRequestsError] =
    useCollectionData(dasRequestsRef.where("isDeleted", "==", false));

  useEffect(() => {
    dasRequestsError && notification({ type: "error" });
  }, [dasRequestsError]);

  const navigateTo = (pathname = "new") => navigate(pathname);
  const onEditDasRequest = (dasRequest) => navigateTo(dasRequest.id);

  const onConfirmDeleteDasRequest = async (dasRequest) => {
    modalConfirm({
      title: "¿Estás seguro que quieres eliminar la solicitud?",
      onOk: async () => {
        await updateDasRequest(
          dasRequest.id,
          assignDeleteProps({ isDeleted: true }),
        );
      },
    });
  };

  return (
    <ModalProvider>
      <DasRequestsList
        dasRequests={dasRequests}
        dasRequestsLoading={dasRequestsLoading}
        onEditDasRequest={onEditDasRequest}
        onDeleteDasRequest={onConfirmDeleteDasRequest}
        user={authUser}
      />
    </ModalProvider>
  );
};

const DasRequestsList = ({
  dasRequests,
  dasRequestsLoading,
  onEditDasRequest,
  onDeleteDasRequest,
  user,
}) => {
  const { isTablet } = useDevice();
  const { onShowModal, onCloseModal } = useModal();

  const onShowDasRequestProceedsModal = (dasRequest) => {
    onShowModal({
      title: "Evaluación de la solicitud",
      width: `${isTablet ? "100%" : "50%"}`,
      centered: false,
      top: 0,
      padding: 0,
      clearOnDestroy: true,
      onRenderBody: () => (
        <DasRequestProceedsModal
          onCloseModal={onCloseModal}
          dasRequest={dasRequest}
        />
      ),
    });
  };

  const onShowReplyDasRequestModal = (dasRequest) => {
    onShowModal({
      title: "Responder solicitud",
      width: `${isTablet ? "100%" : "50%"}`,
      centered: false,
      top: 0,
      padding: 0,
      clearOnDestroy: true,
      onRenderBody: () => (
        <ReplyDasRequestModal
          onCloseModal={onCloseModal}
          dasRequest={dasRequest}
        />
      ),
    });
  };

  const onShowReplyDasRequestInformationModal = (dasRequest) => {
    onShowModal({
      title: "Detalle de respuesta",
      width: `${isTablet ? "100%" : "50%"}`,
      centered: false,
      top: 0,
      padding: 0,
      clearOnDestroy: true,
      onRenderBody: () => (
        <ReplyDasRequestInformationModal response={dasRequest?.response} />
      ),
    });
  };

  return (
    <Acl
      category="public"
      subCategory="dasRequests"
      name="/das-requests"
      redirect
    >
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <Title level={3}>Lista de Solicitudes</Title>
        </Col>
        <Col span={24}>
          <DasRequestsTable
            dasRequests={dasRequests}
            onEditDasRequest={onEditDasRequest}
            onDeleteDasRequest={onDeleteDasRequest}
            onShowDasRequestProceedsModal={onShowDasRequestProceedsModal}
            onShowReplyDasRequestModal={onShowReplyDasRequestModal}
            onShowReplyDasRequestInformationModal={
              onShowReplyDasRequestInformationModal
            }
            dasRequestsLoading={dasRequestsLoading}
            user={user}
          />
        </Col>
      </Row>
    </Acl>
  );
};
