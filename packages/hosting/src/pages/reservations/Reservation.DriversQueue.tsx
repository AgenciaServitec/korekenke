import {
  Button,
  CarInfo,
  Legend,
  List,
  modalConfirm,
  Row,
  Space,
} from "../../components/ui";
import React, { memo, useState } from "react";
import Col from "antd/lib/col";
import { capitalize, orderBy } from "lodash";
import { useInterval } from "../../hooks";
import moment from "moment";
import styled, { css } from "styled-components";
import { lighten } from "polished";

export interface ReservationDriversQueueProps {
  drivers: DriverView[];
  onDisconnectDriver: (driver: Driver) => Promise<void>;
}

export interface DriverView extends Driver {
  company: Company | null;
}

type CarType = "all" | "taxi" | "van";

const INTERVAL_SEC = 60;

const ReservationDriversQueue = ({
  drivers,
  onDisconnectDriver,
}: ReservationDriversQueueProps): JSX.Element => {
  const [, setCount] = useState<number>(0);
  const [carType, setCarType] = useState<CarType>("all");

  const connectionTime = (availableAt: Timestamp): string =>
    moment(availableAt.toDate()).fromNow(true);

  useInterval(() => {
    setCount((prevState) => prevState + 1);
  }, [INTERVAL_SEC]);

  const onSetFilters = (active: CarType) => setCarType(active);

  const driversView: DriverView[] = orderBy(
    drivers
      .filter((driver) => driver.status === "available")
      .filter((driver) =>
        carType === "all" ? true : driver.car.type === carType
      ),
    (driver) => driver.availableAt,
    ["asc"]
  );

  const onConfirmDisconnectDriver = (driver: Driver) =>
    modalConfirm({
      title: `¿Seguro que desea desconectar al conductor ${driver.firstName} ${driver.lastName}?`,
      onOk: () => onDisconnectDriver(driver),
    });

  return (
    <Row justify="end" gutter={[20, 20]}>
      <Col span={24}>
        <Legend title="Filtros">
          <Space>
            <Button
              type={carType === "all" ? "primary" : "default"}
              onClick={() => onSetFilters("all")}
            >
              Todos
            </Button>
            <Button
              type={carType === "taxi" ? "primary" : "default"}
              onClick={() => onSetFilters("taxi")}
            >
              Taxi
            </Button>
            <Button
              type={carType === "van" ? "primary" : "default"}
              onClick={() => onSetFilters("van")}
            >
              Van
            </Button>
          </Space>
        </Legend>
      </Col>
      <Col span={24}>
        <List
          dataSource={driversView}
          itemTitle={(driver) => (
            <WrapperItems justify="space-between">
              <div className="names-item">
                <h3 style={{ margin: "0" }}>
                  {capitalize(`${driver.firstName} ${driver.lastName}`)}
                </h3>
                {driver?.company && (
                  <span className="company-name">{driver.company.name}</span>
                )}
                <div className="available-at-item">
                  {connectionTime(driver.availableAt)}
                </div>
              </div>
              <div>
                <Button
                  danger
                  onClick={() => onConfirmDisconnectDriver(driver)}
                >
                  desconectar
                </Button>
              </div>
            </WrapperItems>
          )}
          itemDescription={(driver) => (
            <Row justify="start">
              <CarInfo
                car={driver.car}
                carType={driver.car.type}
                direction="row"
              />
            </Row>
          )}
        />
      </Col>
    </Row>
  );
};

export default memo(ReservationDriversQueue);

const WrapperItems = styled(Row)`
  ${({ theme }) => css`
    width: 100%;
    .names-item {
      font-weight: 600;
      margin-bottom: 0.3em;
      line-height: 1.3em;
      .company-name {
        font-size: 0.9em;
        font-weight: 600;
      }
      .available-at-item {
        font-size: 0.7em;
        color: ${lighten(0.2, theme.colors.dark)};
      }
    }
  `}
`;
