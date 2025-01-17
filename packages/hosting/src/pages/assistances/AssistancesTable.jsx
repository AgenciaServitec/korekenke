import React from "react";
import dayjs from "dayjs";
import styled from "styled-components";
import { TableVirtualized } from "../../components";
import { userFullName } from "../../utils";

export const AssistancesTable = ({ user, loading, assistances }) => {
  const columns = [
    {
      title: "Fecha",
      align: "center",
      width: ["9rem", "100%"],
      render: (assistance) =>
        dayjs(assistance.date, "DD/MM/YYYY").format("DD/MM/YYYY"),
    },
    {
      title: "Apellidos y Nombres",
      align: "center",
      width: ["15rem", "100%"],
      render: (assistance) => userFullName(assistance.user),
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
        dayjs(assistance.createAt.toDate()).format("HH:mm:ss a"),
    },
    {
      title: "Hora de salida",
      align: "center",
      width: ["9rem", "100%"],
      render: (assistance) =>
        dayjs(assistance.createAt.toDate()).format("HH:mm:ss a"),
    },
  ];

  return (
    <Container>
      <TableVirtualized
        loading={loading}
        dataSource={assistances}
        columns={columns}
        rowHeaderHeight={50}
        rowBodyHeight={50}
      />
    </Container>
  );
};

const Container = styled.div`
  .date-filter {
    display: flex;
    align-items: center;
    margin-bottom: 1em;

    label {
      font-weight: bold;
      margin-right: 0.5em;
    }

    .ant-picker {
      width: 200px;
    }
  }
`;
