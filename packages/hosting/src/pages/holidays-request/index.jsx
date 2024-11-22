import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { HolidaysTable } from "./holidaysTable";
import {
  Acl,
  AddButton,
  Col,
  modalConfirm,
  notification,
  Row,
  Title,
  Flex,
  Alert,
  Button,
} from "../../components";
import { useNavigate } from "react-router";
import { ViewRequestCalendar } from "./ViewRequestCalendar";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
  holidaysRef,
  updateHoliday,
} from "../../firebase/collections/holidays";
import { useDefaultFirestoreProps } from "../../hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { useAuthentication } from "../../providers";

export const HolidaysRequestIntegration = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthentication();

  const { assignDeleteProps } = useDefaultFirestoreProps();
  const [holidays, holidaysLoading, holidaysError] = useCollectionData(
    holidaysRef.where("isDeleted", "==", false),
  );

  const [visibleModal, setVisibleModal] = useState(false);
  const [request, setRequest] = useState(null);

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

  const onShowCalendarModal = (holiday) => {
    setRequest(holiday);
    setVisibleModal(true);
  };

  const onAddRequest = () => navigate("new");

  return (
    <HolidayList
      request={request}
      holidaysLoading={holidaysLoading}
      holidays={holidays}
      onEditHolidayRequest={onEditHolidayRequest}
      onConfirmDeleteHolidayRequest={onConfirmDeleteHolidayRequest}
      visibleModal={visibleModal}
      onSetVisibleModal={setVisibleModal}
      onShowCalendarModal={onShowCalendarModal}
      onAddRequest={onAddRequest}
      onGoToSheets={onGoToSheets}
    />
  );
};

const HolidayList = ({
  request,
  holidaysLoading,
  holidays,
  onEditHolidayRequest,
  onConfirmDeleteHolidayRequest,
  visibleModal,
  onSetVisibleModal,
  onShowCalendarModal,
  onAddRequest,
  onGoToSheets,
}) => {
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
              onShowCalendarModal={onShowCalendarModal}
            />
          </Col>
        </Row>
        <ViewRequestCalendar
          visibleModal={visibleModal}
          onSetVisibleModal={onSetVisibleModal}
          request={request}
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
