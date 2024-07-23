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
  fetchEntities,
  fetchUser,
  updateCorrespondence,
} from "../../firebase/collections";
import styled from "styled-components";
import { useNavigate } from "react-router";
import { useDefaultFirestoreProps, useDevice } from "../../hooks";
import {
  CorrespondenceModalProvider,
  useCorrespondenceModal,
} from "./Correspondence.ModalProvider";
import { DecreeModal } from "./DecreeModal";
import { CorrespondencesTable } from "./Correspondences.Table";
import { ReplyCorrespondenceModal } from "./ReplyCorrespondence";
import { ReplyCorrespondenceInformationModal } from "./ReplyCorrespondenceInformation";
import { useAuthentication } from "../../providers";

export const CorrespondencesIntegration = () => {
  const navigate = useNavigate();
  const { assignDeleteProps } = useDefaultFirestoreProps();
  const { authUser } = useAuthentication();

  const [correspondences = [], correspondencesLoading, correspondencesError] =
    useCollectionData(
      correspondencesRef
        .where("isDeleted", "==", false)
        .orderBy("createAt", "desc")
    );
  const [visibleReplyModal, setVisibleReplyModal] = useState(false);
  const [visibleReplyInformatioModal, setVisibleReplyInformationModal] =
    useState(false);
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
          assignDeleteProps({ isDeleted: true })
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

  const onChangeStatusToInProgress = async (correspondence) => {
    if (
      correspondence?.status === "pending" &&
      fetchEntityManager == authUser.id
    )
      await updateCorrespondence(correspondence.id, {
        status: "inProgress",
      });
  };

  const fetchEntityManager = async () => {
    const _entities = await fetchEntities();

    const manageDas = _entities.find(
      (entity) => entity?.nameId === "mesa-de-partes"
    );
    const _entityManager = await fetchUser(manageDas?.entityManageId);

    return _entityManager;
  };

  return (
    <Spin size="large" spinning={correspondencesLoading}>
      <CorrespondenceModalProvider>
        <Correspondences
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
          visibleReplyInformatioModal={visibleReplyInformatioModal}
          onSetVisibleReplyInformationModal={setVisibleReplyInformationModal}
          onShowReplyCorrespondenceInformation={
            onShowReplyCorrespondenceInformation
          }
        />
      </CorrespondenceModalProvider>
    </Spin>
  );
};

const Correspondences = ({
  correspondences,
  correspondence,
  onChangeStatusToInProgress,
  onAddCorrespondence,
  onEditCorrespondence,
  onConfirmDeleteCorrespondence,
  onGoToDecreeSheets,
  onAddReplyCorrespondence,
  visibleReplyModal,
  onSetVisibleReplyModal,
  visibleReplyInformatioModal,
  onSetVisibleReplyInformationModal,
  onShowReplyCorrespondenceInformation,
}) => {
  const { isTablet } = useDevice();
  const { onShowCorrespondenceModal, onCloseCorrespondenceModal } =
    useCorrespondenceModal();

  const filterCorrespondencesView = correspondences.filter(
    (reception) => reception
  );

  const onDecreeCorrespondence = (correspondence) => {
    onShowCorrespondenceModal({
      title: "Decreto",
      width: `${isTablet ? "90%" : "50%"}`,
      onRenderBody: () => (
        <DecreeModal
          correspondence={correspondence}
          onCloseDecreeModal={onCloseCorrespondenceModal}
        />
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
            correspondences={filterCorrespondencesView}
            onChangeStatusToInProgress={onChangeStatusToInProgress}
            onClickEditCorrespondence={onEditCorrespondence}
            onClickDeleteCorrespondence={onConfirmDeleteCorrespondence}
            onDecreeCorrespondence={onDecreeCorrespondence}
            onGoToDecreeSheets={onGoToDecreeSheets}
            onAddReplyCorrespondence={onAddReplyCorrespondence}
            onShowReplyCorrespondenceInformation={
              onShowReplyCorrespondenceInformation
            }
          />
        </div>
        <ReplyCorrespondenceInformationModal
          visibleModal={visibleReplyInformatioModal}
          onSetVisibleModal={onSetVisibleReplyInformationModal}
          response={correspondence?.response}
        />
        <ReplyCorrespondenceModal
          visibleModal={visibleReplyModal}
          onSetVisibleModal={onSetVisibleReplyModal}
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
