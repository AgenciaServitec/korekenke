import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  Button,
  Card,
  Col,
  IconAction,
  modalConfirm,
  Row,
  Space,
  Tag,
  Title,
  Typography,
} from "../../components";
import { isEmpty, orderBy } from "lodash";
import styled from "styled-components";
import {
  faEdit,
  faFlagCheckered,
  faGift,
  faHand,
  faPeopleGroup,
  faPlay,
  faPlayCircle,
  faTrash,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router";
import { mediaQuery } from "../../styles";
import { useDefaultFirestoreProps } from "../../hooks";
import { userFullName } from "../../utils/users/userFullName2";
import {
  addRaffleParticipant,
  fetchRaffleParticipantByUserId,
  getRaffleParticipantId,
} from "../../firebase/collections/raffles";

const RaffleCard = ({ raffle, onEditRaffle, onConfirmDeleteRaffle, user }) => {
  const navigate = useNavigate();
  const { assignCreateProps } = useDefaultFirestoreProps();
  const [raffleParticipant, setRaffleParticipant] = useState(null);

  useEffect(() => {
    (async () => {
      const _raffleParticipant = await fetchRaffleParticipantByUserId(
        raffle.id,
        user.id,
      );

      if (!_raffleParticipant) return;

      setRaffleParticipant(_raffleParticipant);
    })();
  }, []);

  const isOrganizer = raffle.organizerId === user.id;

  const mapRaffleParticipant = {
    id: getRaffleParticipantId(),
    fullName: userFullName(user),
    dni: user.dni,
    phone: user.phone,
    userId: user.id,
    status: "pending",
  };

  const onSendParticipationRequest = async (raffle) => {
    await addRaffleParticipant(
      raffle.id,
      assignCreateProps(mapRaffleParticipant),
    );
  };

  const onConfirmSendParticipationRequest = (raffle) =>
    modalConfirm({
      title: "¿Está seguro que desea unirse al sorteo?",
      content: "Tu solicitud será revisada",
      onOk: async () => {
        await onSendParticipationRequest(raffle);
      },
    });

  return (
    <Container>
      <Card className="card-wrapper">
        <div className="card-bar" />
        <Tag className="status">Abierto</Tag>
        <Space direction="vertical" className="card-header">
          <div>
            <Title level={4}>{raffle.title}</Title>
            <Title level={5}>{raffle.group}</Title>
          </div>
          <div>
            <p>Participantes: {raffle?.quantityParticipants}</p>
            <p>
              Creada:{" "}
              {raffle.createAt
                ? dayjs(raffle.createAt.toDate()).format("DD/MM/YYYY HH:mm")
                : "N/A"}
            </p>
          </div>

          <div className="dates-section">
            {raffle.startDate && (
              <div className="dates-wrapper">
                <div
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <FontAwesomeIcon icon={faPlayCircle} size="1x" />

                  <Typography.Text strong style={{ fontSize: "0.9rem" }}>
                    {raffle.startDate}
                  </Typography.Text>
                </div>

                <div
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <FontAwesomeIcon icon={faFlagCheckered} size="1x" />

                  <Typography.Text strong style={{ fontSize: "0.9rem" }}>
                    {raffle.endDate}
                  </Typography.Text>
                </div>
              </div>
            )}
          </div>

          <div className="options">
            <Space>
              {isOrganizer ? (
                <Button onClick={() => navigate(`${raffle.id}/play`)}>
                  <FontAwesomeIcon icon={faPlay} />
                  <span>Comenzar</span>
                </Button>
              ) : isEmpty(raffleParticipant) ? (
                <Button
                  onClick={() => onConfirmSendParticipationRequest(raffle)}
                >
                  <FontAwesomeIcon icon={faHand} />
                  <span>Solicitar unirse</span>
                </Button>
              ) : raffleParticipant?.status === "approved" ? (
                <span>Ya forma parte del sorteo</span>
              ) : (
                <span>A la espera de la aprobación</span>
              )}
            </Space>
            <Space>
              <IconAction
                tooltipTitle="Premios"
                icon={faGift}
                size={33}
                onClick={() => ""}
                styled={{
                  color: (theme) => theme.colors.info,
                }}
              />
              <IconAction
                tooltipTitle="Ganadores"
                icon={faTrophy}
                size={33}
                onClick={() => ""}
                styled={{
                  color: (theme) => theme.colors.warning,
                }}
              />
              {isOrganizer && (
                <>
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
                    styled={{
                      color: (theme) => theme.colors.error,
                    }}
                  />
                </>
              )}
            </Space>
          </div>
        </Space>
      </Card>
    </Container>
  );
};

export const RafflesCards = ({
  raffles,
  onEditRaffle,
  onConfirmDeleteRaffle,
  user,
}) => {
  return (
    <Row gutter={[16, 16]} wrap>
      {orderBy(raffles, "createAt", "desc").map((raffle) => (
        <Col key={raffle.id} xs={24} lg={12} md={12}>
          <RaffleCard
            raffle={raffle}
            onEditRaffle={onEditRaffle}
            onConfirmDeleteRaffle={onConfirmDeleteRaffle}
            user={user}
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
      width: 100%;

      * {
        margin: 0;
      }

      & > div:nth-child(2) {
        margin-bottom: 1rem;

        p:last-child {
          color: #8c8c8c;
        }
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

      .options {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 1rem;

        button {
          width: 100%;

          ${mediaQuery.minDesktop} {
            max-width: 15rem;
          }
        }

        ${mediaQuery.minDesktop} {
          flex-direction: row;
          justify-content: space-between;
        }
      }
    }

    .status {
      border-radius: 20px;
      padding: 4px 12px;
      font-weight: 500;
      text-transform: uppercase;
      font-size: 0.75rem;
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
  }

  .icons-section {
    justify-content: space-between;
    align-items: center;
    display: flex;

    .user-icons {
      display: flex;
    }
  }
`;
