import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router";
import Button from "antd/lib/button";
import Result from "antd/lib/result";
import { useAuthentication, useCommand } from "../../providers";
import { pathnameWithCommand } from "../../utils";

export const Page404 = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthentication();
  const { currentCommand, onNavigateInCommand } = useCommand();

  const onNavigateToHome = () => {
    authUser
      ? onNavigateInCommand(authUser.initialCommand.id)
      : navigate(pathnameWithCommand(currentCommand.id, "/home"));
  };

  return (
    <Container>
      <Result
        status="404"
        title="404"
        subTitle="Lo sentimos, la página que visitaste no existe."
        extra={
          <Button type="primary" onClick={() => onNavigateToHome()}>
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
