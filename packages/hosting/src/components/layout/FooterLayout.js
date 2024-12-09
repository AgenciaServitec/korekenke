import React from "react";
import { Layout } from "antd";
import styled from "styled-components";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { mediaQuery } from "../../styles";

const { Footer } = Layout;

export const FooterLayout = () => {
  return (
    <Footer style={{ textAlign: "center" }}>
      <Container>
        <div>
          korekenke.pe ©2023 Created by <strong>Agencia Servitec</strong>
        </div>
        <div className="secure">
          <p>Tu información 100% segura en nuestra plataforma</p>
          <FontAwesomeIcon icon={faLock} />
        </div>
      </Container>
    </Footer>
  );
};

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;

  ${mediaQuery.minTablet} {
    justify-content: space-between;
  }

  .secure {
    display: flex;
    gap: 1rem;

    p {
      font-weight: 700;
    }
  }
`;
