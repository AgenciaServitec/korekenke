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
} from "../../components";
import { useNavigate } from "react-router";
import { ViewRequestCalendar } from "./ViewRequestCalendar";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
  holidaysRef,
  updateHoliday,
} from "../../firebase/collections/holidays";
import { useDefaultFirestoreProps } from "../../hooks";

export const HolidaysRequestIntegration = () => {
  const navigate = useNavigate();

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
          <div>
            <Row justify="space-between" align="middle" gutter={[16, 16]}>
              <Col span={24}>
                <AddButton onClick={onAddRequest} title="Petición" margin="0" />
              </Col>
            </Row>
          </div>
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
