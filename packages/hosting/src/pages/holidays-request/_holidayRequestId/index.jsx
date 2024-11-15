import React from "react";
import styled from "styled-components";
import { SearchHolidays } from "./SearchHolidays";
import { HolidaysCalendar } from "./HolidaysCalendar";
import { Title } from "../../../components";
import { Space } from "antd";

export const HolidayRequestIntegration = () => {
  return (
    <Container>
      <Space size={40} style={{ width: "100%" }} direction="vertical">
        <Title level={3}>Nueva Solicitud de Vacaciones</Title>
        <SearchHolidays />
      </Space>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
`;
