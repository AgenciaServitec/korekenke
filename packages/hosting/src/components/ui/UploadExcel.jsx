import React from "react";

export const UploadExcel = () => {
  const handleUpload = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    const fileInput = form.elements.namedItem("file");

    if (!fileInput?.files?.length) {
      alert("Por favor, selecciona un archivo.");
      return;
    }

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    try {
      const response = await fetch("https://api-korekenke-dev.web.app/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Error en el servidor");

      const result = await response.json();
      console.log("Datos procesados:", result.data);

      alert("Archivo procesado correctamente");
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      alert("Error al subir el archivo");
    }

    return false;
  };

  return (
    <form onSubmit={handleUpload} encType="multipart/form-data">
      <input type="file" name="file" accept=".xlsx,.xls" required />
      <button type="submit">Subir Excel</button>
    </form>
  );
};
