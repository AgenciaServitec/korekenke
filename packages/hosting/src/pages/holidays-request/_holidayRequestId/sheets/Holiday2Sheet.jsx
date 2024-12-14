import React from "react";
import styled from "styled-components";
import { userFullName } from "../../../../utils";
import { SignatureSheet2 } from "../../../../components/ui/sheet/SignatureSheet2";
import { QRCode } from "antd";
import { LogoCobiene } from "../../../../images";

export const Holiday2Sheet = ({ holiday, departmentBoss }) => {
  const { current, old } = holiday.user.holidaysDetail;
  const position = `Jefe Dpto. Personal - ${holiday.gu}`;

  const totalHolidays = {
    totalWorkingDays: current.workingDays + old.oldWorkingDays,
    totalSaturdays: current.saturdays + old.oldSaturdays,
    totalSundays: current.sundays + old.oldSundays,
    total: current.totalDays + old.totalDays,
  };

  const daysRemaining = 30 - totalHolidays?.total || 0;

  return (
    <Container>
      <div className="sheet">
        <div className="header">
          <h1>DETALLES DE LA SOLICITUD</h1>
        </div>
        <div className="main">
          <div className="request-content">
            <table className="summary-table">
              <thead>
                <tr>
                  <th>RESUMEN</th>
                  <th>DÍAS LABORABLES</th>
                  <th>DÍAS SABADOS</th>
                  <th>DÍAS DOMINGOS</th>
                  <th>TOTAL DÍAS USADOS</th>
                  <th>DÍAS PENDIENTES</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>DÍAS USADOS</th>
                  <td>{old?.oldWorkingDays || 0}</td>
                  <td>{old?.oldSaturdays || 0}</td>
                  <td>{old?.oldSundays || 0}</td>
                  <td>{old?.totalDays || 0}</td>
                  <td rowSpan={3}>{daysRemaining}</td>
                </tr>

                <tr>
                  <th>PTE PAPELETA</th>
                  <td>{current?.workingDays || 0}</td>
                  <td>{current?.saturdays || 0}</td>
                  <td>{current?.sundays || 0}</td>
                  <td>{current?.totalDays || 0}</td>
                </tr>
                <tr>
                  <th>TOTALES</th>
                  <td>{totalHolidays?.totalWorkingDays || 0}</td>
                  <td>{totalHolidays?.totalSaturdays || 0}</td>
                  <td>{totalHolidays?.totalSundays || 0}</td>
                  <td>{totalHolidays?.total || 0}</td>
                </tr>
              </tbody>
            </table>

            <div className="request-content__footer">
              <span className="qr">
                <QRCode
                  value={`${window.location.href}`}
                  icon={LogoCobiene}
                  style={{ objectFit: "contain" }}
                />
              </span>
              <SignatureSheet2
                signaturethumbUrl={departmentBoss?.signaturePhoto?.thumbUrl}
                signatureUrl={departmentBoss?.signaturePhoto?.url}
                name={userFullName(departmentBoss)}
                cip={departmentBoss?.cip}
                position={position}
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
        text-decoration: underline;
        margin-bottom: 1em;
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
        .summary-table {
          width: 100%;
          height: 15em;
          border: 1px solid black;
          text-align: center;
          font-size: 1.3em;

          th,
          td {
            width: 8em;
            border: 1px solid black;
            padding: 0.5em 1.2em;
          }
        }

        &__footer {
          width: 100%;
          justify-content: space-between;
          display: flex;
          gap: 1em;
          margin-top: 3em;

          .qr {
            display: flex;
            align-items: center;
          }

          & > div {
            display: flex;
          }

          .signature {
            display: flex;
            flex-direction: column;
            text-align: center;
            gap: 0.3em;

            &__item {
              font-weight: 500;

              .img {
                width: 100%;
                height: 8em;
                padding: 0.5em;
                border-bottom: 2px solid black;
                margin-bottom: 0.5em;

                img {
                  width: 100%;
                  height: 100%;
                  object-fit: contain;
                }
              }

              p {
                padding-top: 0.5em;
              }
            }
          }
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
`;
