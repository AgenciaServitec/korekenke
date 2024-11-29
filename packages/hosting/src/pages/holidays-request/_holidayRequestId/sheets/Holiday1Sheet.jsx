import React from "react";
import styled from "styled-components";
import { findDegree, userFullName } from "../../../../utils";
import { SignatureSheet } from "../../../../components";
import dayjs from "dayjs";
import { DATE_FORMAT_TO_FIRESTORE } from "../../../../firebase/firestore";

export const Holiday1Sheet = ({ user, holiday, holidays }) => {
  const holidaysByUser = holidays
    .filter((holidayByUser) => holidayByUser.id !== holiday.id)
    .map((_holiday) => ({
      start: dayjs(_holiday.startDate, DATE_FORMAT_TO_FIRESTORE),
      end: dayjs(_holiday.endDate, DATE_FORMAT_TO_FIRESTORE),
    }));

  const countDays = holidaysByUser.map(({ start, end }) => {
    const workDays = [1, 2, 3, 4, 5];
    let workingDays = 0,
      saturdays = 0,
      sundays = 0;

    while (start.isSameOrBefore(end, "day")) {
      const dayOfStart = start.day();
      if (workDays.includes(dayOfStart)) workingDays++;
      if (dayOfStart === 6) saturdays++;
      if (dayOfStart === 0) sundays++;
      start = start.add(1, "day");
    }

    return {
      workingDays,
      saturdays,
      sundays,
    };
  });

  const oldHolidays = countDays.reduce(
    (acc, { workingDays, saturdays, sundays }) => {
      acc.workingDays += workingDays;
      acc.saturdays += saturdays;
      acc.sundays += sundays;
      acc.total += workingDays + saturdays + sundays;
      return acc;
    },
    {
      workingDays: 0,
      saturdays: 0,
      sundays: 0,
      total: 0,
    },
  );

  return (
    <Container>
      <div className="sheet">
        <div className="header">
          <h1>DETALLES DE LA SOLICITUD</h1>
        </div>
        <div className="main">
          <div className="request-content">
            <table className="summary-table">
              <tr>
                <th>RESUMEN</th>
                <th>DÍAS LABORABLES</th>
                <th>DÍAS SABADOS</th>
                <th>DÍAS DOMINGOS</th>
                <th>TOTAL DÍAS USADOS</th>
                <th>DÍAS PENDIENTES</th>
              </tr>
              <tr>
                <th>DÍAS USADOS</th>
                <td>{oldHolidays?.workingDays || 0}</td>
                <td>{oldHolidays?.saturdays || 0}</td>
                <td>{oldHolidays?.sundays || 0}</td>
                <td>{oldHolidays?.total || 0}</td>
                <td rowSpan={3}>
                  {holiday?.user?.holidays?.daysRemaining || 0}
                </td>
              </tr>
              <tr>
                <th>PTE PAPELETA</th>
                <td>{holiday?.user?.holidays?.workingDays || 0}</td>
                <td>{holiday?.user?.holidays?.saturdays || 0}</td>
                <td>{holiday?.user?.holidays?.sundays || 0}</td>
                <td>{holiday?.user?.holidays?.daysUsed || 0}</td>
              </tr>
              <tr>
                <th>TOTALES</th>
                <td>
                  {(oldHolidays?.workingDays || 0) +
                    (holiday?.user?.holidays?.workingDays || 0)}
                </td>
                <td>
                  {(oldHolidays?.saturdays || 0) +
                    (holiday?.user?.holidays?.saturdays || 0)}
                </td>
                <td>
                  {(oldHolidays?.sundays || 0) +
                    (holiday?.user?.holidays?.sundays || 0)}
                </td>
                <td>
                  {(oldHolidays?.total || 0) +
                    (holiday?.user?.holidays?.daysUsed || 0)}
                </td>
              </tr>
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
            justify-content: flex-end;
            gap: 0.3em;

            &__item {
              font-weight: 500;

              div {
                margin-top: 4em;
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
                text-align: center;
                padding-top: 0.5em;
              }
            }
          }

          .cip {
            width: 12em;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            font-weight: 500;
            text-align: center;

            span {
              width: 100%;
            }
          }
        }
      }
    }
  }
`;
