import React, { useEffect, useState } from "react";
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

  const [visibleReplyModal, setVisibleReplyModal] = useState(false);
  const [visibleReplyInformationModal, setVisibleReplyInformationModal] =
    useState(false);
  const [dasRequest, setDasRequest] = useState(null);

  const [dasApplications = [], dasApplicationsLoading, dasApplicationsError] =
    useCollectionData(dasRequestsRef.where("isDeleted", "==", false));

  useEffect(() => {
    dasApplicationsError && notification({ type: "error" });
  }, [dasApplicationsError]);

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

  const onAddReplyDasRequest = (dasRequest) => {
    setDasRequest(dasRequest);
    setVisibleReplyModal(true);
  };

  const onShowReplyDasRequestInformation = (dasRequest) => {
    setDasRequest(dasRequest);
    setVisibleReplyInformationModal(true);
  };

  return (
    <ModalProvider>
      <DasRequestsList
        dasApplications={dasApplications}
        onEditDasRequest={onEditDasRequest}
        onDeleteDasRequest={onConfirmDeleteDasRequest}
        dasApplicationsLoading={dasApplicationsLoading}
        dasRequest={dasRequest}
        visibleReplyModal={visibleReplyModal}
        onSetVisibleReplyModal={setVisibleReplyModal}
        visibleReplyInformationModal={visibleReplyInformationModal}
        user={authUser}
        onSetVisibleReplyInformationModal={setVisibleReplyInformationModal}
        onAddReplyDasRequest={onAddReplyDasRequest}
        onShowReplyDasRequestInformation={onShowReplyDasRequestInformation}
      />
    </ModalProvider>
  );
};

const DasRequestsList = ({
  dasApplications,
  onEditDasRequest,
  onDeleteDasRequest,
  dasApplicationsLoading,
  dasRequest,
  onAddReplyDasRequest,
  visibleReplyModal,
  onSetVisibleReplyModal,
  visibleReplyInformationModal,
  user,
  onSetVisibleReplyInformationModal,
  onShowReplyDasRequestInformation,
}) => {
  const { isTablet } = useDevice();
  const { onShowModal, onCloseModal } = useModal();

  const onShowDasRequestProceedsModal = () => {
    onShowModal({
      title: "Evaluación de la solicitud",
      width: `${isTablet ? "100%" : "50%"}`,
      centered: false,
      top: 0,
      padding: 0,
      onRenderBody: () => (
        <DasRequestProceedsModal
          onCloseModal={onCloseModal}
          dasRequest={dasRequest}
        />
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
            dasApplications={dasApplications}
            onEditDasRequest={onEditDasRequest}
            onDeleteDasRequest={onDeleteDasRequest}
            dasApplicationsLoading={dasApplicationsLoading}
            onAddReplyDasRequest={onAddReplyDasRequest}
            onShowReplyDasRequestInformation={onShowReplyDasRequestInformation}
            onShowDasRequestProceedsModal={onShowDasRequestProceedsModal}
            user={user}
          />
        </Col>
        <ReplyDasRequestInformationModal
          visibleModal={visibleReplyInformationModal}
          onSetVisibleModal={onSetVisibleReplyInformationModal}
          response={dasRequest?.response}
        />
        <ReplyDasRequestModal
          visibleModal={visibleReplyModal}
          onSetVisibleModal={onSetVisibleReplyModal}
          dasRequest={dasRequest}
        />
      </Row>
    </Acl>
  );
};
