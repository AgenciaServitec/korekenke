import React, { useEffect } from "react";
import styled from "styled-components";
import { HolidaysTable } from "./holidaysTable";
import {
  Acl,
  AddButton,
  Alert,
  Button,
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { ModalProvider, useAuthentication, useModal } from "../../providers";
import dayjs from "dayjs";
import { DATE_FORMAT_TO_FIRESTORE } from "../../firebase/firestore";

const FORMAT_DATE_FULLCALENDAR = "YYYY-MM-DD";

export const HolidaysRequestIntegration = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthentication();

  const { assignDeleteProps } = useDefaultFirestoreProps();

  const [holidays, holidaysLoading, holidaysError] = useCollectionData(
    holidaysRef.where("isDeleted", "==", false),
  );

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
  onEditHolidayRequest,
  onConfirmDeleteHolidayRequest,
  onAddRequest,
  onGoToSheets,
}) => {
  const { isTablet } = useDevice();
  const { onShowModal } = useModal();

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
          endDate={dayjs(holiday?.endDate, DATE_FORMAT_TO_FIRESTORE).format(
            FORMAT_DATE_FULLCALENDAR,
          )}
        />
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
              <Title level={3}>Lista de Peticiones</Title>
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
              <Button
                type="primary"
                danger
                icon={<FontAwesomeIcon icon={faFilePdf} />}
                size="large"
                onClick={() => onGoToSheets()}
              >
                Pdf
              </Button>
            </Flex>
          </Col>
          <Col span={24}>
            <HolidaysTable
              loading={holidaysLoading}
              holidays={holidays}
              onConfirmDeleteHolidayRequest={onConfirmDeleteHolidayRequest}
              onEditHolidayRequest={onEditHolidayRequest}
              onShowCalendar={onShowCalendar}
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
