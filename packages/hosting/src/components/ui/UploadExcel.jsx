import React from "react";
import { notification } from "./notification";
import { Upload } from "antd";
import { Button } from "../ui";

export const UploadExcel = () => {
  const handleUpload = async (file) => {
    console.log(file); // Verifica que el archivo esté disponible

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("https://api-korekenke-dev.web.app/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Error en el servidor");
      const result = await response.json();

      console.log("Datos procesados:", result.data);
      notification({
        type: "success",
        description: "Archivo procesado correctamente",
      });
    } catch (error) {
      console.error(error);
      notification({
        type: "error",
        description: "Error al subir el archivo",
      });
    }

    return false; // Evita que Ant Design maneje la carga automáticamente
  };

  return (
    <Upload
      beforeUpload={handleUpload}
      accept=".xlsx,.xls"
      showUploadList={false}
      maxCount={1}
    >
      <Button>Subir Excel</Button>
    </Upload>
  );
};
