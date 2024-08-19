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
import { firestore } from "../../../../firebase";
import { useNavigate } from "react-router";
import { useDefaultFirestoreProps } from "../../../../hooks";
import { updateDasApplication } from "../../../../firebase/collections/dasApplications";
import { useAuthentication } from "../../../../providers";
import { ReplyDasRequestModal } from "./ReplyDasRequest";
import { ReplyDasRequestInformationModal } from "./ReplyDasRequestInformation";
import { CorrespondenceProceeds } from "../../../correspondences/CorrespondenceProceeds";
import { DasRequestProceedsModal } from "./DasRequestProceedsModal";

export const DasRequestsListIntegration = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthentication();
  const { assignDeleteProps } = useDefaultFirestoreProps();

  const [visibleReplyModal, setVisibleReplyModal] = useState(false);
  const [visibleReplyInformationModal, setVisibleReplyInformationModal] =
    useState(false);
  const [visibledDasRequestProceeds, setVisibledDasRequestProceeds] =
    useState(false);
  const [dasRequest, setDasRequest] = useState(null);

  const dasApplicationsRef = firestore
    .collection("das-applications")
    .where("isDeleted", "==", false);

  const [dasApplications = [], dasApplicationsLoading, dasApplicationsError] =
    useCollectionData(
      [
        "super_admin",
        "manager",
        "department_boss",
        "department_assistant",
      ].includes(authUser.roleCode)
        ? dasApplicationsRef.where("isDeleted", "==", false) || null
        : dasApplicationsRef
            .where("isDeleted", "==", false)
            .where("headline.id", "==", authUser.id)
    );

  useEffect(() => {
    dasApplicationsError && notification({ type: "error" });
  }, [dasApplicationsError]);

  const navigateTo = (pathname = "new") => navigate(pathname);
  const onEditDasRequest = (dasRequest) => navigateTo(dasRequest.id);
  const onConfirmDeleteDasRequest = async (dasRequest) => {
    modalConfirm({
      title: "¿Estás seguro que quieres eliminar la solicitud?",
      onOk: async () => {
        await updateDasApplication(
          dasRequest.id,
          assignDeleteProps({ isDeleted: true })
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

  const onDasRequestProceeds = (dasRequest) => {
    setDasRequest(dasRequest);
    setVisibledDasRequestProceeds(true);
  };

  return (
    <DasRequestsList
      dasApplications={dasApplications}
      onEditDasRequest={onEditDasRequest}
      onDeleteDasRequest={onConfirmDeleteDasRequest}
      dasApplicationsLoading={dasApplicationsLoading}
      dasRequest={dasRequest}
      visibleReplyModal={visibleReplyModal}
      onSetVisibleReplyModal={setVisibleReplyModal}
      visibleReplyInformationModal={visibleReplyInformationModal}
      visibledDasRequestProceeds={visibledDasRequestProceeds}
      onSetVisibledDasRequestProceeds={setVisibledDasRequestProceeds}
      onDasRequestProceeds={onDasRequestProceeds}
      user={authUser}
      onSetVisibleReplyInformationModal={setVisibleReplyInformationModal}
      onAddReplyDasRequest={onAddReplyDasRequest}
      onShowReplyDasRequestInformation={onShowReplyDasRequestInformation}
    />
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
  visibledDasRequestProceeds,
  onSetVisibledDasRequestProceeds,
  onDasRequestProceeds,
  user,
  onSetVisibleReplyInformationModal,
  onShowReplyDasRequestInformation,
}) => {
  return (
    <Acl
      category="departamento-de-apoyo-social"
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
            onDasRequestProceeds={onDasRequestProceeds}
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
        <DasRequestProceedsModal
          visibleModal={visibledDasRequestProceeds}
          onSetVisibleModal={onSetVisibledDasRequestProceeds}
          dasRequest={dasRequest}
        />
      </Row>
    </Acl>
  );
};
