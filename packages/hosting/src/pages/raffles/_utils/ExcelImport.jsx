import React, { useState } from "react";
import { Button, Space, notification } from "../../../components";
import { faFileImport } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as XLSX from "xlsx";
import { Upload } from "antd";

export const ExcelImport = ({
  setParticipantsImport,
  setQuantityParticipants,
}) => {
  const [fileExcel, setFileExcel] = useState(null);
  const [uploading, setUploading] = useState(false);

  const onImportParticipants = () => {
    const file = fileExcel;

    if (!file) return;

    setUploading(true);

    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheet];
      const json = XLSX.utils.sheet_to_json(worksheet);

      const lineas = json.map((row) => {
        const nombre = row.nombres || row.Nombre || "";
        const dni = row.dni || row.DNI || "";
        const celular = row.celular || row.Celular || "";
        return `${nombre}:${dni}:${celular}`;
      });

      setParticipantsImport(lineas.join("\n"));
      setQuantityParticipants(json.length);

      setUploading(false);
    };

    reader.onerror = () => {
      notification({ type: "error", message: "Error al leer el archivo" });
      setUploading(false);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <Space align="start">
      <Upload
        name="file"
        onRemove={() => setFileExcel(null)}
        beforeUpload={(file) => {
          setFileExcel(file);
          return false;
        }}
      >
        <Button icon={<FontAwesomeIcon icon={faFileImport} />}>
          Importar desde archivo
        </Button>
      </Upload>
      {fileExcel && <Button onClick={onImportParticipants}>Importar</Button>}
    </Space>
  );
};
