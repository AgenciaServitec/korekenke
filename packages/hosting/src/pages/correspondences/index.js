import React, { useEffect, useState } from "react";
import {
  Acl,
  AddButton,
  Col,
  modalConfirm,
  notification,
  Row,
  Spin,
} from "../../components/ui";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
  correspondencesRef,
  updateCorrespondence,
} from "../../firebase/collections";
import styled from "styled-components";
import { useNavigate } from "react-router";
import { useDefaultFirestoreProps, useDevice } from "../../hooks";
import {
  CorrespondenceModalProvider,
  useCorrespondenceModal,
} from "./Correspondence.ModalProvider";
import { CorrespondencesTable } from "./Correspondences.Table";
import { ReplyCorrespondenceModal } from "./ReplyCorrespondence";
import { ReplyCorrespondenceInformationModal } from "./ReplyCorrespondenceInformation";
import { useAuthentication } from "../../providers";
import { ReceivedByModal } from "./ReceivedBy";
import { CorrespondenceProceedsModal } from "./CorrespondenceProceeds";
import { fetchEntityManager } from "../../utils";
import { CorrespondenceFilesModal } from "./CorrespondenceFilesModal";

const ENTITY_GU_NAME_ID = "departamento-de-apoyo-social";
const DEPARTMENT_NAME_ID = "mesa-de-partes";

export const CorrespondencesIntegration = () => {
  const navigate = useNavigate();
  const { assignDeleteProps } = useDefaultFirestoreProps();
  const { authUser } = useAuthentication();

  const [correspondences = [], correspondencesLoading, correspondencesError] =
    useCollectionData(
      correspondencesRef
        .where("isDeleted", "==", false)
        .orderBy("createAt", "desc"),
    );

  const [visibleReplyModal, setVisibleReplyModal] = useState(false);
  const [visibleReplyInformationModal, setVisibleReplyInformationModal] =
    useState(false);
  const [visibleReceivedByModal, setVisibleReceivedByModal] = useState(false);
  const [
    visibleCorrespondenceProceedsModal,
    setVisibleCorrespondenceProceedsModal,
  ] = useState(false);
  const [correspondence, setCorrespondence] = useState({});

  useEffect(() => {
    correspondencesError &&
      notification({
        type: "error",
      });
  }, [correspondencesError]);

  const onNavigateTo = (correspondenceId) => navigate(correspondenceId);
  const onGoToDecreeSheets = (correspondenceId) =>
    navigate(`/correspondences/${correspondenceId}/decree/sheets`);
  const onAddCorrespondence = () => onNavigateTo("new");
  const onEditCorrespondence = (correspondenceId) =>
    onNavigateTo(correspondenceId);
  const onConfirmDeleteCorrespondence = async (correspondenceId) =>
    modalConfirm({
      title: "¿Estás seguro de que quieres eliminar la correspondencia?",
      onOk: async () => {
        await updateCorrespondence(
          correspondenceId,
          assignDeleteProps({ isDeleted: true }),
        );

        notification({
          type: "success",
        });
      },
    });

  const onAddReplyCorrespondence = (correspondence) => {
    setCorrespondence(correspondence);
    setVisibleReplyModal(true);
  };

  const onShowReplyCorrespondenceInformation = (correspondence) => {
    setCorrespondence(correspondence);
    setVisibleReplyInformationModal(true);
  };

  const onAddCorrespondenceReceivedBy = (correspondence) => {
    setCorrespondence(correspondence);
    setVisibleReceivedByModal(true);
  };

  const onCorrespondenceProceeds = (correspondence) => {
    setCorrespondence(correspondence);
    setVisibleCorrespondenceProceedsModal(true);
  };

  const onChangeStatusToInProgress = async (correspondence) => {
    const entityGuManager = await fetchEntityManager(ENTITY_GU_NAME_ID);

    if (
      correspondence?.status === "pending" &&
      entityGuManager.id === authUser.id
    ) {
      await updateCorrespondence(correspondence.id, {
        status: "inProgress",
      });
    }
  };

  return (
    <Spin size="large" spinning={correspondencesLoading}>
      <CorrespondenceModalProvider>
        <Correspondences
          entityGuDASNameId={ENTITY_GU_NAME_ID}
          departmentNameId={DEPARTMENT_NAME_ID}
          correspondences={correspondences}
          correspondence={correspondence}
          onChangeStatusToInProgress={onChangeStatusToInProgress}
          onAddCorrespondence={onAddCorrespondence}
          onEditCorrespondence={onEditCorrespondence}
          onConfirmDeleteCorrespondence={onConfirmDeleteCorrespondence}
          onGoToDecreeSheets={onGoToDecreeSheets}
          onAddReplyCorrespondence={onAddReplyCorrespondence}
          visibleReplyModal={visibleReplyModal}
          onSetVisibleReplyModal={setVisibleReplyModal}
          visibleReplyInformationModal={visibleReplyInformationModal}
          onSetVisibleReplyInformationModal={setVisibleReplyInformationModal}
          onShowReplyCorrespondenceInformation={
            onShowReplyCorrespondenceInformation
          }
          visibleReceivedByModal={visibleReceivedByModal}
          onSetVisibleReceivedByModal={setVisibleReceivedByModal}
          onAddCorrespondenceReceivedBy={onAddCorrespondenceReceivedBy}
          visibleCorrespondenceProceedsModal={
            visibleCorrespondenceProceedsModal
          }
          onSetVisibleCorrespondenceProceedsModal={
            setVisibleCorrespondenceProceedsModal
          }
          onCorrespondenceProceeds={onCorrespondenceProceeds}
        />
      </CorrespondenceModalProvider>
    </Spin>
  );
};

const Correspondences = ({
  entityGuDASNameId,
  departmentNameId,
  correspondences,
  correspondence,
  onChangeStatusToInProgress,
  onAddCorrespondence,
  onEditCorrespondence,
  onAddReplyCorrespondence,
  visibleReplyModal,
  onSetVisibleReplyModal,
  visibleReplyInformationModal,
  onSetVisibleReplyInformationModal,
  onShowReplyCorrespondenceInformation,
  visibleReceivedByModal,
  onSetVisibleReceivedByModal,
  onAddCorrespondenceReceivedBy,
  visibleCorrespondenceProceedsModal,
  onSetVisibleCorrespondenceProceedsModal,
  onCorrespondenceProceeds,
}) => {
  const { isTablet } = useDevice();
  const { onShowCorrespondenceModal } = useCorrespondenceModal();

  const filterCorrespondencesView = correspondences.filter(
    (reception) => reception,
  );

  const onCorrespondenceFiles = (correspondence) => {
    onShowCorrespondenceModal({
      title: "Archivos de Correspondencia",
      width: `${isTablet ? "90%" : "50%"}`,
      onRenderBody: () => (
        <CorrespondenceFilesModal correspondence={correspondence} />
      ),
    });
  };

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
            entityGuDASNameId={entityGuDASNameId}
            departmentNameId={departmentNameId}
            correspondences={filterCorrespondencesView}
            onClickEditCorrespondence={onEditCorrespondence}
            onAddReplyCorrespondence={onAddReplyCorrespondence}
            onShowReplyCorrespondenceInformation={
              onShowReplyCorrespondenceInformation
            }
            onAddCorrespondenceReceivedBy={onAddCorrespondenceReceivedBy}
            onCorrespondenceProceeds={onCorrespondenceProceeds}
            onCorrespondenceFiles={onCorrespondenceFiles}
            onChangeStatusToInProgress={onChangeStatusToInProgress}
          />
        </div>
        <ReplyCorrespondenceInformationModal
          visibleModal={visibleReplyInformationModal}
          onSetVisibleModal={onSetVisibleReplyInformationModal}
          response={correspondence?.response}
        />
        <ReplyCorrespondenceModal
          visibleModal={visibleReplyModal}
          onSetVisibleModal={onSetVisibleReplyModal}
          correspondence={correspondence}
        />
        <ReceivedByModal
          visibleModal={visibleReceivedByModal}
          onSetVisibleModal={onSetVisibleReceivedByModal}
          correspondence={correspondence}
        />
        <CorrespondenceProceedsModal
          visibleModal={visibleCorrespondenceProceedsModal}
          onSetVisibleModal={onSetVisibleCorrespondenceProceedsModal}
          correspondence={correspondence}
        />
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
