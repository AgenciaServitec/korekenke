import React from "react";
import styled from "styled-components";
import { LogoOfficeEconomy, LogoPrimary } from "../../../../../images";

export const FSCECDeclarationLetterSheet = () => {
  return (
    <Container>
      <div className="sheet">
        <div className="header">
          <img
            src={LogoOfficeEconomy}
            alt="Logo de la oficina de economía del ejército"
            className="icon-header"
          />
          <div className="title-header">
            <h5>MINISTERIO DE DEFENSA - EJERCITO DEL PERÚ</h5>
            <h1>CARTA DECLARATORIA FSCEC</h1>
          </div>
          <img
            src={LogoPrimary}
            alt="Logo de la oficina de economía del ejército"
            className="icon-header"
          />
        </div>
        <div className="info-box">
          <p>
            SEÑOR GENERAL DE BRIGADA JEFE DE LA OFICINA DE ECONOMÍA DEL DERECHO
            (FSCEC)
          </p>
          <table className="box">
            <tbody>
              <tr>
                <td>GRADO</td>
                <td>APELLIDOS Y NOMBRES</td>
                <td colSpan={9}>NUMERO DE CIP</td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td colSpan={2} className="hidden-cell"></td>
                <td colSpan={9}>NÚMERO DE DNI</td>
              </tr>
              <tr>
                <td colSpan={2} className="hidden-cell"></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
          <p>
            DECLARO <br /> QUE EN CASO DE FALLECIMIENTO CAUSAL ESTIPULADA EN EL
            DS N°041 DE/CCFFAA Y SU MODIFICATORIA, DS N°048 DE/CCFFAA. D1/PERS
            AUTORIZO AL FONDO DE SEGURO DE CESACIÓN DE EMPLEADOS CIVILES A
            DEDUCIR INTEGRAMENTE EL IMPORTE RECIBIDO POR CONCEPTO DE ADELANTO Y
            PRÉSTAMOS RECIBIDOS CONSTITUYÉNDOSE EL SALDO RESULTANTE EN EL 100% A
            SER ENTREGADOS A MIS BENEFICIARIOS, SEGÚN MI VOLUNTAD, DE ACUERDO AL
            DETALLE SIGUIENTE:
          </p>
          <table>
            <tbody>
              <tr>
                <td rowSpan={2}>NOMBRES Y APELLIDOS</td>
                <td rowSpan={2}>NÚMERO DNI</td>
                <td rowSpan={2} style={{ width: "10em" }}>
                  RELACIÓN CON EL TITULAR
                </td>
                <td colSpan={2}>PORCENTAJE</td>
              </tr>
              <tr>
                <td>EN LETRAS</td>
                <td>EN NÚMEROS</td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td colSpan={2} className="hidden-cell"></td>
                <td>TOTAL</td>
                <td>CIEN POR CIENTO</td>
                <td>100%</td>
              </tr>
            </tbody>
          </table>
          <p>EN FÉ DE LO CUAL FIRMO</p>
          <br />
        </div>
        <div className="signature-boxes">
          <div>
            <table className="register-number">
              <tbody>
                <tr>
                  <td colSpan={2}>NÚMERO DE REGISTRO</td>
                </tr>
                <tr style={{ height: "6em" }}>
                  <td style={{ width: "4em" }}></td>
                  <td style={{ width: "14em" }}></td>
                </tr>
              </tbody>
            </table>
            <p>SOLO PARA SER LLENADO POR LA DLE - PSCEC</p>
          </div>
          <div>
            <table className="signatures">
              <tbody>
                <tr>
                  <td rowSpan={3} style={{ width: "8em", border: "none" }}></td>
                  <td rowSpan={2}>FECHA</td>
                  <td>DIA</td>
                  <td>MES</td>
                  <td>AÑO</td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td colSpan={4}>FIRMA DEL APORTANTE</td>
                </tr>
                <tr>
                  <td rowSpan={3} style={{ height: "7em" }}></td>
                  <td colSpan={4} style={{ height: "5em" }}></td>
                </tr>
                <tr>
                  <td colSpan={4}>POST FIRMA DEL APORTANTE</td>
                </tr>
                <tr>
                  <td colSpan={4}></td>
                </tr>
                <tr>
                  <td rowSpan={2}>HUELLA DIGITAL (ÍNDICE DERECHO)</td>
                  <td colSpan={4} style={{ textAlign: "left" }}>
                    CIP N°:
                  </td>
                </tr>
                <tr>
                  <td colSpan={4} style={{ textAlign: "left" }}>
                    DNI N°:
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <h5 style={{ textAlign: "center" }}>LEGALIZACIÓN</h5>
      </div>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;

  .sheet {
    background-color: white;
    padding: 3rem;
    max-width: 800px;
    width: 100%;
    font-family: sans-serif;
    font-size: 15px;
  }

  .header {
    display: flex;
    justify-content: space-around;

    .icon-header {
      width: 5.4em;
      height: 6em;
    }

    .title-header {
      text-align: center;

      h1 {
        text-decoration: underline;
      }
    }
  }
  p {
    text-align: justify;
    font-size: 0.8em;
  }
  td {
    height: 1.7em;
    border: black 1px solid;
  }

  table {
    font-size: 0.75em;
    text-align: center;
    width: 100%;
    margin-bottom: 1em;
  }
  .hidden-cell {
    border: none;
  }
  .signature-boxes {
    display: flex;
    justify-content: space-between;
    align-content: center;
    .register-number {
      width: 18em;
      p {
        font-size: 0.6em;
      }
    }
    .signatures {
      width: 30em;
    }
  }
`;
