import React, { useEffect } from "react";
import styled from "styled-components";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { reservationRef } from "../../../../firebase/collections";
import { useParams } from "react-router";
import { Divider, notification, PDF, Spinner } from "../../../../components/ui";
import moment from "moment";
import { Logo } from "../../../../images";
import { useGlobalData } from "../../../../providers";
import { capitalize } from "lodash";

interface Params {
  reservationId: string;
}

export const TicketIntegration = (): JSX.Element => {
  const { reservationId } = useParams<Params>();
  const { companies } = useGlobalData();

  const [reservation, reservationLoading, reservationError] =
    useDocumentData<Reservation>(reservationRef(reservationId));

  useEffect(() => {
    reservationError && notification({ type: "error" });
  }, [reservationError]);

  if (reservationLoading || !reservation) return <Spinner height="80vh" />;

  return <Ticket reservation={reservation} companies={companies} />;
};

interface TickerProps {
  reservation: Reservation;
  companies: Company[];
}

const Ticket = ({ reservation, companies }: TickerProps): JSX.Element => {
  const companyName = (companyId: string) => {
    return companies.find((company) => company.id === companyId)?.name || "";
  };

  return (
    <PDF>
      <Container>
        <div className="logo-wrapper">
          <img src={Logo} alt="Airport taxi" />
        </div>
        <div className="title center">
          <h1>Airport taxi</h1>
        </div>
        <div className="sub-title center">
          <h2>Ticket de reserva</h2>
        </div>
        <div className="passengers-wrapper center">
          <ul className="secondary-info">
            <li className="justify-between">
              <div>Fecha:</div>
              <div>
                <strong>
                  {moment(reservation.createAt.toDate()).format(
                    "DD/MM/YYYY HH:mm"
                  )}
                </strong>
              </div>
            </li>
          </ul>
          <Divider />
          <ul className="secondary-info">
            <li className="justify-between">
              <strong>
                {capitalize(reservation.firstName)}{" "}
                {capitalize(reservation.lastName)}
              </strong>
            </li>
            <li className="text-left">
              Pasajeros: <strong>{reservation.passengersCount}</strong>
            </li>
          </ul>
          <Divider />
          <ul className="secondary-info">
            <li className="justify-between">
              <div>Conductor:</div>
              <div>
                <strong>
                  {reservation.driver.firstName} {reservation.driver.lastName}
                </strong>
              </div>
            </li>
            <li className="justify-between">
              <div>Tipo vehículo:</div>
              <div>
                <strong>{reservation.carType}</strong>
              </div>
            </li>
            <li className="justify-between">
              <div>Placa:</div>
              <div>
                <strong>{reservation.driver.car.plate}</strong>
              </div>
            </li>
            <li className="justify-between">
              <div>Compañia:</div>
              <div>
                <strong>{companyName(reservation.driver.companyId)}</strong>
              </div>
            </li>
          </ul>
          <Divider />
          <ul className="secondary-info">
            <li className="justify-between">
              <div>Distrito:</div>
              <div>
                <strong>{reservation.district.name}</strong>
              </div>
            </li>
          </ul>
          <Divider />
          <ul className="secondary-info">
            <li className="justify-between">
              <div>Método de pago:</div>
              <div>
                <strong>{reservation.paymentInfo.paymentType}</strong>
              </div>
            </li>
          </ul>
          <Divider />
          <ul className="secondary-info">
            <li className="justify-between">
              <div>Total:</div>
              <div>
                <h4>
                  <strong>{reservation.paymentInfo.totalPrice} S/</strong>
                </h4>
              </div>
            </li>
          </ul>
        </div>
      </Container>
    </PDF>
  );
};

const Container = styled.div`
  display: block;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  overflow: auto;
  background: #fff;

  width: 80mm; /* Define el ancho deseado para el voucher */
  min-height: 100vh;
  height: auto;
  margin: 0 auto; /* Centra el contenido en la página */
  padding: 1rem;
  font-size: 14px;

  .center {
    text-align: center;
  }

  .flex {
    display: flex;
  }

  .justify-start {
    display: flex;
    justify-content: start;
  }

  .justify-end {
    display: flex;
    justify-content: end;
  }

  .justify-between {
    display: flex;
    justify-content: space-between;
  }

  .text-center {
    text-align: center;
  }

  .text-left {
    text-align: left;
  }

  .text-right {
    text-align: right;
  }

  ul {
    list-style: none;
    padding: 0;
    margin-bottom: 1em;

    li {
      font-size: 1em;
    }
  }

  .ant-divider-horizontal {
    margin: 10px 0;
  }

  .ant-divider {
    border-top: 1px solid rgb(0 0 0 / 34%);
  }

  .logo-wrapper {
    display: flex;
    justify-content: center;

    img {
      width: 7em;
      height: auto;
      object-fit: contain;
      margin: auto;
    }
  }

  .title {
    font-size: 1.1em;
  }

  .sub-title {
    font-size: 1em;
    line-height: 1.5em;
    margin-bottom: 1.7em;
  }

  .passengers-wrapper {
    .secondary-info {
      margin-top: 1em;
    }
  }

  @media print {
    width: 80mm; /* Define el ancho deseado para el voucher */
    margin: 0 auto; /* Centra el contenido en la página */
    font-size: 12pt; /* Define el tamaño de fuente deseado */
  }
`;
