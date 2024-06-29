import React from "react";
import styled from "styled-components";
import { Button, Result } from "../../components";
import { useNavigate } from "react-router";
import { useAuthentication } from "../../providers";

export const Page403 = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthentication();

  const onNavigateToHome = () => {
    authUser ? navigate("/home") : navigate("/");
  };

  return (
    <Container>
      <Result
        status="403"
        title="403"
        subTitle="Lo sentimos, no está autorizado para acceder a esta página."
        extra={
          <Button type="primary" onClick={onNavigateToHome}>
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
