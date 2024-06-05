import React, { useEffect } from "react";
import { useParams } from "react-router";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import styled from "styled-components";
import { notification, Spinner } from "../../../../../../components";
import { livestockAndEquinesRef } from "../../../../../../firebase/collections";
import moment from "moment";
import { DATE_FORMAT_TO_FIRESTORE } from "../../../../../../firebase/firestore";

export const PdfRegistrationClinicHistory = () => {
  const { livestockAndEquineId } = useParams();

  const [
    livestockAndEquine,
    livestockAndEquineLoading,
    livestockAndEquineError,
  ] = useDocumentData(livestockAndEquinesRef.doc(livestockAndEquineId));

  const [clinicHistory, clinicHistoryLoading, clinicHistoryError] =
    useCollectionData(
      livestockAndEquinesRef
        .doc(livestockAndEquineId)
        .collection("clinic-history")
    );

  useEffect(() => {
    (clinicHistoryError || livestockAndEquineError) &&
      notification({ type: "error" });
  }, [clinicHistoryError, livestockAndEquineError]);

  if (clinicHistoryLoading || livestockAndEquineLoading)
    return <Spinner height="80vh" />;

  return (
    <Container>
      <div className="sheet">
        <div className="header">
          <div className="header__top">
            <div>
              <span>{livestockAndEquine.greatUnit}</span>
              <span>{livestockAndEquine.unit}</span>
              <span>PEL VET</span>
            </div>
          </div>
          <h2 className="header__title">
            HISTORIA CLÍNICA VETERINARIA DEL {livestockAndEquine.unit}
          </h2>
        </div>
        <div className="main">
          <WrapperContent>
            <div className="main__information">
              <div>
                <div>
                  <span>Nombre:</span>
                  <span className="capitalize">{livestockAndEquine.name}</span>
                </div>
                <div>
                  <span>Sexo:</span>
                  <span className="capitalize">
                    {livestockAndEquine.gender}
                  </span>
                </div>
                <div>
                  <span>Color:</span>
                  <span className="capitalize">{livestockAndEquine.color}</span>
                </div>
              </div>
              <div>
                <div>
                  <span>N° de Matrícula:</span>
                  <span>{livestockAndEquine.registrationNumber}</span>
                </div>
                <div>
                  <span>Fecha de Nacimiento:</span>
                  <span>
                    {moment(
                      livestockAndEquine.birthdate,
                      DATE_FORMAT_TO_FIRESTORE
                    ).format("DD/MM/YYYY")}
                  </span>
                </div>
                <div>
                  <span>Escuadrón:</span>
                  <span>{livestockAndEquine.squadron}</span>
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
                    <th style={{ width: "10em" }}>Revisado</th>
                  </tr>
                </thead>
                <tbody>
                  {clinicHistory.map((_clinicHistory, index) => (
                    <tr key={index}>
                      <td>
                        {moment(_clinicHistory.createAt.toDate()).format(
                          "DD/MM/YYYY HH:mm"
                        )}
                      </td>
                      <td>{_clinicHistory.symptomatology}</td>
                      <td>{_clinicHistory.diagnosis}</td>
                      <td>{_clinicHistory.treatment}</td>
                      <td>{_clinicHistory.observation}</td>
                      <td></td>
                    </tr>
                  ))}
                  <tr>
                    <td></td>
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
                    <td></td>
                  </tr>
                  <tr>
                    <td></td>
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
                    <td></td>
                  </tr>
                  <tr>
                    <td></td>
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
                    <td></td>
                  </tr>
                  <tr>
                    <td></td>
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
                    <td></td>
                  </tr>
                  <tr>
                    <td></td>
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
  font-size: 12px;

  .sheet {
    .header {
      &__top {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 2em;
        font-size: 0.9em;
        font-weight: 500;
        padding-right: 1em;

        div {
          display: flex;
          flex-direction: column;
          gap: 0.5em;
        }
      }

      &__title {
        text-align: center;
        font-size: 1.7em;
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
          font-size: 0.9em;
        }
      }
    }
  }
`;

const WrapperContent = styled.div`
  padding: 0.8em 0;
`;
