import React from "react";
import dayjs from "dayjs";
import styled from "styled-components";
import { TableVirtualized } from "../../components";
import { orderBy } from "lodash";
import { userFullName } from "../../utils";

export const AssistancesTable = ({ user, loading, assistances }) => {
  const assistancesViewBy = assistances.filter((assistance) => {
    if (["super_admin"].includes(user.roleCode)) return assistance;

    if (assistance.user.id === user.id) return assistance;

    if (["manager"].includes(user.roleCode))
      return assistance.user.department === user.department;

    return false;
  });

  const groupAssistancesByDate = () => {
    const grouped = {};

    assistancesViewBy.forEach((assistance) => {
      const date = assistance.date.split(" ")[0];

      if (!grouped[date]) {
        grouped[date] = {};
      }

      const userId = assistance.user.id;

      if (!grouped[date][userId]) {
        grouped[date][userId] = { entry: null, outlet: null };
      }

      if (assistance.type === "entry" && !grouped[date][userId].entry) {
        grouped[date][userId].entry = assistance;
      } else if (
        assistance.type === "outlet" &&
        !grouped[date][userId].outlet
      ) {
        grouped[date][userId].outlet = assistance;
      }
    });

    return grouped;
  };

  const filteredAssistances = Object.values(groupAssistancesByDate()).flatMap(
    (group) =>
      Object.values(group).map((userGroup) => ({
        entry: userGroup.entry,
        outlet: userGroup.outlet,
      })),
  );

  const columns = [
    {
      title: "Fecha",
      align: "center",
      width: ["9rem", "100%"],
      render: (assistance) =>
        assistance.entry
          ? dayjs(assistance.entry.date, "DD/MM/YYYY").format("DD/MM/YYYY")
          : "-",
    },
    {
      title: "Apellidos y Nombres",
      align: "center",
      width: ["15rem", "100%"],
      render: (assistance) => userFullName(assistance.entry?.user),
    },
    {
      title: "Lugar de trabajo",
      align: "center",
      width: ["10rem", "100%"],
      render: () => user.workPlace,
    },
    {
      title: "Hora de entrada",
      align: "center",
      width: ["9rem", "100%"],
      render: (assistance) =>
        assistance.entry
          ? dayjs(assistance.entry.createAt.toDate()).format("HH:mm:ss")
          : "-",
    },
    {
      title: "Hora de salida",
      align: "center",
      width: ["9rem", "100%"],
      render: (assistance) =>
        assistance.outlet
          ? dayjs(assistance.outlet.createAt.toDate()).format("HH:mm:ss")
          : "-",
    },
  ];
  return (
    <Container>
      <TableVirtualized
        loading={loading}
        dataSource={orderBy(filteredAssistances, "entry.date", "desc")}
        columns={columns}
        rowHeaderHeight={50}
        rowBodyHeight={50}
      />
    </Container>
  );
};

const Container = styled.div``;
