import React, { useEffect } from "react";
import {
  Acl,
  modalConfirm,
  notification,
  Spin,
  Row,
  Col,
  AddButton,
} from "../../components";
import { useNavigate } from "react-router";
import { useDefaultFirestoreProps, useDevice } from "../../hooks";
import { ModalProvider, useAuthentication, useModal } from "../../providers";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { updateVisit, visitsRef } from "../../firebase/collections";
import { VisitsTable } from "./VisitsTable";
import { IOChecker } from "./IOChecker";
import { DasRequestProceedsModal } from "../entities/departamento-de-apoyo-social/das-requests/DasRequestProceedsModal";
import { VisitReply } from "./VisitReply";

export const Visits = () => {
  const navigate = useNavigate();
  const { assignDeleteProps } = useDefaultFirestoreProps();
  const { authUser } = useAuthentication();

  const [visits = [], visitsLoading, visitsError] = useCollectionData(
    visitsRef.where("isDeleted", "==", false),
  );

  useEffect(() => {
    visitsError &&
      notification({
        type: "error",
      });
  }, [visitsError]);

  const onNavigateTo = (visitId) => navigate(visitId);

  const onAddVisit = () => navigate("new");

  const onEditVisit = (visitId) => onNavigateTo(visitId);

  const onConfirmDeleteVisit = async (visitId) =>
    modalConfirm({
      title: "¿Estás seguro de eliminar esta visita?",
      onOk: async () => {
        await updateVisit(visitId, assignDeleteProps({ isDeleted: true }));
      },
    });

  return (
    <Spin size="large" spinning={visitsLoading}>
      <ModalProvider>
        <VisitsList
          user={authUser}
          visits={visits}
          onAddVisit={onAddVisit}
          onEditVisit={onEditVisit}
          onConfirmDeleteVisit={onConfirmDeleteVisit}
        />
      </ModalProvider>
    </Spin>
  );
};

const VisitsList = ({
  user,
  onAddVisit,
  onEditVisit,
  onConfirmDeleteVisit,
  visits,
}) => {
  const { isTablet } = useDevice();
  const { onShowModal, onCloseModal } = useModal();

  const onConfirmIOChecker = (visit, type) => {
    onShowModal({
      title: `Registrar ${type === "entry" ? "Entrada" : "Salida"}`,
      textAlign: "center",
      width: "50%",
      onRenderBody: () => (
        <IOChecker visit={visit} onCloseModal={onCloseModal} type={type} />
      ),
    });
  };

  const onShowVisitReplyModal = (visit) => {
    onShowModal({
      title: "Solicitud de Visita",
      width: `${isTablet ? "100%" : "50%"}`,
      centered: false,
      top: 0,
      padding: 0,
      clearOnDestroy: true,
      onRenderBody: () => (
        <VisitReply onCloseModal={onCloseModal} visit={visit} />
      ),
    });
  };

  return (
    <Acl category="public" subCategory="visits" name="/visits" redirect>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <AddButton onClick={onAddVisit} type="primary" title="Visita" />
        </Col>
        <Col span={24}>
          <VisitsTable
            user={user}
            visits={visits}
            onClickAddVisit={onAddVisit}
            onClickEditVisit={onEditVisit}
            onConfirmIOChecker={onConfirmIOChecker}
            onShowVisitReplyModal={onShowVisitReplyModal}
            onClickDeleteVisit={onConfirmDeleteVisit}
          />
        </Col>
      </Row>
    </Acl>
  );
};
