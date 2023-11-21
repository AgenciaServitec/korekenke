import React, { memo } from "react";
import styled, { css } from "styled-components";
import moment from "moment";
import {
  CarInfo,
  IconAction,
  TableVirtualized,
  TableVirtualizedColumnProps,
  Tag,
} from "../../components/ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faCircleInfo,
  faPrint,
  faSpinner,
  faTrash,
} from "@fortawesome/pro-solid-svg-icons";
import { capitalize } from "lodash";

export interface ReservationsTableProps {
  reservations: Reservation[];
  drivers: Driver[];
  companies: Company[];
  onClickDeleteReservation: (reservationId: string) => void;
  onClickPrintTicket: (reservationId: string) => void;
}

const ReservationsTable = ({
  reservations,
  drivers,
  companies,
  onClickDeleteReservation,
  onClickPrintTicket,
}: ReservationsTableProps): JSX.Element => {
  const companyName = (driverId: string) => {
    const driver = drivers.find((driver) => driver.id === driverId);

    return (
      companies.find((company) => company.id === driver?.companyId)?.name || ""
    );
  };

  const driverFullName = (driverId: string) => {
    const driver = drivers.find((driver) => driver.id === driverId);

    return driver?.firstName + " " + driver?.lastName;
  };

  const car = (driverId: string) => {
    const driver = drivers.find((driver) => driver.id === driverId);

    return driver?.car;
  };

  const columns: TableVirtualizedColumnProps<Reservation>[] = [
    {
      title: "Reserva",
      width: ["97px", "10%"],
      render: (reservation) => (
        <ReservationContainer>
          <span>
            {moment(reservation.createAt.toDate()).format("DD/MM/YYYY")}
          </span>
          <span>{moment(reservation.createAt.toDate()).format("h:mm a")}</span>
          <br />
          <span>{reservationStatus(reservation)}</span>
        </ReservationContainer>
      ),
    },
    {
      title: "Vehículo",
      align: "center",
      width: ["130px", "15%"],
      render: (reservation) => (
        <div>
          {reservation?.driver && (
            <div style={{ display: "grid", gap: ".1em" }}>
              <CarInfo
                car={car(reservation.driver.id)}
                carType={reservation.carType}
              />
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Conductor",
      align: "center",
      width: ["130px", "15%"],
      render: (reservation) => (
        <div>
          {reservation?.driver && (
            <>
              <div>
                <strong>{driverFullName(reservation?.driver.id)}</strong>
              </div>
              <div>{companyName(reservation?.driver.id)}</div>
              <div>
                {reservation.status === "pending" && (
                  <span>
                    <FontAwesomeIcon icon={faSpinner} spinPulse size="lg" />
                    <br />
                    <span style={{ color: "#f4a12f" }}>
                      Buscando conductor...
                    </span>
                  </span>
                )}
              </div>
            </>
          )}
          {!reservation?.driver && (
            <div style={{ color: "red" }}>
              <strong>No hay conductores disponibles</strong>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Distrito",
      align: "center",
      width: ["130px", "10%"],
      render: (reservation) => <div>{reservation.district.name}</div>,
    },
    {
      title: "Cliente",
      align: "center",
      width: ["130px", "25%"],
      render: (reservation) => (
        <div>
          <div>
            <strong>
              {reservation.firstName} {reservation.lastName}
            </strong>
          </div>
          <div>{reservation.email}</div>
        </div>
      ),
    },
    {
      title: "Información de pago",
      align: "center",
      width: ["130px", "15%"],
      render: (reservation) => (
        <div>
          {reservation?.paymentInfo && (
            <>
              <div>
                <Tag color="blue">
                  <strong>
                    {capitalize(reservation.paymentInfo.paymentType)}
                  </strong>
                </Tag>
              </div>
              <div>
                Total: <strong>S/ {reservation.paymentInfo.totalPrice}</strong>
              </div>
            </>
          )}
        </div>
      ),
    },
    {
      title: "⚙️",
      width: ["70px", "15%"],
      render: (reservation) => (
        <IconsActionWrapper>
          <IconAction
            className="pointer"
            onClick={() => onClickDeleteReservation(reservation.id)}
            styled={{ color: (theme) => theme.colors.error }}
            icon={faTrash}
          />
          {reservation.status === "accepted" && (
            <IconAction
              className="pointer"
              onClick={() => onClickPrintTicket(reservation.id)}
              styled={{ color: (theme) => theme.colors.info }}
              icon={faPrint}
            />
          )}
        </IconsActionWrapper>
      ),
    },
  ];

  return (
    <TableVirtualized
      dataSource={reservations}
      columns={columns}
      rowHeaderHeight={50}
      rowBodyHeight={150}
    />
  );
};

export default memo(ReservationsTable);

const reservationStatus = (reservation: Reservation): JSX.Element => {
  switch (reservation.status) {
    case "pending":
      return (
        <Tag color="processing" style={{ margin: 0 }}>
          <FontAwesomeIcon icon={faCircleInfo} /> Pendiente
        </Tag>
      );
    case "accepted":
      return (
        <Tag color="success" style={{ margin: 0 }}>
          <FontAwesomeIcon icon={faCheckCircle} /> Aceptado
        </Tag>
      );
  }
};

const ReservationContainer = styled.div`
  ${({ theme }) => css`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    .purchase-number {
      margin-top: ${theme.paddings.small};
      font-size: ${theme.font_sizes.xx_small};
      font-weight: ${theme.font_weight.medium};
    }
  `}
`;

const IconsActionWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
`;
