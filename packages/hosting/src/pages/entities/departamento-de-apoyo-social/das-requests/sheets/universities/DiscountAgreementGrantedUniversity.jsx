import React from "react";
import styled from "styled-components";
import { LogoPrimary, LogoArmyPeru } from "../../../../../../images";

export const DiscountAgreementGrantedUniversitySheet = () => {
  return (
    <Container>
      <div className="sheet">
        <div className="header">
          <img src={LogoArmyPeru} alt="Logo del Ejército del Perú" />
          <h2>Modelo de solicitud - Descuento por convenio en universidad</h2>
          <img src={LogoPrimary} alt="Logo de COBIENE" />
        </div>
        <div className="main">
          <div className="request-type">
            <div className="request-type__text">
              <p>SOLICITA:</p>
              <p>
                Descuento por convenio otorgado por la Universidad
                <span> Universidad Peruana de Ciencias Aplicadas</span>
              </p>
            </div>
          </div>
          <div className="request-content">
            <h2 className="request-content__title">
              Señor General De Brigada Cmdte Gral Del Comando De Bienestar Del
              Ejército (Departamento De Apoyo Social)
            </h2>
            <p className="request-content__introduction">
              <span className="first-word">S.G.</span>
              <span> Angel Emilio Gala Flores </span>, Grado
              <span> General del Ejército </span> CIP
              <span> 987054021 </span> en actual servicio
              <span> Servicio text contenido </span> con Telf.
              <span> 987654321 </span> ante Ud. con el debido respeto me
              presento y expongo:
            </p>
            <p className="request-content__body">
              Que teniendo conocimiento del convenio de cooperación
              interinstitucional con la Universidad
              <span> Universidad Peruana de Ciencias Aplicadas </span>
              respetuosamente solicito a Ud. se digne disponer a quien
              corresponda dar las facilidades para obtener el descuento por
              convenio en beneficion de mi <span> No se que va aquí </span> para
              seguir estudios en la especialidad de
              <span> Ingeniería de Sistemas</span>.
            </p>
            <div className="request-content__message">
              <p>
                <span>POR LO EXPUESTO:</span> A Ud. respetuosamente solicito
                acceder a mi pedido.
              </p>
            </div>
            <div className="request-content__footer">
              <p className="date">
                Lima, <span>03</span> de <span>07</span> del <span>2024</span>
              </p>
              <div>
                <div className="signature">
                  <p>Firma</p>
                </div>
                <div className="signature">
                  <p>Post Firma</p>
                </div>
                <div className="cip">
                  <span>987654300</span>
                  <p>CIP</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer">
          <div className="footer__documents-certificates">
            <h3>Ingresantes</h3>
            <ul>
              <li>02 Copias de Constancia de Ingreso de la Univ.</li>
              <li>02 Copias de boleta pago matricula de la Univ.</li>
              <li>02 Copias de Liquidación de Haberes del Titular</li>
              <li>02 Copias de CIP y DNI (Titular)</li>
              <li>02 Copias de CIF y DNI (Familiar)</li>
            </ul>
          </div>
          <div className="footer__documents-certificates">
            <h3>Requisitos: Antiguos</h3>
            <ul>
              <li>02 Copias de Consolidado de notas (último ciclo)</li>
              <li>02 Copias de la ultima boleta de pago de la Univ.</li>
              <li>02 Copias de Liquidación de Haberes del Titular</li>
              <li>02 Copias de CIP y DNI (Titular)</li>
              <li>02 Copias de CIF y DNI (Familiar)</li>
            </ul>
          </div>
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 14px;
  padding: 2em;

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .sheet {
    width: 100%;

    .header {
      display: grid;
      grid-template-columns: auto 1fr auto;
      place-items: center;

      h2 {
        font-size: 1.7em;
        font-family: Arial, Helvetica, sans-serif;
        text-align: center;
        text-transform: uppercase;
        -webkit-text-stroke-width: 1px;
        -webkit-text-stroke-color: #000;
        color: red;
      }

      img {
        width: auto;
        height: 5em;
        object-fit: contain;
      }
    }

    .main {
      .request-type {
        display: flex;
        justify-content: flex-end;
        margin: 1.5em 0;

        &__text {
          width: 30em;
          display: flex;
          gap: 0.5em;

          span {
            font-weight: 500;
          }
        }
      }

      .request-content {
        &__title {
          font-size: 1.1em;
          text-align: center;
          text-transform: uppercase;
          line-height: 1.5;
          margin-bottom: 1em;
        }

        &__introduction {
          line-height: 1.5;
          margin-bottom: 1em;
          text-align: justify;

          .first-word {
            display: block;
            text-align: left;
            border: none;
            font-weight: normal;
          }
          span {
            font-weight: 500;
          }
        }

        &__body {
          line-height: 1.5;
          margin-bottom: 1em;
          text-indent: 3em;
          text-align: justify;

          span {
            font-weight: 500;
          }
        }

        &__message {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 1em;

          span {
            display: block;
          }
        }

        &__footer {
          display: flex;
          flex-direction: column;
          align-items: flex-end;

          .date {
            margin-bottom: 1em;
            span {
              font-weight: 500;
            }
          }

          & > div {
            width: 12em;
            display: flex;
            flex-direction: column;
            gap: 1em;
          }

          .signature {
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            height: 7em;
            font-weight: 500;
            p {
              border-top: 1px dotted #000;
              text-align: center;
              padding-top: 0.5em;
            }
          }

          .cip {
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            font-weight: 500;
            text-align: center;
            p {
              border-top: 1px dotted #000;
              padding-top: 0.5em;
            }
            span {
              width: 100%;
            }
          }
        }
      }
    }

    .footer {
      display: flex;
      flex-direction: column;
      gap: 1em;

      &__documents-certificates {
        h3 {
          font-size: 1em;
          text-transform: uppercase;
          text-decoration: underline;
        }
        ul {
          list-style: none;
          line-height: 1.5;
        }
      }
    }
  }
`;
