import React from "react";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import { Button } from "../../../../../components";
import { userFullName } from "../../../../../utils/users/userFullName2";
import { findDasRequest } from "../../../../../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { DasRequestStatus } from "../../../../../data-list";

export const ExportDasRequestsToExcel = ({ data, loading }) => {
  const exportToExcel = () => {
    const dataForExport = data.map((request) => {
      const isPositive = request?.response?.type === "positive";
      const statusLabel =
        DasRequestStatus[request?.status]?.name || request?.status;

      return {
        "Fecha de Creación": dayjs(request.createAt.toDate()).format(
          "DD/MM/YYYY HH:mm",
        ),
        Titular: userFullName(request.headline),
        CIP: request.headline?.cip,
        Correo: request.headline?.email,
        Teléfono: `${request.headline?.phone?.prefix || ""} ${request.headline?.phone?.number || ""}`,
        Solicitud: findDasRequest(request?.requestType)?.name || "-",
        Institución: request?.institution?.id || "-",
        Para: request?.isHeadline ? "Titular" : "Familiar",
        Estado: statusLabel,
        Respuesta: request?.response
          ? isPositive
            ? "Positiva"
            : "Negativa"
          : "-",
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(dataForExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Solicitudes DAS");

    XLSX.writeFile(
      workbook,
      `Solicitudes_DAS_${dayjs().format("YYYYMMDD_HHmmss")}.xlsx`,
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
