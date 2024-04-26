import React, { useEffect } from "react";
import {
  AddButton,
  AlignmentWrapper,
  Col,
  modalConfirm,
  notification,
  Row,
  Spin,
} from "../../components/ui";
import CorrespondencesTable from "./Correspondences.Table";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { correspondencesRef } from "../../firebase/collections";
import styled from "styled-components";
import { useNavigate } from "react-router";
import { firestore } from "../../firebase";

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
  const onClickCorrespondenceAdd = () => navigateToCorrespondencePage("new");

  const onConfirmDeleteCorrespondence = (correspondenceId) =>
    modalConfirm({
      title: "¿Estás seguro de que quieres eliminar la correspondencia?",
      onOk: () => onDeleteCorrespondence(correspondenceId),
    });

  const onClickDeleteCorrespondence = (correspondenceId) =>
    onConfirmDeleteCorrespondence(correspondenceId);

  const navigateToCorrespondencePage = (correspondenceId) => {
    const url = `/correspondences/${correspondenceId}`;
    onNavigateTo(url);
  };

  const filterCorrespondencesView = correspondences.filter(
    (reception) => reception
  );

  return (
    <Container>
      <div>
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col sm={24} md={12}>
            <AlignmentWrapper align="start">
              <AddButton
                onClick={onClickCorrespondenceAdd}
                title="correspondencia"
                margin="0"
              />
            </AlignmentWrapper>
          </Col>
        </Row>
      </div>
      <div>
        <CorrespondencesTable
          correspondences={filterCorrespondencesView}
          onClickDeleteCorrespondence={onClickDeleteCorrespondence}
        />
      </div>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  gap: 1rem;
  flex-direction: column;
`;
