import React from "react";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import { PhotoNoFound } from "../../images";
import styled from "styled-components";
import { Image } from "antd";

export const ProfileInformation = ({ user }) => {
  return (
    <Container>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <div className="profile-photo-wrapper">
            <div className="avatar-item">
              <Image
                width={200}
                src={user?.profilePhoto?.thumbUrl || PhotoNoFound}
                className="profile-photo"
              />
            </div>
          </div>
          <br />
        </Col>
        <Col span={24}>
          <DescriptionItem title="Nombres" content={user?.firstName || ""} />
        </Col>
        <Col span={24} md={12}>
          <DescriptionItem
            title="Apellido Paterno"
            content={user?.paternalSurname}
          />
        </Col>
        <Col span={24} md={12}>
          <DescriptionItem
            title="Apellido Materno"
            content={user?.maternalSurname}
          />
        </Col>
        <Col span={24} md={12}>
          <DescriptionItem title="DNI" content={user?.dni || ""} />
        </Col>
        <Col span={24} md={12}>
          <DescriptionItem title="CIP" content={user?.cip} />
        </Col>
        <Col span={24} md={12}>
          <DescriptionItem title="Email" content={user?.email} />
        </Col>
        <Col span={24} md={12}>
          <DescriptionItem title="Celular" content={user?.phone?.number} />
        </Col>
      </Row>
    </Container>
  );
};

const Container = styled.div`
  .profile-photo-wrapper {
    width: 100%;
    display: grid;
    place-items: center;
    .avatar-item {
      width: 12em;
      height: 12em;
      margin: auto;
      border-radius: 50%;
      overflow: hidden;
      border: 5px solid #444;
      .profile-photo {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
`;

const DescriptionItem = ({ title, content }) => (
  <span
    style={{
      marginBottom: "7px",
      color: "rgba(0, 0, 0, 0.85)",
      fontSize: "14px",
      lineHeight: "1.5715",
      textTransform: "capitalize",
    }}
  >
    <p
      style={{
        display: "inline-block",
        marginRight: "8px",
        marginBottom: "0",
        color: "rgba(0, 0, 0, 0.65)",
        fontSize: "0.9em",
      }}
    >
      {title}:
    </p>
    {content}
  </span>
);
