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
import { firestore } from "../../../../firebase";
import { useNavigate } from "react-router";
import { useDefaultFirestoreProps } from "../../../../hooks";
import { updateDasApplication } from "../../../../firebase/collections/dasApplications";
import { useAuthentication } from "../../../../providers";

export const DasRequestsListIntegration = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthentication();
  const { assignDeleteProps } = useDefaultFirestoreProps();

  const dasApplicationsRef = firestore
    .collection("das-applications")
    .where("isDeleted", "==", false);

  const [dasApplications = [], dasApplicationsLoading, dasApplicationsError] =
    useCollectionData(
      ["super_admin", "manager", "department_boss"].includes(authUser.roleCode)
        ? dasApplicationsRef || null
        : dasApplicationsRef.where("headline.id", "==", authUser.id)
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
          />
        </Col>
      </Row>
    </Acl>
  );
};
