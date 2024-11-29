import React, { useEffect } from "react";
import styled from "styled-components";
import { HolidaysTable } from "./holidaysTable";
import {
  Acl,
  AddButton,
  Alert,
  Col,
  Flex,
  FullCalendarComponent,
  modalConfirm,
  notification,
  Row,
  Title,
} from "../../components";
import { useNavigate } from "react-router";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
  holidaysRef,
  updateHoliday,
} from "../../firebase/collections/holidays";
import { useDefaultFirestoreProps, useDevice } from "../../hooks";
import { ModalProvider, useAuthentication, useModal } from "../../providers";
import dayjs from "dayjs";
import { DATE_FORMAT_TO_FIRESTORE } from "../../firebase/firestore";
import { HolidayRequestProceedsModal } from "./HolidayRequestProceeds";
import { HolidayRequestReply } from "./HolidayRequestReply";
import { HolidayRequestInformation } from "./HolidayRequestInformation";

const FORMAT_DATE_FULLCALENDAR = "YYYY-MM-DD";

export const HolidaysRequestIntegration = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthentication();

  const { assignDeleteProps } = useDefaultFirestoreProps();

  const [holidays = [], holidaysLoading, holidaysError] = useCollectionData(
    holidaysRef.where("isDeleted", "==", false),
  );

  console.log("holidays", holidays);

  useEffect(() => {
    holidaysError && notification({ type: "error" });
  }, [holidaysError]);

  const onEditHolidayRequest = (request) =>
    navigate(`/holidays-request/${request.id}`);
  const onGoToSheets = (userId) =>
    navigate(`/holidays-request/sheets/${userId || authUser.id}`);

  const onConfirmDeleteHolidayRequest = async (request) => {
    modalConfirm({
      onOk: async () => {
        await updateHoliday(request.id, assignDeleteProps({ isDeleted: true }));
      },
    });
  };

  const onAddRequest = () => navigate("new");

  return (
    <ModalProvider>
      <HolidayList
        holidaysLoading={holidaysLoading}
        holidays={holidays}
        user={authUser}
        onEditHolidayRequest={onEditHolidayRequest}
        onConfirmDeleteHolidayRequest={onConfirmDeleteHolidayRequest}
        onAddRequest={onAddRequest}
        onGoToSheets={onGoToSheets}
      />
    </ModalProvider>
  );
};

const HolidayList = ({
  holidaysLoading,
  holidays,
  user,
  onEditHolidayRequest,
  onConfirmDeleteHolidayRequest,
  onAddRequest,
}) => {
  const { isTablet } = useDevice();
  const { onShowModal, onCloseModal } = useModal();

  const onShowCalendar = (holiday) => {
    onShowModal({
      title: "Calendario de vacaciones",
      width: `${isTablet ? "90%" : "50%"}`,
      onRenderBody: () => (
        <FullCalendarComponent
          key={holiday.id}
          startDate={dayjs(holiday?.startDate, DATE_FORMAT_TO_FIRESTORE).format(
            FORMAT_DATE_FULLCALENDAR,
          )}
          endDate={dayjs(holiday?.endDate, DATE_FORMAT_TO_FIRESTORE)
            .add(1, "day")
            .format(FORMAT_DATE_FULLCALENDAR)}
        />
      ),
    });
  };

  const onEvaluationHolidayRequest = (holiday) => {
    onShowModal({
      title: "Evaluación de la solicitud",
      width: `${isTablet ? "90%" : "50%"}`,
      onRenderBody: () => (
        <HolidayRequestProceedsModal
          key={holiday.id}
          holidayRequest={holiday}
          onCloseModal={onCloseModal}
        />
      ),
    });
  };

  const onAddReplyHolidayRequest = (holiday) => {
    onShowModal({
      title: "Responder solicitud",
      width: `${isTablet ? "90%" : "50%"}`,
      onRenderBody: () => (
        <HolidayRequestReply
          key={holiday.id}
          holidayRequest={holiday}
          onCloseModal={onCloseModal}
        />
      ),
    });
  };

  const onShowHolidayRequestInformation = (holiday) => {
    onShowModal({
      title: "Información de respuesta",
      width: `${isTablet ? "90%" : "50%"}`,
      onRenderBody: () => (
        <HolidayRequestInformation key={holiday.id} holidayRequest={holiday} />
      ),
    });
  };

  return (
    <Acl
      category="public"
      subCategory="holidaysRequest"
      name="/holidays-request"
      redirect
    >
      <Container>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <div className="header-content">
              <Title level={2}>SOLICITUDES DE VACACIONES</Title>
            </div>
          </Col>
          <Col span={24}>
            <Alert
              type="info"
              size="small"
              message="Recuerde que tiene hasta 1 día para modificar sus solicitudes, luego ya no se podrá modificar, ni eliminar"
            />
          </Col>
          <Col span={24}>
            <Flex
              gap="middle"
              justify="space-between"
              wrap="wrap"
              style={{ width: "100%" }}
            >
              <AddButton onClick={onAddRequest} title="Petición" margin="0" />
            </Flex>
          </Col>
          <Col span={24}>
            <HolidaysTable
              loading={holidaysLoading}
              user={user}
              holidays={holidays}
              onConfirmDeleteHolidayRequest={onConfirmDeleteHolidayRequest}
              onEditHolidayRequest={onEditHolidayRequest}
              onShowCalendar={onShowCalendar}
              onEvaluationHolidayRequest={onEvaluationHolidayRequest}
              onAddReplyHolidayRequest={onAddReplyHolidayRequest}
              onShowHolidayRequestInformation={onShowHolidayRequestInformation}
            />
          </Col>
        </Row>
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
