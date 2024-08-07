import React from "react";
import styled from "styled-components";
import { QRCode } from "../../../../../../components";
import dayjs from "dayjs";
import { DATE_FORMAT_TO_FIRESTORE } from "../../../../../../firebase/firestore";
import { LogoServicioVeterinarioRemontaEjercito } from "../../../../../../images";
import { useNavigate } from "react-router";
import { isEmpty } from "lodash";

export const PdfRegistrationClinicHistory = ({
  clinicHistories,
  animal,
  animalEntitiesAndBosses,
}) => {
  const navigate = useNavigate();
  if (isEmpty(clinicHistories)) return navigate(-1);

  const { unit, department } = animalEntitiesAndBosses;

  return (
    <Container>
      <div className="sheet">
        <div className="header">
          <div className="header__top">
            <QRCode
              value={window.location.href}
              icon={LogoServicioVeterinarioRemontaEjercito}
              iconSize={20}
              type="svg"
              size={100}
              bordered={false}
            />
            <div>
              <span>{animal?.greatUnitStatic || ""}</span>
              <span>{animal?.animalUnit}</span>
              <span>{department?.name}</span>
            </div>
          </div>
          <h2 className="header__title">
            HISTORIA CLÍNICA VETERINARIA DEL {unit?.name}
          </h2>
        </div>
        <div className="main">
          <WrapperContent>
            <div className="main__information">
              <div>
                <div>
                  <span>Nombre:</span>
                  <span className="capitalize">{animal?.name}</span>
                </div>
                <div>
                  <span>Sexo:</span>
                  <span className="capitalize">
                    {animal?.gender === "male" ? "Macho" : "Hembra"}
                  </span>
                </div>
                <div>
                  <span>Color:</span>
                  <span className="capitalize">{animal?.color}</span>
                </div>
              </div>
              <div>
                <div>
                  <span>N° de Matrícula:</span>
                  <span>{animal?.registrationNumber}</span>
                </div>
                <div>
                  <span>Fecha nacimiento:</span>
                  <span>
                    {dayjs(animal?.birthdate, DATE_FORMAT_TO_FIRESTORE).format(
                      "DD/MM/YYYY",
                    )}
                  </span>
                </div>
                <div>
                  <span>Escuadrón:</span>
                  <span>{animal?.squadron}</span>
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
                  {clinicHistories.map((_clinicHistory, index) => (
                    <tr key={index}>
                      <td>
                        {_clinicHistory?.createAt &&
                          dayjs(_clinicHistory.createAt.toDate()).format(
                            "DD/MM/YYYY HH:mm",
                          )}
                      </td>
                      <td>{_clinicHistory?.symptomatology}</td>
                      <td>{_clinicHistory?.diagnosis}</td>
                      <td>{_clinicHistory?.treatment}</td>
                      <td>{_clinicHistory?.observation}</td>
                      <td className="checked-user">
                        {_clinicHistory?.checkedBy?.fullName}
                      </td>
                    </tr>
                  ))}
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
      &__top {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 2em;
        font-size: 1em;
        font-weight: 500;
        padding-right: 1em;
        text-transform: uppercase;

        div {
          display: flex;
          flex-direction: column;
          gap: 0.5em;
          font-weight: 600;
        }
      }

      &__title {
        text-transform: uppercase;
        text-align: center;
        font-size: 1.4em;
      }
    }

    .main {
      &__information {
        width: 85%;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        text-transform: uppercase;
        font-size: 0.9em;

        > div {
          display: flex;
          flex-direction: column;
          gap: 1em;
          div {
            display: flex;
            gap: 0.5em;
            text-transform: uppercase;
            span:last-child {
              font-weight: 700;
            }
          }
        }
      }

      &__table {
        table {
          width: 100%;

          td.checked-user {
            font-size: 0.5em;
            font-weight: 700;
            text-transform: capitalize;
            text-align: center;
          }

          tr {
            width: 100%;
            td:first-child {
              width: 87px;
            }
            td:nth-child(2),
            td:nth-child(3),
            td:nth-child(4) {
              width: 120px;
            }

            td:nth-child(5) {
              width: 160px;
            }

            td:nth-child(6) {
              width: auto;
            }
          }
        }
        th,
        td {
          border: 1px solid #000;
        }

        th {
          text-transform: uppercase;
          padding: 0.5em;
          font-size: 0.8em;
        }

        td {
          height: 3em;
          padding: 0.5em;
          font-size: 0.7em;
        }
      }
    }
  }
`;

const WrapperContent = styled.div`
  padding: 0.8em 0;
`;
