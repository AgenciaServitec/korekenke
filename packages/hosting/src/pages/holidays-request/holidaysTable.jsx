import React from "react";
import styled from "styled-components";
import { TableVirtualized } from "../../components";
import { capitalize } from "lodash";
import { HolidaysTemps } from "../../data-list";
import dayjs from "dayjs";

export const HolidaysTable = ({ loading }) => {
  const columns = [
    {
      title: "Fecha creación",
      align: "center",
      width: ["9rem", "100%"],
      render: (added) => added.createAt,
    },
    {
      title: "Apellidos y Nombres",
      align: "center",
      width: ["15rem", "100%"],
      render: (added) =>
        `${capitalize(added.user.paternalSurname)} ${capitalize(added.user.maternalSurname)} ${capitalize(added.user.firstName)}`,
    },
    {
      title: "Fecha de Inicio",
      align: "center",
      width: ["11rem", "100%"],
      render: (added) => added.startDate,
    },
    {
      title: "Fecha de Finalización",
      align: "center",
      width: ["15rem", "100%"],
      render: (added) => added.endDate,
    },
    {
      title: "Estado",
      align: "center",
      width: ["7rem", "100%"],
      render: (added) => added.status,
    },
    {
      title: "Respuesta",
      align: "center",
      width: ["8rem", "100%"],
      render: (added) => "Sin respuesta",
    },
    {
      title: "Opciones",
      align: "center",
      width: ["8rem", "100%"],
      render: (added) => "opciones aqui",
    },
  ];

  return (
    <Container>
      <TableVirtualized
        loading={loading}
        dataSource={HolidaysTemps}
        columns={columns}
        rowHeaderHeight={50}
        rowBodyHeight={90}
      />
    </Container>
  );
};

const Container = styled.div``;
