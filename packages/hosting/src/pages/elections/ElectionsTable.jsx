import React from "react";
import dayjs from "dayjs";
import {
  Acl,
  IconAction,
  Space,
  TableVirtualized,
  Tag,
} from "../../components/ui";
import {
  faChartSimple,
  faEdit,
  faTrash,
  faUserPlus,
  faVoteYea,
} from "@fortawesome/free-solid-svg-icons";
import { Col, Row } from "../../components";
import { updateElectionStatus } from "../../firebase/collections";
import { orderBy } from "lodash";
import { ElectionsStatus } from "../../data-list";

export const ElectionsTable = ({
  onShowElectionStatistics,
  onClickAddElection,
  onClickDeleteElection,
  onClickEditElection,
  onClickSubmitVote,
  elections,
}) => {
  const calculateStatus = (startDate, endDate) => {
    const now = dayjs();
    const start = dayjs(startDate, "DD-MM-YYYY");
    const end = dayjs(endDate, "DD-MM-YYYY");

    if (now.isBefore(start)) return "planned";
    if (now.isAfter(end)) return "closed";
    return "active";
  };

  const columns = [
    {
      title: "Fecha de Creación",
      align: "center",
      width: ["10rem", "100%"],
      render: (election) =>
        election.createAt
          ? dayjs(election.createAt.toDate()).format("DD/MM/YYYY HH:mm")
          : "N/A",
    },
    {
      title: "Título",
      align: "center",
      width: ["10rem", "100%"],
      render: (election) => election?.title,
    },
    {
      title: "Estado",
      align: "center",
      width: ["6rem", "100%"],
      render: (election) => {
        const currentStatus = calculateStatus(
          election.startDate,
          election.endDate,
        );
        const statusConfig = ElectionsStatus[currentStatus];

        if (election.status !== currentStatus) {
          updateElectionStatus(election.id, currentStatus);
        }

        return <Tag color={statusConfig.color}>{statusConfig.name}</Tag>;
      },
    },
    {
      title: "Fecha de Inicio",
      align: "center",
      width: ["11rem", "100%"],
      render: (election) => election.startDate || "",
    },
    {
      title: "Fecha de Finalización",
      align: "center",
      width: ["15rem", "100%"],
      render: (election) => election.endDate || "",
    },
    {
      title: "Opciones",
      align: "center",
      width: ["12rem", "100%"],
      render: (election) => {
        const currentStatus = calculateStatus(
          election.startDate,
          election.endDate,
        );

        return (
          <Space>
            <Acl
              category="public"
              subCategory="elections"
              name="/elections/submit-vote/:electionId"
            >
              <IconAction
                tooltipTitle="Votar"
                onClick={() => {
                  if (currentStatus === "active") {
                    onClickSubmitVote(election.id);
                  }
                }}
                disabled={currentStatus !== "active"}
                styled={{ color: (theme) => theme.colors.success }}
                icon={faVoteYea}
              />
            </Acl>
            <Acl
              category="public"
              subCategory="elections"
              name="/elections/:electionId#electionStatistics"
            >
              <IconAction
                tooltipTitle="Ver estadísticas"
                icon={faChartSimple}
                styled={{ color: (theme) => theme.colors.info }}
                onClick={() => onShowElectionStatistics(election)}
              />
            </Acl>
          </Space>
        );
      },
    },
    {
      title: "Opciones de Administrador",
      align: "center",
      width: ["14rem", "100%"],
      render: (election) => (
        <Space>
          <Acl
            category="public"
            subCategory="elections"
            name="/elections/add-candidate/:electionId"
          >
            <IconAction
              tooltipTitle="Agregar Candidato"
              onClick={() => onClickAddElection(election.id)}
              styled={{ color: (theme) => theme.colors.secondary }}
              icon={faUserPlus}
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
              styled={{ color: (theme) => theme.colors.tertiary }}
              icon={faEdit}
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
              styled={{ color: (theme) => theme.colors.error }}
              icon={faTrash}
            />
          </Acl>
        </Space>
      ),
    },
  ];
  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <TableVirtualized
          dataSource={orderBy(elections, "createAt", "desc")}
          columns={columns}
          rowHeaderHeight={50}
          rowBodyHeight={150}
        />
      </Col>
    </Row>
  );
};
