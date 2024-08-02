import React from "react";
import styled from "styled-components";
import {
  HerradoImg,
  LogoArmyPeru,
  LogoServicioVeterinarioRemontaEjercito,
  ToilleteImg,
} from "../../../../../../images";
import { AnimalMagazineProfiles } from "../../../../../../data-list";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import dayjs from "dayjs";
import { QRCode } from "../../../../../../components";

export const AnimalMagazineProfilesheet = ({
  animal,
  animalMagazineProfile,
}) => {
  return (
    <Container>
      <div className="sheet">
        <div className="header">
          <div className="header__top">
            <img
              src={LogoArmyPeru}
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
                    <th colSpan={7}>FICHA DE REVISTA DEL ANIMAL</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="name">NOMBRE</td>
                    <td className="value">{animal?.name}</td>
                    <td className="name">EDAD</td>
                    <td className="value">
                      {dayjs().diff(
                        dayjs(dayjs(animal.birthdate, "DD/MM/YYYY HH:mm")),
                        "years",
                      )}{" "}
                      AÑOS
                    </td>
                    <td className="name">MESES</td>
                    <td className="value" colSpan={2}>
                      {dayjs().diff(
                        dayjs(animal.birthdate, "DD/MM/YYYY HH:mm"),
                        "months",
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="name">N° MATRÍCULA</td>
                    <td className="value">{animal?.registrationNumber}</td>
                    <td className="name">N° CHIP</td>
                    <td className="value">{animal?.chipNumber}</td>
                    <td className="name">SEXO</td>
                    <td className="value" colSpan={2}>
                      {animal?.gender === "male" ? "MACHO" : "HEMBRA"}
                    </td>
                  </tr>
                  <tr>
                    <td className="name">RAZA O TIPO</td>
                    <td className="value">{animal?.raceOrLine}</td>
                    <td className="name" colSpan={2}>
                      PELAJE
                    </td>
                    <td className="value" colSpan={3}>
                      {animal?.fur}
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
                  <th colSpan={5}>CONDICIÓN CORPORAL</th>
                </tr>
                <tr>
                  <th colSpan={3}>PUNTAJE DE CONDICIÓN CORPORAL</th>
                  <th>OBSERVACIÓN</th>
                  <th>CALIFICACIÓN</th>
                </tr>
              </thead>
              <tbody>
                {AnimalMagazineProfiles[animal.type].bodyCondition.map(
                  (_bodyCondition, index) => (
                    <tr
                      key={index}
                      className={
                        _bodyCondition?.id ===
                          animalMagazineProfile?.bodyCondition?.id && "active"
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
                          animalMagazineProfile?.bodyCondition?.id ? (
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
                          animalMagazineProfile?.bodyCondition?.id
                            ? animalMagazineProfile?.bodyCondition?.observation
                            : ""}
                        </span>
                      </td>
                      <td className="body-condition-qualification">
                        <strong>
                          {_bodyCondition?.id ===
                          animalMagazineProfile?.bodyCondition?.qualification
                            ? _bodyCondition?.id
                            : ""}
                        </strong>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
          <br />
          <div className="main-toillete">
            <table>
              <thead>
                <tr>
                  <th colSpan={5}>TOILLETE</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td rowSpan={2}>
                    <img
                      src={AnimalMagazineProfiles[animal.type].toillete.image}
                      alt="Imagen de animal"
                    />
                  </td>
                  {AnimalMagazineProfiles[animal.type].toillete.items.map(
                    (_toillete) => (
                      <th key={_toillete?.id}>{_toillete?.name}</th>
                    ),
                  )}
                </tr>
                <tr>
                  {AnimalMagazineProfiles[animal.type].toillete.items.map(
                    (_toillete) => (
                      <td
                        key={_toillete?.id}
                        className={
                          _toillete?.id ===
                            animalMagazineProfile?.toillete?.id && "active"
                        }
                      >
                        {_toillete?.id ===
                        animalMagazineProfile?.toillete?.id ? (
                          <FontAwesomeIcon
                            icon={faCircleCheck}
                            size="3x"
                            style={{ color: "green" }}
                          />
                        ) : (
                          ""
                        )}
                      </td>
                    ),
                  )}
                </tr>
              </tbody>
            </table>
          </div>
          <br />
          {AnimalMagazineProfiles?.[animal.type]?.horseshoe && (
            <div className="main-horseshoe">
              <table>
                <thead>
                  <tr>
                    <th colSpan={5}>HERRADO</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td rowSpan={2}>
                      <img
                        src={
                          AnimalMagazineProfiles?.[animal.type]?.horseshoe
                            ?.image
                        }
                        alt="Imagen de animal"
                      />
                    </td>
                    {AnimalMagazineProfiles?.[
                      animal.type
                    ]?.horseshoe?.items.map((_horseshoe) => (
                      <th key={_horseshoe?.id}>{_horseshoe?.name}</th>
                    ))}
                  </tr>
                  <tr>
                    {AnimalMagazineProfiles?.[
                      animal.type
                    ]?.horseshoe?.items.map((_horseshoe) => (
                      <td
                        key={_horseshoe?.id}
                        className={
                          _horseshoe?.id ===
                            animalMagazineProfile?.horseshoe?.id && "active"
                        }
                      >
                        {_horseshoe?.id ===
                        animalMagazineProfile?.horseshoe?.id ? (
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
            </div>
          )}
        </div>

        <div className="signature">
          <div className="signature-qr">
            <QRCode
              value={window.location.href}
              icon={LogoServicioVeterinarioRemontaEjercito}
              iconSize={25}
              type="svg"
              size={110}
              bordered={false}
            />
          </div>
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
      .main-body-condition {
        &__title {
          text-align: center;
          font-size: 1.2em;
        }

        table {
          width: 100%;

          th,
          td {
            border: 1px solid #000;
            padding: 0.3em;
            text-transform: uppercase;
            text-align: center;
          }

          tbody {
            td {
              font-size: 0.8em;
            }

            td:first-child {
              width: 15em;
              padding: 0;
              img {
                width: 100%;
                height: 4.5em;
              }
            }

            td:nth-child(2) {
              width: 2em;
              font-size: 1.5em;
              font-weight: 700;
              color: red;
            }

            td:nth-child(3) {
              width: 18em;
              position: relative;
              span:last-child {
                position: absolute;
                top: 50%;
                right: 0.5em;
                transform: translateY(-50%);
              }
            }

            td:last-child {
              width: 2em;
            }
          }
        }
      }

      .main-toillete,
      .main-horseshoe {
        table {
          width: 100%;

          th,
          td {
            border: 1px solid #000;
            padding: 0.3em;
            text-transform: uppercase;
            text-align: center;
          }

          tbody {
            > tr:first-child {
              td:first-child {
                height: 7em;
                img {
                  width: 100%;
                  height: 100%;
                  object-fit: contain;
                }
              }
            }

            td {
              width: calc(100% / 5);
            }
          }
        }
      }
    }

    .signature {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;

      .signature-qr {
        width: 100px;
        height: 100px;
      }

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
