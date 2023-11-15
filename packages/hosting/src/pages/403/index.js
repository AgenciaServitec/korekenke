import React from "react";
import styled from "styled-components";
import Button from "antd/lib/button";
import Result from "antd/lib/result";
import { useNavigate } from "react-router";

export const Page403 = () => {
  const navigate = useNavigate();

  const navigateToInitialPage = () => navigate("/");

  return (
    <Container>
      <Result
        status="403"
        title="403"
        subTitle="Lo sentimos, no está autorizado para acceder a esta página."
        extra={
          <Button type="primary" onClick={() => navigateToInitialPage()}>
            Ir a pagina de inicio
          </Button>
        }
      />
    </Container>
  );
};

const Container = styled.section`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;
