import React from "react";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import { Button } from "../../../components";
import { userFullName } from "../../../utils/users/userFullName2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";

const statusInSpanish = {
  pending: "Pendiente",
  approved: "Aprobado",
  disapproved: "Completado",
  waiting: "En espera",
};

export const ExportVisitToExcel = ({ data, loading }) => {
  const exportToExcel = () => {
    const dataForExport = data.map((visit) => ({
      "Fecha de Creación": dayjs(visit.createAt.toDate()).format(
        "DD/MM/YYYY HH:mm",
      ),
      "Apellidos y Nombres": userFullName(visit),
      DNI: visit.dni,
      Teléfono: `${visit.phone.prefix} ${visit.phone.number}`,
      Dependencia: visit.dependency,
      "Persona Visitada": userFullName(visit.personVisited),
      "Teléfono del Visitado": `${visit.personVisited.phone.prefix} ${visit.personVisited.phone.number}`,
      Estado: statusInSpanish[visit?.status] || visit?.status,
      "Fecha/Hora Ingreso": visit.entryDateTime || "-",
      "Fecha/Hora Salida": visit.exitDateTime || "-",
      Observación: visit.visitedObservation || "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataForExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Visitas");
    XLSX.writeFile(
      workbook,
      `Visitas_${dayjs().format("YYYYMMDD_HHmmss")}.xlsx`,
    );
  };

  return (
    <Button
      type="primary"
      onClick={exportToExcel}
      disabled={loading || !data?.length}
    >
      <FontAwesomeIcon
        icon={faFileExcel}
        size="1x"
        style={{ marginRight: 8 }}
      />
      Exportar a Excel
    </Button>
  );
};
