import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router";
import { Button, Result } from "../../components";

export const Page404 = () => {
  const navigate = useNavigate();

  const onGoBack = () => navigate(-1);

  return (
    <Container>
      <Result
        status="404"
        title="404"
        subTitle="Lo sentimos, la página que visitaste no existe."
        extra={
          <Button type="primary" onClick={() => onGoBack()}>
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
