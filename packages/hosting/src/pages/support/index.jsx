import React, { useState } from "react";
import styled from "styled-components";
import { Row } from ".././.././components";
import { Col } from "antd";
import { Menu } from "../../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faContactCard, faVideo } from "@fortawesome/free-solid-svg-icons";
import { Contact } from "./Contact";
import { Tutorials } from "./Tutorials";
import { darken } from "polished";

export const Support = () => {
  const [open, setOpen] = useState("contact");

  const itemsMenu = [
    {
      label: "Contacto",
      key: "contact",
      icon: <FontAwesomeIcon icon={faContactCard} size="lg" />,
      onClick: () => setOpen("contact"),
    },
    {
      label: "Tutoriales",
      key: "tutorials",
      icon: <FontAwesomeIcon icon={faVideo} size="lg" />,
      onClick: () => setOpen("tutorials"),
    },
  ];

  return (
    <Container>
      <Row className="contact-list"> Centro de ayuda </Row>

      <Row gutter={[16, 16]}>
        <Col span={24} sm={6} className="sidebar">
          <Menu defaultSelectedKeys={["1"]} mode="inline" items={itemsMenu} />
        </Col>
        <Col span={24} sm={18}>
          <div className="content-wrapper">
            {open === "contact" && <Contact />}
            {open === "tutorials" && <Tutorials />}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

const Container = styled.div`
  width: 100vw;
  height: auto;
  min-height: 100svh;

  .sidebar {
    background: ${({ theme }) => darken(0.1, theme.colors.secondary)};
  }

  .content-wrapper {
    padding: 1em;
  }

  .contact-list {
    background: ${({ theme }) => darken(0.1, theme.colors.secondary)};
    height: 5vw;
    font-size: 20px;
    color: white;
    align-items: center;
    padding-left: 25px;
  }
`;
