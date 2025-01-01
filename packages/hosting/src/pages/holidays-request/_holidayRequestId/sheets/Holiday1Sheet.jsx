import React from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import { userFullName } from "../../../../utils";
import { DATE_FORMAT_TO_FIRESTORE } from "../../../../firebase/firestore";
import { QRCode } from "antd";
import { LogoPrimary } from "../../../../images";
import { CustomStampSheet } from "../../../../components";

export const Holiday1Sheet = ({ user, holiday }) => {
  const position = `Jefe de Estado Mayor del ${holiday?.gu || ""}`;

  const { current } = holiday.user.holidaysDetail;
  const { firstSeal } = holiday.seals;
  return (
    <Container>
      <div className="sheet">
        <div className="header">
          <h1>EJÉRCITO DEL PERÚ</h1>
        </div>
        <div className="main">
          <div className="request-content">
            <div className="request-content__title">
              <h1>GU : {holiday?.gu.toUpperCase() || "NO REGISTRADO"}</h1>
              <h1>UU : {holiday?.uu.toUpperCase() || "NO REGISTRADO"}</h1>
            </div>
            <p className="request-content__body">
              <h1>PAPELETA DE PERMISO</h1>
              <p>
                Este Comando de Bienestar del Ejército, autoriza al PC &nbsp;
                <span className="capitalize">{userFullName(user)}</span>, para
                hacer el uso de &nbsp;
                {current?.totalDays || "0"} días de permiso, por el
                motivo:&nbsp;
                {holiday?.reason}
              </p>
              <table>
                <tr>
                  <td>EMPIEZA</td>
                  <td>:</td>
                  <td>
                    <span className="capitalize">
                      {holiday?.startDate
                        ? dayjs(
                            holiday?.startDate,
                            DATE_FORMAT_TO_FIRESTORE,
                          ).format("dddd D [de] MMMM [del] YYYY")
                        : "Sin registro"}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>TERMINA</td>
                  <td>:</td>
                  <td>
                    <span className="capitalize">
                      {holiday?.endDate
                        ? dayjs(
                            holiday?.endDate,
                            DATE_FORMAT_TO_FIRESTORE,
                          ).format("dddd D [de] MMMM [del] YYYY")
                        : "Sin registro"}
                    </span>
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
              <p className="date">
                San Borja,&nbsp;
                {holiday
                  ? dayjs(holiday?.createAt.toDate()).format(
                      "D [del] MMMM [del] YYYY",
                    )
                  : ""}
              </p>
            </p>

            <div className="request-content__footer">
              <span className="qr">
                <QRCode
                  value={`${window.location.href}`}
                  icon={LogoPrimary}
                  style={{
                    objectFit: "contain",
                  }}
                />
              </span>
              <span className="seal">
                <CustomStampSheet
                  topText={firstSeal.sealTopText}
                  bottomText={firstSeal.sealBottomText}
                  supervisorName={firstSeal.supervisorName}
                  supervisorCip={firstSeal.supervisorCip}
                  supervisorDegree={firstSeal.supervisorDegree}
                />
              </span>
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

          .date {
            display: flex;
            flex-direction: column;
            align-items: end;
            text-align: end;
            font-size: 1.5em;
          }
        }

        &__footer {
          display: flex;
          margin-top: 2em;

          .qr {
            width: 50%;
            display: flex;
            align-items: end;
          }

          .seal {
            width: 50%;
            display: flex;
            align-items: end;
          }

          & > div {
            display: flex;
          }

          .cip {
            width: 100%;
            display: flex;
            font-weight: 500;
            justify-content: center;

            span {
              width: 100%;
            }
          }
        }
      }
    }
  }
`;
