import React from "react";
import { LogoArmyPeru, LogoPrimary } from "../../../../../images";
import styled from "styled-components";
import dayjs from "dayjs";
import {
  DasRequestList,
  DegreesArmy,
  institutions,
} from "../../../../../data-list";
import { userFullName } from "../../../../../utils";
import {QRCode} from "../../../../../components";

export const HalfScholarshipPostgraduateStudiesUniversitySheet = ({ data }) => {
  const { headline, createAt, familiar, institution, requestType } = data;

  const createdDate = dayjs(createAt.toDate());

  const emptyContent = "...............";

  const findRequestName = DasRequestList.find(
    (_requestType) => _requestType.id === requestType
  ).name;

  const findDegree = DegreesArmy.flatMap(
    (degreeArmy) => degreeArmy.options
  ).find((degree) => degree.value === headline.degree).label;

  const institutionView = institutions[institution?.type].find(
    (_institution) => _institution.id === institution?.id
  ).name;

  return (
    <Container>
      <div className="sheet">
        <div className="header">
          <img src={LogoArmyPeru} alt="Logo del Ejército del Perú" />
          <h2>Media beca otorgado por la universidad</h2>
          <img src={LogoPrimary} alt="Logo de COBIENE" />
        </div>
        <div className="main">
          <div className="request-type">
            <div className="request-type__text">
              <p>SOLICITA:</p>
              <p>
                {requestType && findRequestName}
                <span> {institutionView || emptyContent}</span>
              </p>
            </div>
          </div>
          <div className="request-content">
            <h2 className="request-content__title">
              Señor General De Brigada Cmdte Gral Del Comando De Bienestar Del
              Ejército (Departamento De Apoyo Social)
            </h2>
            <p className="request-content__introduction">
              <span className="first-word">S.G.</span>
              <span> {userFullName(headline)} </span>, Grado
              <span> {findDegree || emptyContent} </span> CIP
              <span> {headline?.cip || emptyContent} </span> en actual servicio
              <span> {headline?.currentService || emptyContent} </span> con
              Telf.
              <span> {headline?.phoneNumber || emptyContent} </span> ante Ud.
              con el debido respeto me presento y expongo:
            </p>
            <p className="request-content__body">
              Que teniendo conocimiento del convenio de cooperación con la
              Universidad
              <span> {institutionView || emptyContent} </span>
              respetuosamente solicito a Ud. se digne disponer a quien
              corresponda dar las facilidades para obtener la media beca de
              estudios para seguir estudios de post grado en la especialidad de
              <span> {institution.specialty || emptyContent} </span>.
            </p>
            <div className="request-content__message">
              <p>
                <span>POR LO EXPUESTO:</span> A Ud. respetuosamente solicito
                acceder a mi pedido.
              </p>
            </div>
            <div className="request-content__footer">
              <p className="date">
                Lima, <span>{createdDate.format("DD")}</span> de{" "}
                <span>{createdDate.format("MM")}</span> del
                <span>{createdDate.format("YYYY")}</span>
              </p>
              <div className="signature">
                <div className="signature__item">
                  <div></div>
                  <p>Firma</p>
                </div>
                <div className="signature__item">
                  <div></div>
                  <p>Post Firma</p>
                </div>
              </div>
              <div className="cip">
                <span>{headline?.cip || ""}</span>
                <p>CIP</p>
              </div>
            </div>
          </div>
        </div>
        <div className="footer">
          <QRCode
            value={window.location.href}
            icon={LogoArmyPeru}
            iconSize={25}
            type="svg"
            size={110}
            bordered={false}
          />
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
  }

  .sheet {
    width: 100%;

    .header {
      display: grid;
      grid-template-columns: auto 1fr auto;
      place-items: center;

      h2 {
        font-size: 1.7em;
        font-family: Arial, Helvetica, sans-serif;
        text-align: center;
        text-transform: uppercase;
      }

      img {
        width: auto;
        height: 5em;
        object-fit: contain;
      }
    }

    .main {
      .request-type {
        display: flex;
        justify-content: flex-end;
        margin: 1.5em 0;

        &__text {
          width: 30em;
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
        }

        &__introduction {
          line-height: 1.5;
          margin-bottom: 1em;
          text-align: justify;

          .first-word {
            display: block;
            text-align: left;
            border: none;
            font-weight: normal;
          }
          span {
            font-weight: 500;
          }
        }

        &__body {
          line-height: 1.5;
          margin-bottom: 1em;
          text-indent: 3em;
          text-align: justify;

          span {
            font-weight: 500;
          }
        }

        &__message {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 1em;

          span {
            display: block;
          }
        }

        &__footer {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 1em;

          .date {
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
            gap: 1em;

            &__item {
              width: 12em;
              display: flex;
              flex-direction: column;
              justify-content: flex-end;
              font-weight: 500;

              div {
                height: 6em;
              }

              img {
                width: 100%;
                height: 100%;
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
            p {
              border-top: 1px dotted #000;
              padding-top: 0.5em;
            }
            span {
              width: 100%;
            }
          }
        }
      }
    }

    .footer {
      display: flex;
      flex-direction: column;
      gap: 1em;

      &__documents-certificates {
        h3 {
          font-size: 1em;
          text-transform: uppercase;
          text-decoration: underline;
        }
        ul {
          list-style: none;
          line-height: 1.5;
        }
      }
    }
  }
`;
