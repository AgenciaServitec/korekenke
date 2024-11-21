import React from "react";
import styled from "styled-components";
import { SearchHolidays } from "./SearchHolidays";
import { Title } from "../../../components";
import { Space } from "antd";
import { useAuthentication } from "../../../providers";
import { useParams } from "react-router";

export const HolidayRequestIntegration = () => {
  const { authUser } = useAuthentication();
  const { holidayRequestId } = useParams();

  return (
    <Container>
      <Space size={15} style={{ width: "100%" }} direction="vertical">
        <Title level={2}>NUEVA SOLICITUD DE VACACIONES</Title>
        <SearchHolidays
          user={authUser}
          holidayRequestId={holidayRequestId || "new"}
        />
      </Space>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
`;
