import React, { useState } from "react";
import styled from "styled-components";
import { HolidaysTable } from "./holidaysTable";
import { Acl, Row, Col, Title, AddButton } from "../../components";
import { useNavigate } from "react-router";
import { ViewRequestCalendar } from "./ViewRequestCalendar";
import calendarData from "../../data-list/holidaysTemp.json";

export const HolidaysRequestIntegration = () => {
  const navigate = useNavigate();

  // const navigateTo = (pathname = "new") => navigate(pathname);

  const [visibleModal, setVisibleModal] = useState(false);
  const [request, setRequest] = useState(null);

  const onShowCalendarModal = (request) => {
    setRequest(request);
    setVisibleModal(true);
  };

  const onAddRequest = () => navigate("new");

  return (
    <HolidayList
      visibleModal={visibleModal}
      onSetVisibleModal={setVisibleModal}
      onShowCalendarModal={onShowCalendarModal}
      calendarData={calendarData}
      request={request}
      onAddRequest={onAddRequest}
    />
  );
};

const HolidayList = ({
  visibleModal,
  onSetVisibleModal,
  onShowCalendarModal,
  onAddRequest,
  request,
  calendarData,
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
            <HolidaysTable onShowCalendarModal={onShowCalendarModal} />
          </Col>
        </Row>
        <ViewRequestCalendar
          visibleModal={visibleModal}
          onSetVisibleModal={onSetVisibleModal}
          calendarData={calendarData}
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
