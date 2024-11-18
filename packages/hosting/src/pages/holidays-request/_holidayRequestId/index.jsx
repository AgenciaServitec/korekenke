import React from "react";
import styled from "styled-components";
import { SearchHolidays } from "./SearchHolidays";
import { Title } from "../../../components";
import { Space } from "antd";
import { useAuthentication } from "../../../providers";

export const HolidayRequestIntegration = () => {
  const { authUser } = useAuthentication();

  return (
    <Container>
      <Space size={15} style={{ width: "100%" }} direction="vertical">
        <Title level={2}>NUEVAS SOLICITUDES DE VACACIONES</Title>
        <SearchHolidays user={authUser} />
      </Space>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
`;
