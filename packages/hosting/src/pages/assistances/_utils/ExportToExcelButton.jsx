import React from "react";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import { Button } from "../../../components";
import { userFullName } from "../../../utils/users/userFullName2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";

export const ExportToExcelButton = ({ data, user, loading }) => {
  const exportToExcel = () => {
    const dataForExport = data.map((assistance) => ({
      Fecha: dayjs(assistance.createAt.toDate()).format("DD/MM/YYYY"),
      CIP: assistance.user.cip,
      "Apellidos y Nombres": userFullName(assistance.user),
      "Lugar de trabajo": user.workPlace,
      "Hora entrada": assistance?.entry
        ? dayjs(assistance?.entry.date, "DD-MM-YYYY HH:mm").format(
            "DD/MM/YYYY HH:mm A",
          )
        : "-",
      "Hora salida": assistance?.outlet
        ? dayjs(assistance?.outlet.date, "DD-MM-YYYY HH:mm").format(
            "DD/MM/YYYY HH:mm A",
          )
        : "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataForExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Asistencias");
    XLSX.writeFile(
      workbook,
      `Asistencias_${dayjs().format("YYYYMMDD_HHmmss")}.xlsx`,
    );
  };

  return (
    <Button
      type="primary"
      onClick={exportToExcel}
      disabled={loading || !data?.length}
    >
      <FontAwesomeIcon icon={faFileExcel} size="1x" />
      Exportar a Excel
    </Button>
  );
};
