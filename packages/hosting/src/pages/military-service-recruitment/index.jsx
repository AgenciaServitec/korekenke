import React, { useEffect, useState } from "react";
import {
  militaryRecruitmentRef,
  updateMilitaryRecruitment,
} from "../../firebase/collections";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
  Acl,
  Button,
  Col,
  modalConfirm,
  notification,
  Row,
  Title,
} from "../../components";
import { useNavigate } from "react-router-dom";
import { useDefaultFirestoreProps } from "../../hooks";
import { MilitaryRecruitmentTable } from "./militaryRecruitmentTable";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartPie } from "@fortawesome/free-solid-svg-icons";
import { ReplyMilitaryServiceRecruitment } from "./ReplyMilitaryServiceRecruitment";
import { ReplyMilitaryServiceRecruitmentInformation } from "./ReplyMilitaryServiceRecruitmentInformation";

export const MilitaryRecruitmentServicesIntegration = () => {
  const navigate = useNavigate();
  const { assignDeleteProps } = useDefaultFirestoreProps();
  const [
    militaryRecruitment,
    militaryRecruitmentLoading,
    militaryRecruitmentError,
  ] = useCollectionData(militaryRecruitmentRef.where("isDeleted", "==", false));

  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleModalReplyInformation, setVisibleModalReplyInformation] =
    useState(false);
  const [military, setMilitary] = useState(null);

  useEffect(() => {
    militaryRecruitmentError && notification({ type: "error" });
  }, [militaryRecruitmentError]);

  const navigateTo = (pathname = "new") => navigate(pathname);

  const onEditMilitaryRecruitment = (recruited) => navigateTo(recruited.id);

  const onConfirmDeleteMilitaryRecruitment = async (recruited) => {
    modalConfirm({
      title: "¿Estás seguro que quieres eliminar la solicitud?",
      onOk: async () => {
        await updateMilitaryRecruitment(
          recruited.id,
          assignDeleteProps({ isDeleted: true }),
        );
      },
    });
  };

  const onShowReplyModal = (military) => {
    setMilitary(military);
    setVisibleModal(true);
  };

  const onShowReplyInformationModal = (military) => {
    setMilitary(military);
    setVisibleModalReplyInformation(true);
  };

  return (
    <MilitaryRecruitmentServiceList
      militaryRecruitmentLoading={militaryRecruitmentLoading}
      militaryRecruitment={militaryRecruitment}
      onEditMilitaryRecruitment={onEditMilitaryRecruitment}
      onConfirmDeleteMilitaryRecruitment={onConfirmDeleteMilitaryRecruitment}
      visibleModal={visibleModal}
      onSetVisibleModal={setVisibleModal}
      onShowReplyModal={onShowReplyModal}
      military={military}
      visibleModalReplyInformation={visibleModalReplyInformation}
      onSetvisibleModalReplyInformation={setVisibleModalReplyInformation}
      onShowReplyInformationModal={onShowReplyInformationModal}
    />
  );
};

const MilitaryRecruitmentServiceList = ({
  militaryRecruitmentLoading,
  militaryRecruitment,
  onEditMilitaryRecruitment,
  onConfirmDeleteMilitaryRecruitment,
  visibleModal,
  onSetVisibleModal,
  onShowReplyModal,
  visibleModalReplyInformation,
  onSetvisibleModalReplyInformation,
  onShowReplyInformationModal,
  military,
}) => {
  const onGoToStatistics = () =>
    window.open("https://lookerstudio.google.com/s/laniAI0kxnA", "_blank");

  return (
    <Acl
      category="public"
      subCategory="militaryServiceRecruitment"
      name="/military-service-recruitment"
      redirect
    >
      <Container>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <div className="header-content">
              <Title level={3}>Lista de Registrados</Title>
              <Button
                type="primary"
                icon={<FontAwesomeIcon icon={faChartPie} />}
                onClick={() => onGoToStatistics()}
              >
                {" "}
                Ver estadísticas
              </Button>
            </div>
          </Col>
          <Col span={24}>
            <MilitaryRecruitmentTable
              loading={militaryRecruitmentLoading}
              militaryRecruitment={militaryRecruitment}
              onEditMilitaryRecruitment={onEditMilitaryRecruitment}
              onConfirmDeleteMilitaryRecruitment={
                onConfirmDeleteMilitaryRecruitment
              }
              onShowReplyModal={onShowReplyModal}
              onShowReplyInformationModal={onShowReplyInformationModal}
            />
          </Col>
        </Row>
        <ReplyMilitaryServiceRecruitment
          visibleModal={visibleModal}
          onSetVisibleModal={onSetVisibleModal}
          military={military}
        />
        <ReplyMilitaryServiceRecruitmentInformation
          visibleModal={visibleModalReplyInformation}
          onSetVisibleModal={onSetvisibleModalReplyInformation}
          response={military?.response}
        />
      </Container>
    </Acl>
  );
};

const Container = styled.div`
  .header-content {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1em;
  }
`;
