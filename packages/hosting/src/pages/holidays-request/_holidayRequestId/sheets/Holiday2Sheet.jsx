import React from "react";
import styled from "styled-components";
import { findDegree, userFullName } from "../../../../utils";
import { SignatureSheet } from "../../../../components";

export const Holiday2Sheet = ({ user, holiday }) => {
  const { current, old } = holiday.user.holidaysDetail;

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
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 1em;

          & > div {
            display: flex;
          }

          .signature {
            display: flex;
            flex-direction: column;
            justify-content: center;
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
