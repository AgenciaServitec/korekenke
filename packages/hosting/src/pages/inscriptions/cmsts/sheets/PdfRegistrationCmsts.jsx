import React from "react";
import styled from "styled-components";
import { QRCode } from "antd";
import moment from "moment";

export const PdfRegistrationCmsts = () => {
  return (
    <Container>
      <div className="sheet">
        <div className="header">
          <div></div>
          <h2 className="header__title">
            ASOCIACIÓN CIRCULO MILITAR DE SUPERVISORES, TÉCNICOS Y SUBOFICIALES
            DEL EP
            <br /> <span>FICHA DE INSCRIPCIÓN</span>
          </h2>
          <div className="header__image">
            <img
              src="https://www.ciat.org/wp-content/uploads/2019/03/Roberto-de-Michele_avatar.jpg"
              alt="img file"
            />
          </div>
        </div>
        <div className="main">
          <WrapperContent>
            <div className="main__first-part">
              <h2>PRIMERA PARTE</h2>
              <div className="main__section">
                <div>
                  <h3>I. Datos Personales</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>Apellido Paterno</th>
                        <th>Apellido Materno</th>
                        <th>Nombres</th>
                        <th>Sexo</th>
                        <th>Estado civil</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Mendoza</td>
                        <td>Perca</td>
                        <td>Roberto</td>
                        <td>M</td>
                        <td>Casado</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div>
                  <h3>II. Lugar y fecha de nacimiento</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>Nacionalidad</th>
                        <th>Departamento</th>
                        <th>Provincia</th>
                        <th>Distrito/Ciudad</th>
                        <th>Dia</th>
                        <th>Mes</th>
                        <th>Año</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Peruano</td>
                        <td>Lima</td>
                        <td>Lima</td>
                        <td>Pueblo Libre</td>
                        <td>13</td>
                        <td>09</td>
                        <td>1981</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div>
                  <h3>III. Domicilio actual</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>Departamento</th>
                        <th>Provincia</th>
                        <th>Distrito/Ciudad</th>
                        <th>Urbanización</th>
                        <th>Dirección</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Lima</td>
                        <td>Lima</td>
                        <td>Pueblo Libre</td>
                        <td>San Juan</td>
                        <td>Jr. Pereyra 108 - Dpto 4A</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="cip-dni-table">
                  <h3>IV. Documentos personales</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>CIP</th>
                        <th>DNI</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <ul>
                            <li>9</li>
                            <li>8</li>
                            <li>7</li>
                            <li>6</li>
                            <li>5</li>
                            <li>4</li>
                            <li>3</li>
                            <li>2</li>
                            <li>1</li>
                          </ul>
                        </td>
                        <td>
                          <ul>
                            <li>8</li>
                            <li>7</li>
                            <li>6</li>
                            <li>5</li>
                            <li>4</li>
                            <li>3</li>
                            <li>2</li>
                            <li>1</li>
                          </ul>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </WrapperContent>
          <WrapperContent>
            <div className="main__second-part">
              <h2>SEGUNDA PARTE</h2>
              <div>
                <h3>V. Familiares directos del aportante</h3>
                <table>
                  <thead>
                    <tr>
                      <th>N°</th>
                      <th>Apellidos y nombres</th>
                      <th>Parentesco</th>
                      <th>Edad</th>
                      <th>NRO CCIIFFS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>Nombre Apellido</td>
                      <td>Hijo (a)</td>
                      <td>12</td>
                      <td>123656</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </WrapperContent>
          <WrapperContent>
            <h2>Otros</h2>
            <table>
              <thead>
                <tr>
                  <th>N° Telefono fijo</th>
                  <th>Correo electrónico</th>
                  <th>Celular</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>972252744</td>
                  <td>Beto1perk@gmail.com</td>
                  <td>972252744</td>
                </tr>
              </tbody>
            </table>
          </WrapperContent>
          <WrapperContent>
            <div className="main__note">
              Recuerda que los beneficios que brinda la ACM-STS es única y
              exclusivamente para el titular y sus familiares directos previa
              presentación de su carnet de identidad (hijos menores de 24 años
              de edad). <br />
              Para casos de retiro a solicitud el mínimo de aporte será de
              dieciocho meses.
            </div>
          </WrapperContent>
        </div>
        <div className="footer">
          <WrapperContent>
            <div className="section-footer">
              <div className="right-index">
                <div className="right-index__index">
                  <div className="right-index__box-index"></div>
                  <h3 className="right-index__box-text">Indice Derecho</h3>
                </div>
              </div>
              <div className="signature-item">
                <div className="signature-item__text">
                  <div className="signature-item__profile">
                    <h4> Pc. Mendoza Perca Roberto</h4>
                    <h4> (Grado y Nombres)</h4>
                  </div>

                  <div className="signature-item__image">
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
                <div className="signature-item__pdf-date">
                  <span>Chorrillos {moment().format("DD MMMM YYYY")}</span>
                </div>
              </div>
            </div>
          </WrapperContent>
        </div>
        <div className="footer-bottom">
          <QRCode
            value={"https://ant.design/components/qr-code"}
            type="svg"
            size={120}
            bordered={false}
          />
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 16px;

  .sheet {
    background: #fff;

    .header {
      display: grid;
      grid-template-columns: 15% 1fr 15%;
      gap: 1em;

      &__title {
        line-height: 1.2;
        text-align: center;
        font-size: 1.1em;

        span {
          text-decoration: underline;
        }
      }

      &__image {
        display: flex;
        justify-content: end;

        img {
          width: 7em;
          height: 7em;
          object-fit: cover;
        }
      }
    }

    .main {
      font-size: 0.8em;

      &__section {
        display: flex;
        flex-direction: column;
        gap: 1em;

        .cip-dni-table {
          tbody {
            td {
              border: none;
            }
            ul {
              width: max-content;
              margin: 0 auto;
              list-style: none;
              display: flex;
            }
            li {
              width: 25px;
              height: 25px;
              border: 1px solid #000;
              border-left: none;
              padding: 0.5em;
              display: flex;
              justify-content: center;
              align-items: center;
              &:first-child {
                border-left: 1px solid #000;
              }
            }
          }
        }
      }

      table {
        width: 100%;
        border-collapse: collapse;

        th,
        td {
          border: 1px solid #000;
          text-align: center;
        }

        th {
          background-color: #f2f2f2;
        }

        thead {
          th {
            padding: 2px;
            text-transform: uppercase;
            font-weight: 500;
          }
        }

        tbody {
          td {
            padding: 4px;
          }
        }

        tr:nth-child(even) {
          background-color: #f2f2f2;
        }
      }

      &__note {
        text-align: center;
        font-size: 0.8em;
        font-weight: 400;
      }
    }

    .footer {
      .section-footer {
        display: grid;
        grid-template-columns: 1fr 1fr;

        .right-index {
          display: flex;
          place-items: center;
          &__index {
            display: grid;
            gap: 1em;
          }
          &__box-index {
            width: 6em;
            height: 7em;
            border: 1px solid #444;
            margin: auto;
          }
          &__box-text {
            text-align: center;
            font-size: 0.7em;
          }
        }

        .signature-item {
          &__text {
            display: flex;
            align-items: start;
            justify-content: end;
            gap: 1em;
          }
          &__profile {
            padding-top: 5em;
            align-self: center;
            h4 {
              font-size: 0.8em;
              &:last-child {
                font-size: 0.7em;
              }
            }
          }
          &__image {
            display: flex;
            flex-direction: column;
            justify-content: center;
            text-align: center;
            h5 {
              font-size: 0.8em;
            }
            div img {
              width: 8.5em;
              height: auto;
            }
          }

          &__pdf-date {
            font-size: 0.7em;
            font-weight: bold;
            margin-top: 1em;
            text-align: right;
          }
        }
      }
    }

    .footer-bottom {
      width: 100%;
      display: flex;
      justify-content: end;
    }
  }
`;

const WrapperContent = styled.div`
  padding: 0 0 1.1em;

  h2,
  h3 {
    font-size: 1em;
    text-transform: uppercase;
  }

  h2 {
    text-decoration: underline;
  }
`;