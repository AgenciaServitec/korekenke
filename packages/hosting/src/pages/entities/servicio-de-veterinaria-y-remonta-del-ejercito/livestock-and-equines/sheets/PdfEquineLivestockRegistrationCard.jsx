import React from "react";
import { useParams } from "react-router";
import { firestore } from "../../../../../firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import styled from "styled-components";

export const PdfEquineLivestockRegistrationCard = () => {
  const { livestockAndEquineId } = useParams();
  const [
    liveStockAndEquine,
    liveStockAndEquineLoading,
    liveStockAndEquineError,
  ] = useDocumentData(
    firestore.collection("livestock-and-equines").doc(livestockAndEquineId)
  );

  console.log({ liveStockAndEquine });

  return (
    <Container>
      <div className="sheet">
        <div className="header">
          <h2 className="header__title">
            SERVICIO DE VETERINARIA Y REMONTA DEL EJÉRCITO
          </h2>
          <h3 className="header__title">
            TARJETA DE REGISTRO DE GANADO EQUINO
          </h3>
        </div>
        <div className="main">
          <WrapperContent>
            <div className="main__information">
              <div>
                <div>
                  <span>Nombre:</span>
                  <span>Baral Nakatomy</span>
                </div>
                <div>
                  <span>Sexo:</span>
                  <span>C</span>
                </div>
                <div>
                  <span>Color:</span>
                  <span>Castaño</span>
                </div>
              </div>
              <div>
                <div>
                  <span>N° de Matrícula:</span>
                  <span>7-11</span>
                </div>
                <div>
                  <span>Fecha de Nacimiento:</span>
                  <span>25-09-2007</span>
                </div>
                <div>
                  <span>Escuadrón:</span>
                  <span>B</span>
                </div>
              </div>
            </div>
          </WrapperContent>
          <WrapperContent>
            <div className="main__table">
              <table>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Sintomatología</th>
                    <th>Diagnóstico</th>
                    <th>Tratamiento</th>
                    <th>Observación</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>15/03/2024</td>
                    <td>Manoteo</td>
                    <td>SAA</td>
                    <td>Pastillas</td>
                    <td>Polpación Rectal</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>15/03/2024</td>
                    <td>Manoteo</td>
                    <td>SAA</td>
                    <td>Pastillas</td>
                    <td>Polpación Rectal</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>15/03/2024</td>
                    <td>Manoteo</td>
                    <td>SAA</td>
                    <td>Pastillas</td>
                    <td>Polpación Rectal</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </WrapperContent>
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 14px;

  .sheet {
    .header {
      &__title {
        text-align: center;
        font-size: 1.75em;
      }
    }

    .main {
      &__information {
        width: 85%;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;

        > div {
          display: flex;
          flex-direction: column;
          gap: 1em;
          div {
            display: flex;
            gap: 0.5em;
            span:first-child {
              font-weight: 500;
            }
          }
        }
      }
      &__table {
        table {
          width: 100%;
        }
        th,
        td {
          border: 1px solid #000;
        }

        th {
          text-transform: uppercase;
          padding: 0.5em 0;
        }

        td {
          height: 3em;
          padding: 0 0.5em;
        }
      }
    }
  }
`;

const WrapperContent = styled.div`
  padding: 0.8em 0;
`;