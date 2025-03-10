import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Acl,
  Col,
  Row,
  Spin,
  AddButton,
  notification,
  modalConfirm,
} from "../../components";
import styled from "styled-components";
import { ModalProvider, useAuthentication } from "../../providers";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { electionsRef, updateElection } from "../../firebase/collections";
import { useDefaultFirestoreProps, useDevice } from "../../hooks";
import { ElectionsTable } from "./ElectionsTable";

export const Election = () => {
  const navigate = useNavigate();
  const { assignDeleteProps } = useDefaultFirestoreProps();
  const { authUser } = useAuthentication();

  const [elections = [], electionsLoading, electionsError] = useCollectionData(
    electionsRef.where("isDeleted", "==", false),
  );

  useEffect(() => {
    electionsError &&
      notification({
        type: "error",
      });
  }, [electionsError]);

  const onNavigateTo = (electionId) => navigate(electionId);

  const onAddElection = () => navigate("new");

  const onEditElection = (electionId) => onNavigateTo(electionId);

  const onConfirmDeleteElection = async (electionId) =>
    modalConfirm({
      title: "¿Estás seguro de eliminar esta elección?",
      onOk: async () => {
        await updateElection(
          electionId,
          assignDeleteProps({ isDeleted: true }),
        );
      },
    });

  return (
    <Spin size="large" spinning={electionsLoading}>
      <ModalProvider>
        <Elections
          user={authUser}
          elections={elections}
          onAddElection={onAddElection}
          onEditElection={onEditElection}
          onConfirmDeleteElection={onConfirmDeleteElection}
        />
      </ModalProvider>
    </Spin>
  );
};

const Elections = ({
  user,
  onAddElection,
  onEditElection,
  onConfirmDeleteElection,
  elections,
}) => {
  return (
    <Acl category="public" subCategory="elections" name="/elections" redirect>
      <Container>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <AddButton
              onClick={onAddElection}
              type="primary"
              title="Elección"
            />
          </Col>
          <Col span={24}>
            <ElectionsTable
              user={user}
              elections={elections}
              onClickEditElection={onEditElection}
              onClickDeleteElection={onConfirmDeleteElection}
            />
          </Col>
        </Row>
      </Container>
    </Acl>
  );
};

const Container = styled.div``;
