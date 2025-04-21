import React from "react";
import styled from "styled-components";

export const IndividualFingerprintRecordSheet = () => {
  return (
    <Container>
      <div className="sheet">
        <h2 className="title">FICHA INDIVIDUAL DACTILOSCÓPICA</h2>

        <div className="section">
          <p className="field">
            <strong>GRADO:</strong> ______________________________________
          </p>
          <p className="field">
            <strong>ESPECIALIDAD:</strong> ________________________________
          </p>
          <p className="field">
            <strong>APELLIDOS:</strong> ___________________________________
          </p>
          <p className="field">
            <strong>NOMBRES:</strong> ____________________________________
          </p>
          <p className="field">
            <strong>EDAD:</strong> ______ AÑOS &nbsp;&nbsp;
            <strong>CIP:</strong> _____________________ &nbsp;&nbsp;
            <strong>DNI:</strong> _____________________
          </p>
          <p className="field">
            <strong>DIRECCIÓN DOMICILIARIA:</strong>{" "}
            ____________________________________________
          </p>
          <p className="field">
            <strong>DISTRITO:</strong> _____________________ &nbsp;&nbsp;
            <strong>PROVINCIA:</strong> _____________________
          </p>
          <p className="field">
            <strong>DEPARTAMENTO:</strong> _____________________
          </p>
        </div>

        <p className="date">
          <strong>LUGAR Y FECHA:</strong> ______________________________________
        </p>

        <div className="section-signature">
          <p className="field">
            <strong>FIRMA:</strong> ___________________________
          </p>
          <p className="field">
            <strong>POST FIRMA:</strong> ___________________________
          </p>
          <p className="field">
            <strong>CIP N°:</strong> ___________________________
          </p>
        </div>

        <div>
          <div className="fingerprint-row">
            {["MEÑIQUE", "ANULAR", "MEDIO", "INDICE", "PULGAR"].map(
              (finger) => (
                <div className="fingerprint" key={finger}>
                  <div className="box" />
                  <span>{finger}</span>
                </div>
              ),
            )}
          </div>
          <h4 className="subtitle">INDICE MANO IZQUIERDA</h4>

          <div className="fingerprint-row">
            {["PULGAR", "INDICE", "MEDIO", "ANULAR", "MEÑIQUE"].map(
              (finger) => (
                <div className="fingerprint" key={finger}>
                  <div className="box" />
                  <span>{finger}</span>
                </div>
              ),
            )}
          </div>
          <h4 className="subtitle">INDICE MANO DERECHA</h4>
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f6f6f6;

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
    text-decoration: underline;
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  .section,
  .section-signature {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .section-signature {
    text-align: right;
  }

  .date {
    text-align: right;
    margin-bottom: 2.5rem;
  }

  .subtitle {
    text-align: center;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  .fingerprint-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 2rem;
  }

  .fingerprint {
    text-align: center;
  }

  .box {
    width: 100px;
    height: 120px;
    background-color: #f0f0f0;
    border: 1px solid #aaa;
    margin-bottom: 0.5rem;
  }
`;
