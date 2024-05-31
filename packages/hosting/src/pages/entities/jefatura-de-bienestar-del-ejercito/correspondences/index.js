import React, { useEffect } from "react";
import {
  Acl,
  AddButton,
  Col,
  modalConfirm,
  notification,
  Row,
  Spin,
} from "../../../../components/ui";
import CorrespondencesTable from "./Correspondences.Table";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { correspondencesRef } from "../../../../firebase/collections";
import styled from "styled-components";
import { useNavigate } from "react-router";

export const CorrespondencesIntegration = () => {
  const navigate = useNavigate();

  const [correspondences = [], correspondencesLoading, correspondencesError] =
    useCollectionData(
      correspondencesRef
        .where("isDeleted", "==", false)
        .orderBy("createAt", "desc")
    );

  useEffect(() => {
    if (correspondencesError) {
      console.error(correspondencesError);

      notification({
        type: "error",
        title: "Error al obtener las correspondencias",
      });
    }
  }, [correspondencesError]);

  const onDeleteCorrespondence = async (correspondenceId) => {
    await correspondencesRef.doc(correspondenceId).update({
      isDeleted: true,
    });

    notification({
      type: "success",
      title: "Correspondencia eliminada",
    });
  };

  const onNavigateTo = (pathname) => navigate(pathname);

  return (
    <Spin size="large" spinning={correspondencesLoading}>
      <Correspondence
        onNavigateTo={onNavigateTo}
        correspondences={correspondences}
        onDeleteCorrespondence={onDeleteCorrespondence}
      />
    </Spin>
  );
};

const Correspondence = ({
  onNavigateTo,
  correspondences,
  onDeleteCorrespondence,
}) => {
  const navigateToCorrespondencePage = (correspondenceId) =>
    onNavigateTo(`/correspondences/${correspondenceId}`);

  const onClickCorrespondenceAdd = () => navigateToCorrespondencePage("new");

  const onConfirmDeleteCorrespondence = (correspondenceId) =>
    modalConfirm({
      title: "¿Estás seguro de que quieres eliminar la correspondencia?",
      onOk: () => onDeleteCorrespondence(correspondenceId),
    });

  const onClickEditCorrespondence = (correspondenceId) =>
    navigateToCorrespondencePage(correspondenceId);

  const onClickDeleteCorrespondence = (correspondenceId) =>
    onConfirmDeleteCorrespondence(correspondenceId);

  const filterCorrespondencesView = correspondences.filter(
    (reception) => reception
  );

  return (
    <Acl redirect name="/correspondences">
      <Container>
        <div>
          <Row justify="space-between" align="middle" gutter={[16, 16]}>
            <Col span={24}>
              <AddButton
                onClick={onClickCorrespondenceAdd}
                title="correspondencia"
                margin="0"
              />
            </Col>
          </Row>
        </div>
        <div>
          <CorrespondencesTable
            correspondences={filterCorrespondencesView}
            onClickEditCorrespondence={onClickEditCorrespondence}
            onClickDeleteCorrespondence={onClickDeleteCorrespondence}
          />
        </div>
      </Container>
    </Acl>
  );
};

const Container = styled.div`
  display: flex;
  gap: 1rem;
  flex-direction: column;

  .capitalize {
    text-transform: capitalize;
  }
`;
