import React, { useEffect } from "react";
import {
  Acl,
  AddButton,
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

export const CorrespondencesIntegration = () => {
  const navigate = useNavigate();

  const [correspondences = [], correspondencesLoading, correspondencesError] =
    useCollectionData(
      correspondencesRef
        .where("isDeleted", "==", false)
        .orderBy("createAt", "desc")
    );

  useEffect(() => {
    correspondencesError &&
      notification({
        type: "error",
      });
  }, [correspondencesError]);

  const onNavigateTo = (correspondenceId) => navigate(correspondenceId);

  const onAddCorrespondence = () => onNavigateTo("new");
  const onEditCorrespondence = (correspondenceId) =>
    onNavigateTo(correspondenceId);
  const onConfirmDeleteCorrespondence = async (correspondenceId) =>
    modalConfirm({
      title: "¿Estás seguro de que quieres eliminar la correspondencia?",
      onOk: async () => {
        await correspondencesRef.doc(correspondenceId).update({
          isDeleted: true,
        });

        notification({
          type: "success",
          title: "Correspondencia eliminada",
        });
      },
    });

  return (
    <Spin size="large" spinning={correspondencesLoading}>
      <Correspondences
        correspondences={correspondences}
        onAddCorrespondence={onAddCorrespondence}
        onEditCorrespondence={onEditCorrespondence}
        onConfirmDeleteCorrespondence={onConfirmDeleteCorrespondence}
      />
    </Spin>
  );
};

const Correspondences = ({
  correspondences,
  onAddCorrespondence,
  onEditCorrespondence,
  onConfirmDeleteCorrespondence,
}) => {
  const filterCorrespondencesView = correspondences.filter(
    (reception) => reception
  );

  return (
    <Acl
      category="public"
      subCategory="correspondences"
      name="/correspondences"
      redirect
    >
      <Container>
        <div>
          <Row justify="space-between" align="middle" gutter={[16, 16]}>
            <Col span={24}>
              <AddButton
                onClick={onAddCorrespondence}
                title="correspondencia"
                margin="0"
              />
            </Col>
          </Row>
        </div>
        <div>
          <CorrespondencesTable
            correspondences={filterCorrespondencesView}
            onClickEditCorrespondence={onEditCorrespondence}
            onClickDeleteCorrespondence={onConfirmDeleteCorrespondence}
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
