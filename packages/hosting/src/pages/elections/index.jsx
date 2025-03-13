import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Acl,
  AddButton,
  Col,
  modalConfirm,
  notification,
  Row,
  Spin,
} from "../../components";
import styled from "styled-components";
import { ModalProvider, useAuthentication, useModal } from "../../providers";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { electionsRef, updateElection } from "../../firebase/collections";
import { useDefaultFirestoreProps, useDevice } from "../../hooks";
import { ElectionsTable } from "./ElectionsTable";
import { ElectionStatistics } from "./ElectionStadistics";

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

  const onAddCandidate = (electionId) =>
    onNavigateTo(`add-candidate/${electionId}`);

  const onEditElection = (electionId) => onNavigateTo(electionId);

  const onSubmitVote = (electionId) =>
    onNavigateTo(`submit-vote/${electionId}`);

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
          onAddCandidate={onAddCandidate}
          onEditElection={onEditElection}
          onSubmitVote={onSubmitVote}
          onConfirmDeleteElection={onConfirmDeleteElection}
        />
      </ModalProvider>
    </Spin>
  );
};

const Elections = ({
  user,
  onAddElection,
  onAddCandidate,
  onEditElection,
  onSubmitVote,
  onConfirmDeleteElection,
  elections,
}) => {
  const { isTablet } = useDevice();
  const { onShowModal, onCloseModal } = useModal();

  const isSuperAdmin = user?.roleCode === "super_admin";

  const onShowElectionStatistics = (election) => {
    onShowModal({
      title: `Estadíticas de ${election.title}`,
      width: `${isTablet ? "100%" : "70%"}`,
      onRenderBody: () => <ElectionStatistics election={election} />,
    });
  };

  return (
    <Acl category="public" subCategory="elections" name="/elections" redirect>
      <Container>
        <Row gutter={[16, 16]}>
          {isSuperAdmin && (
            <Col span={24}>
              <AddButton
                onClick={onAddElection}
                type="primary"
                title="Elección"
              />
            </Col>
          )}
          <Col span={24}>
            <ElectionsTable
              user={user}
              elections={elections}
              onClickAddElection={onAddCandidate}
              onClickEditElection={onEditElection}
              onClickSubmitVote={onSubmitVote}
              onClickDeleteElection={onConfirmDeleteElection}
              onShowElectionStatistics={onShowElectionStatistics}
            />
          </Col>
        </Row>
      </Container>
    </Acl>
  );
};

const Container = styled.div``;
