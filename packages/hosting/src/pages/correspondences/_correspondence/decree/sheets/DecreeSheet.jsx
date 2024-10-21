import React from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import { DATE_FORMAT_TO_FIRESTORE } from "../../../../../firebase/firestore";
import { DecreeList } from "../../../../../data-list";
import { QRCode } from "../../../../../components";
import { LogoPrimary } from "../../../../../images";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export const DecreeSheet = ({ decree }) => {
  const decreeList1 = DecreeList.slice(0, DecreeList.length / 2);
  const decreeList2 = DecreeList.slice(
    DecreeList.length / 2,
    DecreeList.length,
  );

  return (
    <Container>
      <div className="sheet">
        <div className="header">
          <div className="header__left">
            <h4>MINISTERIO DE DEFENSA</h4>
            <h4>COBIENE - JEM</h4>
          </div>
          <div className="header__right">
            <h4>
              FECHA:{" "}
              {decree?.createAt
                ? dayjs(decree?.createAt.toDate()).format(
                    DATE_FORMAT_TO_FIRESTORE,
                  )
                : null}
            </h4>
          </div>
        </div>
        <div className="title">
          <h3>EL CRL EP JEFE DEL ESTADO MAYOR DEL COBIENE</h3>
        </div>
        <div className="title">
          <h3>DEPARTAMENTO DECRETADO: DEPER</h3>
        </div>
        <div className="main">
          <WrapperContent>
            <div className="decree">
              <div className="decree__title">
                <h4>DECRETO</h4>
              </div>
              <div className="decree__items">
                <ul>
                  {decreeList1.map((decreeItem) => (
                    <li key={decreeItem.id}>
                      <div className="check">
                        {decree?.decreeId === decreeItem.id && (
                          <FontAwesomeIcon icon={faXmark} size="lg" />
                        )}
                      </div>
                      <div className="item">{decreeItem.name}</div>
                    </li>
                  ))}
                </ul>
                <ul>
                  {decreeList2.map((decreeItem) => (
                    <li key={decreeItem.id}>
                      <div className="check">
                        {decree?.decreeId === decreeItem.id && (
                          <FontAwesomeIcon icon={faXmark} size="lg" />
                        )}
                      </div>
                      <div className="item">{decreeItem.name}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="priority">
              <div className="priority__left">
                <div className="check">
                  {decree?.priority === "urgent" && (
                    <FontAwesomeIcon icon={faXmark} size="lg" />
                  )}
                </div>
                <div className="item">URGENTE</div>
              </div>
              <div className="priority__right">
                <div className="check">
                  {decree?.priority === "very_urgent" && (
                    <FontAwesomeIcon icon={faXmark} size="lg" />
                  )}
                </div>
                <div className="item">MUY URGENTE</div>
              </div>
            </div>
            <div className="observation">
              <div className="observation__title">
                <h4>OBSERVACIONES:</h4>
              </div>
              <div className="observation__description">
                <p>{decree?.observation}</p>
              </div>
            </div>
            <div className="signature">
              <div className="signature__item">
                <div className="img">
                  <img src="" alt="signature" />
                </div>
                <hr className="hr" />
                <div>
                  <strong>O- 224534372- O+</strong>
                </div>
                <div>
                  <strong>JORGE LUIS JARAMILLO LAM</strong>
                </div>
                <div>CRL INT</div>
                <div>JEFE DEL ESTADO MAYOR</div>
              </div>
            </div>
            <div className="qr-sheet">
              <QRCode
                value={window.location.href}
                icon={LogoPrimary}
                iconSize={25}
                type="svg"
                size={110}
                bordered={false}
              />
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
  font-size: 11px;

  .sheet {
    .header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 2em;
    }
    .title {
      display: flex;
      justify-content: center;
    }

    .main {
      &__table {
        table {
          width: 100%;
          tr {
            width: 100%;
          }
        }
        th,
        td {
          border: 1px solid #000;
        }

        th {
          text-transform: uppercase;
          padding: 0.5em 0.2em;
          font-size: 0.5em;
        }

        td {
          height: 3em;
          padding: 0.5em;
          font-size: 0.6em;
          &:nth-child(2) {
            width: 50px;
          }

          &:nth-child(9) {
            width: 50px;
          }
        }
      }
    }
  }
`;

const WrapperContent = styled.div`
  padding: 0.8em 0;
  width: 80%;
  margin: auto;
  .decree {
    margin-bottom: 2em;
    &__title {
      text-align: center;
      border: 1px solid #000;
      background: lightsteelblue;
      h4 {
        margin: 0;
        padding: 0.2em;
      }
    }
    &__items {
      display: grid;
      grid-template-columns: 1fr 1fr;
      ul {
        list-style: none;
        padding: 1em;
        li {
          display: flex;
          gap: 1em;
          .check {
            width: 4em;
            height: 2em;
            border: 1px solid #000;
            display: grid;
            place-items: center;
            margin-bottom: 1em;
          }
          .item {
            font-size: 1.3em;
            display: flex;
            place-items: center;
            font-weight: 600;
          }
        }
      }
    }
  }
  .priority {
    border: 1px solid #000;
    background: lightsteelblue;
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin-bottom: 2em;
    &__left,
    &__right {
      display: flex;
      align-items: center;
      gap: 1em;
      .check {
        width: 5em;
        height: 2em;
        border-right: 1px solid #000;
        display: grid;
        place-items: center;
      }
      .item {
        font-size: 1.3em;
        font-weight: 600;
      }
    }

    &__right {
      .check {
        border-left: 1px solid #000;
      }
    }
  }
  .observation {
    margin-bottom: 2em;
    .observation__title {
      text-align: left;
    }
    .observation__description {
      p {
        white-space: pre-line;
        font-size: 1.3em;
      }
    }
  }
  .signature {
    display: flex;
    justify-content: end;
    &__item {
      display: flex;
      flex-direction: column;
      text-align: center;
      gap: 0.2em;
      font-weight: 500;
      .img {
        width: 13em;
        height: 7em;
        margin: auto auto 0.5em auto;
        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          margin: auto;
        }
      }
      .hr {
        background: #000;
        height: 1px;
        border: none;
      }
    }
  }
`;
