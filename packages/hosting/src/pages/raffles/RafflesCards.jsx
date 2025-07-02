import React from "react";
import dayjs from "dayjs";
import {
  Button,
  Card,
  Col,
  IconAction,
  modalConfirm,
  Row,
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
  getRaffleParticipantId,
  raffleParticipantsRef,
} from "../../firebase/collections/raffles";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { darken, lighten, readableColor } from "polished";
import { RafflesStatus } from "../../data-list";

const RaffleCard = ({ raffle, onEditRaffle, onConfirmDeleteRaffle, user }) => {
  const navigate = useNavigate();
  const { assignCreateProps } = useDefaultFirestoreProps();
  const [
    raffleParticipant = [],
    raffleParticipantLoading,
    raffleParticipantError,
  ] = useCollectionData(
    raffleParticipantsRef(raffle.id)
      .where("isDeleted", "==", false)
      .where("userId", "==", user.id)
      .limit(1),
  );

  const calculateStatus = (startDate, endDate) => {
    const now = dayjs();
    const start = dayjs(startDate, "DD-MM-YYYY");
    const end = dayjs(endDate, "DD-MM-YYYY");

    if (now.isBefore(start)) return "planned";
    if (now.isAfter(end)) return "closed";
    return "active";
  };

  const currentStatus = calculateStatus(raffle.startDate, raffle.endDate);
  const statusConfig = RafflesStatus[currentStatus];

  const participant = raffleParticipant[0];

  const isOrganizer = raffle.organizerId === user.id;

  const mapRaffleParticipant = {
    id: getRaffleParticipantId(),
    fullName: userFullName(user),
    dni: user.dni,
    phone: user.phone,
    userId: user.id,
    status: "pending",
  };

  const onSendParticipationRequest = async (raffle) =>
    await addRaffleParticipant(
      raffle.id,
      assignCreateProps(mapRaffleParticipant),
    );

  const onConfirmSendParticipationRequest = (raffle) =>
    modalConfirm({
      title: "¿Está seguro que desea unirse al sorteo?",
      content: "Tu solicitud será revisada",
      onOk: async () => {
        await onSendParticipationRequest(raffle);
      },
    });

  return (
    <Container mainColor={raffle?.mainColor || "#f44336"}>
      <Card className="card-wrapper">
        <div
          className="card-bar"
          style={{ backgroundColor: statusConfig.color }}
        />
        <Tag className="status" color={statusConfig.color}>
          {statusConfig.name}
        </Tag>
        <div className="card-header">
          <div>
            <Title level={4}>{raffle.title}</Title>
            <Title level={5}>{raffle.group}</Title>
          </div>
        </div>
        <div className="card-body">
          <div className="card-info">
            <p>Participantes: {raffle?.quantityParticipants}</p>
            <p>
              Creada:{" "}
              {raffle.createAt
                ? dayjs(raffle.createAt.toDate()).format("DD/MM/YYYY HH:mm")
                : "N/A"}
            </p>
          </div>

          {raffle.startDate && (
            <div className="dates-section">
              <div className="dates-wrapper">
                <div className="date-item">
                  <FontAwesomeIcon icon={faPlayCircle} />
                  <Typography.Text strong>{raffle.startDate}</Typography.Text>
                </div>
                <div className="date-item">
                  <FontAwesomeIcon icon={faFlagCheckered} />
                  <Typography.Text strong>{raffle.endDate}</Typography.Text>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="card-footer">
          <div className="footer-actions">
            {isOrganizer ? (
              <Button block onClick={() => navigate(`${raffle.id}/play`)}>
                <FontAwesomeIcon icon={faPlay} />
                <span>Comenzar</span>
              </Button>
            ) : isEmpty(participant) ? (
              <Button
                block
                onClick={() => onConfirmSendParticipationRequest(raffle)}
              >
                <FontAwesomeIcon icon={faHand} />
                <span>Solicitar unirse</span>
              </Button>
            ) : participant?.status === "pending" ? (
              <span>A la espera de la aprobación</span>
            ) : (
              <span>Ya forma parte del sorteo</span>
            )}
          </div>

          <div className="footer-icons">
            <IconAction
              className="icon-action"
              tooltipTitle="Premios"
              icon={faGift}
              size={33}
              onClick={() => {}}
            />
            <IconAction
              className="icon-action"
              tooltipTitle="Ganadores"
              icon={faTrophy}
              size={33}
              onClick={() => {}}
            />
            {isOrganizer && (
              <>
                <IconAction
                  className="icon-action"
                  tooltipTitle="Participantes"
                  icon={faPeopleGroup}
                  size={33}
                  onClick={() => navigate(`${raffle.id}/participants`)}
                />
                <IconAction
                  className="icon-action"
                  tooltipTitle="Editar"
                  icon={faEdit}
                  size={33}
                  onClick={() => onEditRaffle(raffle.id)}
                />
                <IconAction
                  className="icon-action"
                  tooltipTitle="Eliminar"
                  icon={faTrash}
                  size={33}
                  onClick={() => onConfirmDeleteRaffle(raffle.id)}
                />
              </>
            )}
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
    border-radius: 20px;
    background: ${({ mainColor }) =>
      `linear-gradient(135deg, ${lighten(0.1, mainColor)} 0%, ${darken(0.1, mainColor)} 100%)`};
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
    padding: 1.5rem;
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
    position: relative;
    color: white;
    overflow: hidden;

    &:hover {
      transform: scale(1.02);
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.35);
    }

    .status {
      background-color: ${({ color }) => `${color}`};
      color: black;
      font-weight: bold;
      border-radius: 20px;
      padding: 4px 12px;
      font-size: 0.75rem;
      display: inline-block;
      margin-bottom: 0.5rem;
    }

    .card-header {
      h4,
      h5 {
        color: ${({ mainColor }) => `${readableColor(mainColor)}`};
        margin: 0.4em 0;
      }
    }

    .card-body {
      .card-info p {
        font-size: 0.95rem;
        margin: 0.4em 0;
        color: ${({ mainColor }) => `${readableColor(mainColor)}`};
      }

      .dates-section {
        .dates-wrapper {
          display: flex;
          justify-content: space-between;
          gap: 1rem;

          .date-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.9rem;
            svg {
              color: ${({ mainColor }) => `${readableColor(mainColor)}`};
              transition: transform 0.2s;
            }
            strong {
              color: ${({ mainColor }) => `${readableColor(mainColor)}`};
            }

            &:hover svg {
              transform: scale(1.1);
              color: lightblue;
            }
          }
        }

        ${mediaQuery.maxTablet} {
          .dates-wrapper {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      }
    }

    .card-footer {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      ${mediaQuery.minDesktop} {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
      }

      .footer-actions {
        button {
          background: rgba(255, 255, 255, 0.1);
          color: ${({ mainColor }) => `${readableColor(mainColor)}`};
          border: 1px solid black;
          font-weight: bold;
          &:hover {
            background: white;
            color: black;
          }
        }
      }

      .footer-icons {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        justify-content: flex-start;

        ${mediaQuery.minDesktop} {
          justify-content: flex-end;
        }

        .icon-action {
          transition: transform 0.2s ease;
          color: ${({ mainColor }) => `${readableColor(mainColor)}`};
          &:hover {
            transform: scale(1.2);
            color: black;
          }
        }
      }
    }
  }
`;
