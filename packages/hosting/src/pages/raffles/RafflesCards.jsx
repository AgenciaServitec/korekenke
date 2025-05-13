import React from "react";
import dayjs from "dayjs";
import { Card, IconAction, Typography } from "../../components/ui";
import { Col, Row } from "../../components";
import { orderBy } from "lodash";
import styled from "styled-components";
import {
  faEdit,
  faGift,
  faPeopleGroup,
  faPlay,
  faTrash,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Space } from "antd";
import { useNavigate } from "react-router";

const RaffleCard = ({ raffle, onEditRaffle, onConfirmDeleteRaffle }) => {
  const navigate = useNavigate();

  return (
    <Container>
      <Card className="card-wrapper">
        <div className="card-bar" />
        <div className="card-header">
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Typography.Title className="title" level={4}>
              {raffle.title}
            </Typography.Title>
            <Typography.Title className="title" level={4}>
              {raffle.group}
            </Typography.Title>
            <Typography.Text style={{ fontSize: "0.85rem" }}>
              Participantes: {raffle?.participants}
            </Typography.Text>
            <Typography.Text type="secondary" style={{ fontSize: "0.85rem" }}>
              Creada:
              {raffle.createAt
                ? dayjs(raffle.createAt.toDate()).format("DD/MM/YYYY HH:mm")
                : "N/A"}
            </Typography.Text>
            <Space>
              <Button onClick={() => navigate(`${raffle.id}/play`)}>
                <FontAwesomeIcon icon={faPlay} />
                <span>Comenzar</span>
              </Button>
              <IconAction
                tooltipTitle="Premios"
                icon={faGift}
                size={33}
                onClick={() => ""}
              />
              <IconAction
                tooltipTitle="Ganadores"
                icon={faTrophy}
                size={33}
                onClick={() => ""}
              />
              <IconAction
                tooltipTitle="Participantes"
                icon={faPeopleGroup}
                size={33}
                onClick={() => navigate(`${raffle.id}/participants`)}
              />
              <IconAction
                tooltipTitle="Editar"
                icon={faEdit}
                size={33}
                onClick={() => onEditRaffle(raffle.id)}
              />
              <IconAction
                tooltipTitle="Eliminar"
                icon={faTrash}
                size={33}
                onClick={() => onConfirmDeleteRaffle(raffle.id)}
              />
            </Space>
          </div>
        </div>
      </Card>
    </Container>
  );
};

export const RafflesCards = ({
  raffles,
  onEditRaffle,
  onConfirmDeleteRaffle,
}) => {
  return (
    <Row gutter={[16, 16]} wrap>
      {orderBy(raffles, "createAt", "desc").map((raffle) => (
        <Col key={raffle.id} xs={24} lg={12} md={12}>
          <RaffleCard
            raffle={raffle}
            onEditRaffle={onEditRaffle}
            onConfirmDeleteRaffle={onConfirmDeleteRaffle}
          />
        </Col>
      ))}
    </Row>
  );
};

const Container = styled.div`
  .card-wrapper {
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition:
      transform 0.2s,
      box-shadow 0.2s;
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }
    .card-header {
      flex-shrink: 0;
      align-items: flex-start;
      gap: 1em;
      .title {
        padding-top: 0.3em;
        margin: 0;
        font-size: 1.1rem;
        font-weight: 600;
      }
    }
    .status {
      border-radius: 20px;
      padding: 4px 12px;
      font-weight: 500;
      text-transform: uppercase;
      font-size: 0.75rem;
    }
  }

  .card-bar {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 0.25em;
    border-top-left-radius: 12px;
    border-bottom-left-radius: 12px;
  }

  .dates-section {
    border-radius: 0.5em;
    padding: 0.8em;
    .dates-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }
  }

  .icons-section {
    justify-content: space-between;
    align-items: center;
    display: flex;

    .user-icons,
    .admin-icons {
      display: flex;
    }
  }
`;
