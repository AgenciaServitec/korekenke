import React from "react";
import styled from "styled-components";

export const DomiciliarySketchOwnerSheet = () => {
  return (
    <Container>
      <div className="sheet">
        <h2 className="title">CROQUIS DOMICILIARIO DEL PROPIETARIO</h2>
        <section className="section">
          <p style={{ display: "flex" }}>
            <strong>Grado</strong>
            ...................................................................
            <strong>Especialidad:</strong>
            .................................................
          </p>
          <p>
            <strong>Apellidos</strong>
            ...................................................................
          </p>
          <p>
            <strong>Nombres</strong>
            ...................................................................
          </p>
          <p style={{ display: "flex" }}>
            <strong>CIP</strong>
            ...................................................................
            <strong>DNI:</strong>
            ...................................................................
          </p>
          <p>
            <strong>Dirección Actual:</strong>
            ..................................................................................................................
          </p>
          <p style={{ display: "flex" }}>
            <strong>Distrito</strong>
            ...................................................................
            <strong>Provincia:</strong>
            ...................................................................
          </p>
          <p>
            <strong>Departamento:</strong>{" "}
            ....................................................
          </p>
          <p>
            <strong>Referencia:</strong>{" "}
            ....................................................
          </p>
        </section>
        <div className="sketch-box"></div>
        <section className="footer">
          <p>
            <strong>Lugar y Fecha:</strong>{" "}
            ..........................................................
          </p>
          <p className="firma">
            <strong>FIRMA:</strong>{" "}
            ....................................................................................
          </p>
          <p>
            POST FIRMA:
            ..........................................................
          </p>
        </section>
      </div>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  font-family: Arial, sans-serif;

  .sheet {
    background-color: white;
    padding: 3rem;
    max-width: 800px;
    width: 100%;
    font-family: sans-serif;
    font-size: 15px;
  }
  .title {
    text-align: center;
    font-weight: bold;
    text-transform: uppercase;
    margin-bottom: 20px;
  }

  .section p {
    margin: 8px 0;
  }

  .sketch-box {
    margin: 30px 0;
    border: 1px solid #000;
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-style: italic;
    color: #555;
  }

  .footer {
    margin-top: 20px;

    .firma {
      margin-top: 20px;
    }
  }
`;
