import React from "react";
import dayjs from "dayjs";
import { Acl, IconAction, Card, Tag, Typography } from "../../components/ui";
import {
  faChartSimple,
  faEdit,
  faFlagCheckered,
  faPlayCircle,
  faTrash,
  faUserPlus,
  faVoteYea,
} from "@fortawesome/free-solid-svg-icons";
import { Col, Row } from "../../components";
import { updateElectionStatus } from "../../firebase/collections";
import { orderBy } from "lodash";
import { ElectionsStatus } from "../../data-list";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ElectionCard = ({
  election,
  onShowElectionStatistics,
  onClickAddElection,
  onClickDeleteElection,
  onClickEditElection,
  onClickSubmitVote,
}) => {
  const calculateStatus = (startDate, endDate) => {
    const now = dayjs();
    const start = dayjs(startDate, "DD-MM-YYYY");
    const end = dayjs(endDate, "DD-MM-YYYY");

    if (now.isBefore(start)) return "planned";
    if (now.isAfter(end)) return "closed";
    return "active";
  };

  const currentStatus = calculateStatus(election.startDate, election.endDate);
  const statusConfig = ElectionsStatus[currentStatus];

  if (election.status !== currentStatus) {
    updateElectionStatus(election.id, currentStatus);
  }

  const enabled = currentStatus === "active";

  return (
    <Container>
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
            <Typography.Title className="title" level={4}>
              {election.title}
            </Typography.Title>
            <Typography.Text type="secondary" style={{ fontSize: "0.85rem" }}>
              Creada:{" "}
              {election.createAt
                ? dayjs(election.createAt.toDate()).format("DD/MM/YYYY HH:mm")
                : "N/A"}
            </Typography.Text>
          </div>
        </div>
        <div className="dates-section">
          <div className="dates-wrapper">
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <FontAwesomeIcon icon={faPlayCircle} size="1x" />

              <Typography.Text strong style={{ fontSize: "0.9rem" }}>
                {election.startDate}
              </Typography.Text>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <FontAwesomeIcon icon={faFlagCheckered} size="1x" />

              <Typography.Text strong style={{ fontSize: "0.9rem" }}>
                {election.endDate}
              </Typography.Text>
            </div>
          </div>
        </div>
        <div className="icons-section">
          <div className="user-icons">
            <IconAction
              tooltipTitle={enabled ? "Votar" : "No disponible"}
              onClick={() => enabled && onClickSubmitVote(election.id)}
              disabled={!enabled}
              icon={faVoteYea}
              styled={{
                color: enabled
                  ? (theme) => theme.colors.success
                  : (theme) => theme.colors.gray,
              }}
            />
            <IconAction
              tooltipTitle="Ver estadísticas"
              icon={faChartSimple}
              onClick={() => onShowElectionStatistics(election)}
              styled={{
                color: (theme) => theme.colors.info,
              }}
            />
          </div>

          <div className="admin-icons">
            <Acl
              category="public"
              subCategory="elections"
              name="/elections/add-candidate/:electionId"
            >
              <IconAction
                tooltipTitle="Agregar Candidato"
                onClick={() => onClickAddElection(election.id)}
                icon={faUserPlus}
                styled={{
                  color: (theme) => theme.colors.secondary,
                }}
              />
            </Acl>
            <Acl
              category="public"
              subCategory="elections"
              name="/elections/:electionId"
            >
              <IconAction
                tooltipTitle="Editar"
                onClick={() => onClickEditElection(election.id)}
                icon={faEdit}
                styled={{
                  color: (theme) => theme.colors.tertiary,
                }}
              />
            </Acl>
            <Acl
              category="public"
              subCategory="elections"
              name="/elections#delete"
            >
              <IconAction
                tooltipTitle="Eliminar"
                onClick={() => onClickDeleteElection(election.id)}
                icon={faTrash}
                styled={{
                  color: (theme) => theme.colors.error,
                }}
              />
            </Acl>
          </div>
        </div>
      </Card>
    </Container>
  );
};

export const ElectionsCards = ({
  onShowElectionStatistics,
  onClickAddElection,
  onClickDeleteElection,
  onClickEditElection,
  onClickSubmitVote,
  elections,
}) => {
  return (
    <Row gutter={[16, 16]} wrap>
      {orderBy(elections, "createAt", "desc").map((election) => (
        <Col key={election.id} xs={24} lg={12} md={12}>
          <ElectionCard
            election={election}
            onShowElectionStatistics={onShowElectionStatistics}
            onClickAddElection={onClickAddElection}
            onClickDeleteElection={onClickDeleteElection}
            onClickEditElection={onClickEditElection}
            onClickSubmitVote={onClickSubmitVote}
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
