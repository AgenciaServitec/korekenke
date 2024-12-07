import React from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import { findDegree, userFullName } from "../../../../utils";
import { SignatureSheet } from "../../../../components";
import { DATE_FORMAT_TO_FIRESTORE } from "../../../../firebase/firestore";
import { capitalize } from "lodash";

export const Holiday1Sheet = ({ user, holiday }) => {
  const { current, old } = holiday.user.holidaysDetail;
  return (
    <Container>
      <div className="sheet">
        <div className="header">
          <h1>EJÉRCITO DEL PERÚ</h1>
        </div>
        <div className="main">
          <div className="request-content">
            <div className="request-content__title">
              <h1>GU : COBIENE</h1>
              <h1>UU : SGC</h1>
            </div>
            <p className="request-content__body">
              <h1>PAPELETA DE PERMISO</h1>
              <p>
                Este Comando de Bienestar del Ejército, autoriza al PC &nbsp;
                <span>{userFullName(user)}</span>, para hacer el uso de &nbsp;
                {current?.totalDays || "0"} días de permiso, por el
                motivo:&nbsp;
                {holiday?.reason}
              </p>
              <table>
                <tr>
                  <td>EMPIEZA</td>
                  <td>:</td>
                  <td>
                    {holiday?.startDate
                      ? dayjs(
                          holiday?.startDate,
                          DATE_FORMAT_TO_FIRESTORE,
                        ).format("dddd D [de] MMMM [del] YYYY")
                      : "Sin registro"}
                  </td>
                </tr>
                <tr>
                  <td>TERMINA</td>
                  <td>:</td>
                  <td>
                    {holiday?.endDate
                      ? dayjs(
                          holiday?.endDate,
                          DATE_FORMAT_TO_FIRESTORE,
                        ).format("dddd D [de] MMMM [del] YYYY")
                      : "Sin registro"}
                  </td>
                </tr>
                <tr>
                  <td>DIRECCIÓN</td>
                  <td>:</td>
                  <td>Av. Vargas 179 Piso 1</td>
                </tr>
                <tr>
                  <td>TELÉFONO</td>
                  <td>:</td>
                  <td>{user?.phone?.number}</td>
                </tr>
              </table>
            </p>

            <div className="request-content__footer">
              <p className="date">
                San Borja,{" "}
                <span> {dayjs(user.createAt.toDate()).format("DD")} </span> de
                <span>
                  {" "}
                  {capitalize(
                    dayjs(user.createAt.toDate()).format("MMMM"),
                  )}{" "}
                </span>{" "}
                del
                <span> {dayjs(user.createAt.toDate()).format("YYYY")} </span>
              </p>
              <SignatureSheet
                signaturethumbUrl={user?.signaturePhoto?.thumbUrl}
                signatureUrl={user?.signaturePhoto?.url}
                name={userFullName(user)}
                cip={user?.cip}
                degree={findDegree(user?.degree)?.label}
              />
            </div>
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
    text-align: center;
  }

  .sheet {
    width: 100%;

    .header {
      display: grid;
      h1 {
        font-family: Arial, Helvetica, sans-serif;
        text-align: center;
      }
    }

    .main {
      .request-type {
        display: flex;
        justify-content: flex-end;
        margin: 1.5em 0;

        &__text {
          max-width: 30em;
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
          display: flex;
          justify-content: space-between;
        }

        &__body {
          line-height: 1.5;
          margin-bottom: 1em;
          text-indent: 3em;
          text-align: justify;

          h1 {
            text-decoration: underline;
            margin-bottom: 1em;
          }

          p {
            text-transform: none;
            font-size: 1.5em;
            text-indent: 2em;
            text-align: justify;
          }

          table {
            margin-top: 1em;
            font-size: 1.5em;

            td {
              text-align: left;
              text-transform: none;
              padding: 0 0.8em 0 0;
            }
          }

          span {
            font-weight: 500;
          }
        }

        &__footer {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 1em;

          .date {
            font-size: 1.5em;
            margin-bottom: 1em;
            span {
              font-weight: 500;
            }
          }

          & > div {
            display: flex;
          }

          .signature {
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            gap: 0.3em;

            &__item {
              font-weight: 500;

              div {
                width: 14em;
                height: 8em;
                padding-bottom: 0.5em;
                img {
                  width: 100%;
                  height: 100%;
                  object-fit: contain;
                }
              }

              p {
                border-top: 1px dotted #000;
                text-align: start;
                padding-top: 0.5em;
              }
            }
          }

          .cip {
            width: 12em;
            display: flex;
            font-weight: 500;
            text-align: start;

            span {
              width: 100%;
            }
          }
        }
      }
    }
  }
`;
