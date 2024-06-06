import React from "react";
import styled from "styled-components";
import {
  HerradoImg,
  LogoServicioVeterinarioRemontaEjercito,
  ToilleteImg,
} from "../../../../../../images";
import { EquineMagazineProfiles } from "../../../../../../data-list";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import moment from "moment/moment";

export const EquineMagazineProfileSheet = ({
  livestockAndEquine,
  equineMagazineProfile,
}) => {
  console.log({ livestockAndEquine });
  console.log({ equineMagazineProfile });

  return (
    <Container>
      <div className="sheet">
        <div className="header">
          <div className="header__top">
            <img
              src={LogoServicioVeterinarioRemontaEjercito}
              alt="Logo de Servicio Veterinario y Remonta del Ejercito"
            />
            <h1 className="header__top-title">
              SERVICIO DE VETERINARIA Y REMONTA DEL EJÉRCITO
            </h1>
            <img
              src={LogoServicioVeterinarioRemontaEjercito}
              alt="Logo de Servicio Veterinario y Remonta del Ejercito"
            />
          </div>
          <br />
          <div className="header__description">
            <div className="header__profile">
              <table className="table-header-profile">
                <thead>
                  <tr>
                    <th colSpan={7}>FICHA DE REVISTA EQUINA</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="name">NOMBRE DEL EQUINO</td>
                    <td className="value">{livestockAndEquine?.name}</td>
                    <td className="name">EDAD</td>
                    <td className="value">
                      {moment().diff(
                        moment(
                          moment(
                            livestockAndEquine.birthdate,
                            "DD/MM/YYYY HH:mm"
                          )
                        ),
                        "years"
                      )}{" "}
                      AÑOS
                    </td>
                    <td className="name">MESES</td>
                    <td className="value" colSpan={2}>
                      {moment().diff(
                        moment(
                          livestockAndEquine.birthdate,
                          "DD/MM/YYYY HH:mm"
                        ),
                        "months"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="name">N° MATRÍCULA</td>
                    <td className="value">
                      {livestockAndEquine?.registrationNumber}
                    </td>
                    <td className="name">N° CHIP</td>
                    <td className="value">{livestockAndEquine?.chipNumber}</td>
                    <td className="name">SEXO</td>
                    <td className="value" colSpan={2}>
                      {livestockAndEquine?.gender === "male"
                        ? "MACHO"
                        : "HEMBRA"}
                    </td>
                  </tr>
                  <tr>
                    <td className="name">RAZA O TIPO</td>
                    <td className="value">{livestockAndEquine?.raceOrLine}</td>
                    <td className="name" colSpan={2}>
                      PELAJE
                    </td>
                    <td className="value" colSpan={3}>
                      {livestockAndEquine?.fur}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <br />
        <div className="main">
          <div className="main-body-condition">
            <table className="table-body-condition">
              <thead>
                <tr>
                  <th>CONDICIÓN CORPORAL</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <table className="table-content">
                      <thead>
                        <tr>
                          <th colSpan={3}>
                            PUNTAJE DE CONDICIÓN CORPORAL EN EQUINOS
                          </th>
                          <th>OBSERVACIÓN</th>
                          <th>CALIFICACIÓN</th>
                        </tr>
                      </thead>
                      <tbody>
                        {EquineMagazineProfiles.bodyCondition.map(
                          (_bodyCondition, index) => (
                            <tr
                              key={index}
                              className={
                                _bodyCondition?.id ===
                                  equineMagazineProfile?.bodyCondition?.id &&
                                "active"
                              }
                            >
                              <td>
                                <img
                                  src={_bodyCondition.img}
                                  alt={`Imagen de ${_bodyCondition.name}`}
                                />
                              </td>
                              <td>{_bodyCondition.id}</td>
                              <td className="body-condition-name">
                                <span>{_bodyCondition.name}</span>
                                <span>
                                  {_bodyCondition?.id ===
                                  equineMagazineProfile?.bodyCondition?.id ? (
                                    <FontAwesomeIcon
                                      icon={faCircleCheck}
                                      size="3x"
                                      style={{ color: "green" }}
                                    />
                                  ) : (
                                    ""
                                  )}
                                </span>
                              </td>
                              <td>
                                <span>
                                  {_bodyCondition?.id ===
                                  equineMagazineProfile?.bodyCondition?.id
                                    ? equineMagazineProfile?.bodyCondition
                                        ?.observation
                                    : ""}
                                </span>
                              </td>
                              <td className="body-condition-qualification">
                                <strong>
                                  {_bodyCondition?.id ===
                                  equineMagazineProfile?.bodyCondition
                                    ?.qualification
                                    ? _bodyCondition?.id
                                    : ""}
                                </strong>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <br />
          <div className="main-toillete">
            <table className="table-toillete">
              <thead>
                <tr>
                  <th colSpan={5}>TOILLETE</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <img src={ToilleteImg} alt="Imagen de caballo" />
                  </td>
                  <td>
                    <table className="table-qualification">
                      <thead>
                        <tr>
                          {EquineMagazineProfiles.toillete.map((_toillete) => (
                            <th key={_toillete?.id}>{_toillete?.name}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          {EquineMagazineProfiles.toillete.map((_toillete) => (
                            <td
                              key={_toillete?.id}
                              className={
                                _toillete?.id ===
                                  equineMagazineProfile?.toillete?.id &&
                                "active"
                              }
                            >
                              {_toillete?.id ===
                              equineMagazineProfile?.toillete?.id ? (
                                <FontAwesomeIcon
                                  icon={faCircleCheck}
                                  size="3x"
                                  style={{ color: "green" }}
                                />
                              ) : (
                                ""
                              )}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <br />
          <div className="main-horseshoe">
            <table className="table-horseshoe">
              <thead>
                <tr>
                  <th colSpan={5}>HERRADO</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <img src={HerradoImg} alt="Imagen de caballo" />
                  </td>
                  <td>
                    <table className="table-qualification">
                      <thead>
                        <tr>
                          {EquineMagazineProfiles.horseshoe.map(
                            (_horseshoe) => (
                              <th key={_horseshoe?.id}>{_horseshoe?.name}</th>
                            )
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          {EquineMagazineProfiles.horseshoe.map(
                            (_horseshoe) => (
                              <td
                                key={_horseshoe?.id}
                                className={
                                  _horseshoe?.id ===
                                    equineMagazineProfile?.horseshoe?.id &&
                                  "active"
                                }
                              >
                                {_horseshoe?.id ===
                                equineMagazineProfile?.horseshoe?.id ? (
                                  <FontAwesomeIcon
                                    icon={faCircleCheck}
                                    size="3x"
                                    style={{ color: "green" }}
                                  />
                                ) : (
                                  ""
                                )}
                              </td>
                            )
                          )}
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="signature">
          <p>FIRMA DEL PROFESIONAL</p>
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 13px;

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .sheet {
    .active {
      background-color: #e2f5e2;
    }

    .header {
      &__top {
        width: 100%;
        display: flex;
        justify-content: space-between;

        img {
          width: 50px;
        }
      }

      &__top-title {
        font-size: 1.5em;
      }

      &__description {
      }

      &__description-title {
        text-align: center;
        font-size: 1.2em;
      }

      &__profile {
        .table-header-profile {
          width: 100%;

          .value {
            text-transform: uppercase;
            text-align: center;
            font-weight: 500;
          }

          th,
          td {
            padding: 0.3em;
            border: 1px solid #000;
          }

          td:first-child {
            width: 15em;
          }

          td:nth-child(2) {
            width: 10em;
          }

          td:nth-child(3),
          td:nth-child(5),
          td:nth-child(6),
          td:nth-child(7) {
            width: 5em;
          }

          td:nth-child(4) {
            width: 8em;
          }
        }
      }
    }

    .main {
      margin-bottom: 6em;

      .main-body-condition {
        &__title {
          text-align: center;
          font-size: 1.2em;
        }

        .table-body-condition {
          width: 100%;

          th,
          td {
            border: 1px solid #000;
          }

          > thead th {
            padding: 0.3em 0;
          }
        }

        .table-content {
          width: 100%;

          img {
            width: 100%;
            height: 45px;
          }

          .body-condition-name {
            position: relative;
            font-weight: 500;

            span:last-child {
              position: absolute;
              top: 50%;
              right: 0.5em;
              transform: translateY(-50%);
            }
          }

          .body-condition-qualification {
            font-size: 1em;
          }

          th {
            padding: 0.5em;
            border-top: 0;
          }

          th:first-child,
          td:first-child {
            border-left: 0;
          }

          th:last-child,
          td:last-child {
            border-right: 0;
          }

          td {
            border-bottom: 0;
            text-align: center;
            text-transform: uppercase;
            font-size: 0.8em;
            padding: 0.5em;
          }

          th,
          td {
            width: auto;
          }

          td:first-child {
            width: 15em;
            padding: 0;
          }

          td:nth-child(2) {
            width: 2em;
            color: red;
            font-size: 1.5em;
            font-weight: 700;
          }

          td:nth-child(3) {
            width: 18em;
          }

          td:last-child {
            width: 2em;
          }
        }
      }

      .main-toillete {
        .table-toillete {
          width: 100%;

          th {
            padding: 0.3em 0;
          }

          th,
          td {
            border: 1px solid #000;
          }

          > tbody tr {
            img {
              width: 100%;
              height: 100%;
            }

            > td:first-child {
              width: 12em;
              padding: 0.5em;
            }
          }
        }

        .table-qualification {
          width: 100%;

          th,
          td {
            width: 25%;
            padding: 0.2em 0;
          }

          th {
            border-top: 0;
          }

          td {
            text-align: center;
            border-bottom: 0;
          }

          th:first-child,
          td:first-child {
            border-left: 0;
          }

          th:last-child,
          td:last-child {
            border-right: 0;
          }

          tbody {
            height: 7em;
          }
        }
      }

      .main-horseshoe {
        .table-horseshoe {
          width: 100%;

          th {
            padding: 0.3em 0;
          }

          th,
          td {
            border: 1px solid #000;
          }

          > tbody tr {
            img {
              width: 100%;
              height: 100%;
            }

            > td:first-child {
              width: 12em;
              padding: 0.5em;
            }
          }
        }

        .table-qualification {
          width: 100%;

          th,
          td {
            width: 25%;
            padding: 0.2em 0;
          }

          th {
            border-top: 0;
          }

          td {
            text-align: center;
            border-bottom: 0;
          }

          th:first-child,
          td:first-child {
            border-left: 0;
          }

          th:last-child,
          td:last-child {
            border-right: 0;
          }

          tbody {
            height: 7em;
          }
        }
      }
    }

    .signature {
      display: flex;
      justify-content: flex-end;

      p {
        width: max-content;
        border-top: 1px dashed #000;
        padding: 0.5em 5em 0 5em;
        font-size: 0.8em;
        font-weight: 500;
      }
    }
  }
`;

const WrapperContent = styled.div`
  padding: 0.8em 0;
`;
