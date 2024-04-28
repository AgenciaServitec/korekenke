import React from "react";
import styled from "styled-components";

export const InscriptionFile = () => {
  return (
    <Container>
      <div className="sheet-one">
        <div className="header mb_1">
          <div className="item"></div>
          <div className="item">
            ASOCIACIÓN CIRCULO MILITAR DE SUPERVISORES, TÉCNICOS Y SUBOFICIALES
            DEL EP FICHA DE INSCRIPCIÓN
          </div>
          <div className="item">
            <img
              src="https://www.ciat.org/wp-content/uploads/2019/03/Roberto-de-Michele_avatar.jpg"
              alt="img file"
            />
          </div>
        </div>

        <div className="personal-dates">
          <div className="wrapper-first mb_1">
            <h2> PRIMERA PARTE</h2>
            <div className="table-title">
              <h3 className="tittle-one">I. Datos Personales</h3>
              <table className="mb_1">
                <thead>
                  <tr>
                    <th>Apellido Paterno</th>
                    <th>Apellido Materno</th>
                    <th>Nombres</th>
                    <th> Sexo </th>
                    <th> Estado civil </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Mendoza</td>
                    <td>Perca</td>
                    <td>Roberto</td>
                    <td> M </td>
                    <td> Casado </td>
                  </tr>
                </tbody>
              </table>

              <h3 className="tittle-one">II. Lugar y fecha de nacimiento</h3>
              <table className="mb_1">
                <thead>
                  <tr>
                    <th>Nacionalidad</th>
                    <th>Departamento</th>
                    <th>Provincia</th>
                    <th> Distrito/Ciudad </th>
                    <th> Dia</th>
                    <th> Mes</th>
                    <th> Año</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Peruano</td>
                    <td>Lima</td>
                    <td>Lima</td>
                    <td> Pueblo Libre </td>
                    <td> 13 </td>
                    <td> 09 </td>
                    <td> 1981 </td>
                  </tr>
                </tbody>
              </table>

              <h3 className="tittle-one">III. Domicilio actual</h3>
              <table className="mb_1">
                <thead>
                  <tr>
                    <th>Departamento</th>
                    <th>Provincia</th>
                    <th> Distrito/Ciudad </th>
                    <th>Urbanización</th>
                    <th>Direccón</th>
                  </tr>
                </thead>
                <tbody>
                  <td> Lima </td>
                  <td> Lima </td>
                  <td> Pueblo Libre </td>
                  <td> San Juan </td>
                  <td> Jr. Pereyra 108 - Dpto 4A </td>
                </tbody>
              </table>

              <h3 className="tittle-one">IV. Documentos personales</h3>
              <table className="mb_1">
                <thead>
                  <tr>
                    <th>CIP</th>
                    <th>DNI</th>
                  </tr>
                </thead>
                <tbody>
                  <td> 6219950000 </td>
                  <td> 41162024 </td>
                </tbody>
              </table>
            </div>
          </div>
          <div className="wrapper-second">
            <h2> SEGUNDA PARTE</h2>
            <div className="table-title">
              <h3 className="tittle-one">
                V. Familiares directos del aportante
              </h3>
              <table className="mb_1">
                <thead>
                  <tr>
                    <th>N°</th>
                    <th>Apellidos y nombres</th>
                    <th>Parentesco</th>
                    <th> Edad </th>
                    <th> NRO CCIIFFS </th>
                  </tr>
                </thead>
                <tbody>
                  <td> Nombre Apellido </td>
                  <td> Hijo (a) </td>
                  <td> 12 </td>
                  <td> 123656 </td>
                  <td> 123656 </td>
                </tbody>
              </table>

              <h3 className="tittle-one">Otros</h3>
              <table className="mb_1">
                <thead>
                  <tr>
                    <th>N° Telefono fijo</th>
                    <th>Correo electronico</th>
                    <th>Celular</th>
                  </tr>
                </thead>
                <tbody>
                  <td> 972252744 </td>
                  <td> Beto1perk@gmail.com </td>
                  <td> 972252744 </td>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="note mb_1">
          Recuerda que los beneficios que brinda la ACM-STS es única y
          exclusivamente para el titular y sus familiares directos previa
          presentación de su carnet de identidad (hijos menores de 24 años de
          edad). Para casos de retiro a solicitud el mínimo de aporte será de
          dieciocho meses.{" "}
        </div>

        <div className="wrapper-signature mb_1">
          <div className="right-index">
            <div className="index">
              <div className="box-index"></div>
              <h3 className="box-text">Indice Derecho</h3>
            </div>
          </div>
          <div className="signature-item">
            <div className="full-name">
              <h4> Pc. Mendoza Perca Roberto</h4>
              <h4> (Grado y Nombres)</h4>
            </div>

            <div className="signature">
              <div>
                <img
                  src="https://azaharaletras.com/wp-content/uploads/2023/03/firma-m-gonzalez-4.jpg.webp"
                  alt="img file"
                />
              </div>
              <div>------------------------</div>
              <div>
                <h5> Firma</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  height: auto;
  background: #626262;
  padding: 1.5em;

  .mb {
    &_1 {
      margin-bottom: 1em;
    }
    &_2 {
      margin-bottom: 2em;
    }
    &_3 {
      margin-bottom: 3em;
    }
  }

  .sheet-one {
    max-width: 1200px;
    background: #fff;
    padding: 1.5em 2em;
    margin: auto;

    .header {
      display: grid;
      grid-template-columns: 25% 1fr 25%;
      gap: 1em;

      .item:nth-child(2) {
        display: flex;
        place-items: center;
        text-align: center;
        font-weight: 700;
        font-size: 1.5em;
      }

      .item:last-child {
        display: flex;
        justify-content: end;

        img {
          width: 6em;
          height: 6em;
          object-fit: cover;
        }
      }
    }

    .personal-dates {
      table {
        width: 100%;
        border-collapse: collapse;

        th,
        td {
          border: 1px solid #000;
          padding: 8px;
          text-align: center;
        }

        th {
          background-color: #f2f2f2;
        }

        tr:nth-child(even) {
          background-color: #f2f2f2;
        }
      }
    }

    table {
      width: 100%;
      border-collapse: collapse;

      th,
      td {
        border: 1px solid #000;
        padding: 8px;
        text-align: center;
      }

      th {
        background-color: #f2f2f2;
      }

      tr:nth-child(even) {
        background-color: #f2f2f2;
      }
    }
    .note {
      text-align: center;
      width: 100%;
    }

    .wrapper-signature {
      display: grid;
      grid-template-columns: 1fr 1fr;
      padding: 1em;
      .right-index {
        display: flex;
        place-items: center;
        .index {
          display: grid;
          gap: 1em;
          .box-index {
            width: 7em;
            height: 9em;
            border: 1px solid #444;
            margin: auto;
          }
          .box-text {
            text-align: center;
          }
        }
      }
      .signature-item {
        display: flex;
        align-items: center;
        justify-content: end;
        gap: 1em;
        .signature {
          display: flex;
          flex-direction: column;
          justify-content: center;
          text-align: center;
          div img {
            width: 10em;
            height: auto;
          }
        }
      }
    }
  }
`;
