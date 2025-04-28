import React from "react";
import styled from "styled-components";

export const PersonalDataSheet = () => {
  return (
    <Container>
      <div className="sheet">
        <h2 className="title">HOJA DE DATOS PERSONALES</h2>

        <section className="section">
          <h3 className="subtitle">1. DATOS PERSONALES</h3>
          <p className="field">
            GRADO: .............................................. ESPECIALIDAD:
            ..............................................
          </p>
          <p className="field">
            APELLIDOS PATERNO:
            ..................................................
          </p>
          <p className="field">
            APELLIDOS MATERNO:
            ..................................................
          </p>
          <p className="field">
            NOMBRES: ..................................................
          </p>
          <p className="field">
            ESTADO CIVIL: ..................................................
          </p>
          <p className="field">
            FECHA DE NACIMIENTO:
            ..................................................
          </p>
          <p className="field">
            GRUPO SANGUÍNEO: ..................................................
          </p>
          <p className="field">
            SEÑALES PARTICULARES:
            ..................................................
          </p>
          <p className="field">
            CIP: .............................. DNI:
            .............................. SERIE: ..............................
          </p>
          <p className="field">
            TELÉFONO FIJO: ................................ CELULAR:
            ................................
          </p>
          <p className="field">
            CORREO ELECTRÓNICO:
            ..................................................
          </p>
        </section>

        <section className="section">
          <h3 className="subtitle">2. DATOS FAMILIARES</h3>
          <p className="field">
            <strong>a. ESPOSA (O)</strong>
          </p>
          <p className="field">
            APELLIDOS PATERNO:
            ..................................................
          </p>
          <p className="field">
            APELLIDOS MATERNO:
            ..................................................
          </p>
          <p className="field">
            NOMBRES: ..................................................
          </p>
          <p className="field">
            <strong>b. HIJOS (AS)</strong>
          </p>
          <p className="field">
            APELLIDOS Y NOMBRES &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            OCUPACIÓN
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            FECHA NACIMIENTO
          </p>
          <p className="field">
            ................................................
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            ................................................
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            ................................................
          </p>
          <p className="field">
            ................................................
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            ................................................
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            ................................................
          </p>
        </section>

        <section className="section">
          <h3 className="subtitle">3. DIRECCIÓN DOMICILIARIA</h3>
          <p className="field">
            JR./AV.: ..................................................
          </p>
          <p className="field">
            URBANIZACIÓN: ..................................................
            &nbsp;&nbsp;&nbsp;&nbsp; DISTRITO:
            ..................................................
          </p>
          <p className="field">
            PROVINCIA: ..................................................
            &nbsp;&nbsp;&nbsp;&nbsp; DEPARTAMENTO:
            ..................................................
          </p>
          <p className="field">
            REFERENCIA: ..................................................
          </p>
          <p className="field">
            TELÉFONO FIJO: ................................ CELULAR:
            ................................
          </p>
        </section>

        <section className="section">
          <h3 className="subtitle">4. DIVERSOS</h3>
          <p className="field">
            (EN CASO DE EMERGENCIA O NECESIDAD ESTABLECER COMUNICACIÓN CON)
          </p>
          <p className="field">
            (1)(PARENTESCO) ..................................................
          </p>
          <p className="field">
            TELÉFONO FIJO: ................................ CELULAR:
            ................................
          </p>
          <p className="field">
            (2) (PARENTESCO) ..................................................
          </p>
          <p className="field">
            TELÉFONO FIJO: ................................ CELULAR:
            ................................
          </p>
        </section>

        <div className="footer">
          <div className="firma-group">
            <div>
              <p className="firma">
                FIRMA: ..................................................
              </p>
              <p className="firma">
                POST FIRMA: ..................................................
              </p>
              <p className="location">
                UBICACIÓN: ............, ...... DE ........ DEL .....
              </p>
            </div>
            <div>
              <div className="huella-box"></div>
              <span className="huella-label">HUELLA DIGITAL</span>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  min-height: 100%;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: flex-start;

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
    text-transform: uppercase;
  }

  .subtitle {
    text-decoration: underline;
    margin: 8px 0 4px;
  }

  .field {
    margin: 2px 0;
    white-space: pre-wrap;
  }

  .footer {
    margin-top: 24px;
  }

  .firma-group {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .firma {
    margin: 6px 0;
  }

  .location {
    margin-top: 16px;
    font-weight: bold;
  }

  .huella-box {
    width: 100px;
    height: 100px;
    border: 1px solid #000;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 10px;
    text-align: center;
    padding: 4px;
    box-sizing: border-box;
  }
`;
