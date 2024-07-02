import React, { useEffect } from "react";
import {
  Col,
  modalConfirm,
  notification,
  Row,
  Title,
} from "../../../../components";
import { DasRequestsListTable } from "./DasRequestsListTable";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { firestore } from "../../../../firebase";
import { useNavigate } from "react-router";
import { useDefaultFirestoreProps } from "../../../../hooks";
import { updateDasApplication } from "../../../../firebase/collections/dasApplications";

export const DasRequestsListIntegration = () => {
  const navigate = useNavigate();
  const { assignDeleteProps } = useDefaultFirestoreProps();

  const [dasApplications = [], dasApplicationsLoading, dasApplicationsError] =
    useCollectionData(
      firestore.collection("das-applications").where("isDeleted", "==", false)
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

  return (
    <DasRequestsList
      dasApplications={dasApplications}
      onEditDasRequest={onEditDasRequest}
      onDeleteDasRequest={onConfirmDeleteDasRequest}
      dasApplicationsLoading={dasApplicationsLoading}
    />
  );
};

const DasRequestsList = ({
  dasApplications,
  onEditDasRequest,
  onDeleteDasRequest,
  dasApplicationsLoading,
}) => {
  return (
    <Row gutter={[0, 24]}>
      <Col span={24}>
        <Title level={3}>Lista de Solicitudes</Title>
      </Col>
      <Col span={24}>
        <DasRequestsListTable
          dasApplications={dasApplications}
          onEditDasRequest={onEditDasRequest}
          onDeleteDasRequest={onDeleteDasRequest}
          dasApplicationsLoading={dasApplicationsLoading}
        />
      </Col>
    </Row>
  );
};
