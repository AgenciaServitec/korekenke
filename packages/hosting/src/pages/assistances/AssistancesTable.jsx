import React, { useState } from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import styled from "styled-components";
import { TableVirtualized } from "../../components";
import { orderBy } from "lodash";
import { userFullName } from "../../utils";

export const AssistancesTable = ({ user, loading, assistances }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [filterDate, setFilterDate] = useState(null);

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

  const filteredAssistancesByDate = filteredAssistances.filter((assistance) => {
    if (filterDate) {
      const assistanceDate = dayjs(assistance.entry.date, "DD/MM/YYYY").format(
        "YYYY-MM-DD",
      );
      return assistanceDate === filterDate;
    }
    return true;
  });

  const paginatedData = orderBy(
    filteredAssistancesByDate,
    "entry.date",
    "desc",
  ).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalPages = Math.ceil(filteredAssistancesByDate.length / itemsPerPage);

  const handleDateChange = (date, dateString) => {
    setFilterDate(dateString); // Establecer la fecha en formato "YYYY-MM-DD"
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

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
          ? dayjs(assistance.entry.createAt.toDate()).format("HH:mm:ss a")
          : "-",
    },
    {
      title: "Hora de salida",
      align: "center",
      width: ["9rem", "100%"],
      render: (assistance) =>
        assistance.outlet
          ? dayjs(assistance.outlet.createAt.toDate()).format("HH:mm:ss a")
          : "-",
    },
  ];

  return (
    <Container>
      <div className="date-filter">
        <label htmlFor="date-filter">Filtrar por Fecha:</label>
        <DatePicker
          id="date-filter"
          onChange={handleDateChange}
          value={filterDate ? dayjs(filterDate, "YYYY-MM-DD") : null}
          format="YYYY-MM-DD"
          placeholder="Selecciona una fecha"
        />
      </div>
      <TableVirtualized
        loading={loading}
        dataSource={paginatedData}
        columns={columns}
        rowHeaderHeight={50}
        rowBodyHeight={50}
      />
      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Anterior
        </button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage >= totalPages}>
          Siguiente
        </button>
      </div>
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

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 1em;

    button {
      margin: 0 1em;
      padding: 0.5em 1em;
      background-color: #17b21e;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
      }

      &:hover:not(:disabled) {
        background-color: #0a9a10;
      }
    }

    span {
      font-size: 1rem;
      font-weight: bold;
    }
  }
`;
