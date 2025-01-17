import React from "react";
import dayjs from "dayjs";
import styled from "styled-components";
import { TableVirtualized } from "../../components";
import { userFullName } from "../../utils";
import { Tag } from "antd";

export const AssistancesTable = ({ user, loading, assistances }) => {
  const columns = [
    {
      title: "Fecha",
      align: "center",
      width: ["7rem", "100%"],
      render: (assistance) =>
        dayjs(assistance.date, "DD/MM/YYYY").format("DD/MM/YYYY"),
    },
    {
      title: "Tipo",
      align: "center",
      width: ["5rem", "100%"],
      render: (assistance) =>
        assistance.type === "entry" ? (
          <Tag color="green">Entrada</Tag>
        ) : (
          <Tag color="red">Salida</Tag>
        ),
    },
    {
      title: "Cip",
      align: "center",
      width: ["7rem", "100%"],
      render: (assistance) => assistance.user.cip,
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
      width: ["8rem", "100%"],
      render: () => user.workPlace,
    },
    {
      title: "Hora entrada",
      align: "center",
      width: ["7rem", "100%"],
      render: (assistance) =>
        assistance.type === "entry"
          ? dayjs(assistance.createAt.toDate()).format("HH:mm:ss a")
          : "-",
    },
    {
      title: "Hora salida",
      align: "center",
      width: ["7rem", "100%"],
      render: (assistance) =>
        assistance.type === "outlet"
          ? dayjs(assistance.createAt.toDate()).format("HH:mm:ss a")
          : "-",
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
