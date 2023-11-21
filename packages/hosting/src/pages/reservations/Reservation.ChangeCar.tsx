import {
  Button,
  Form,
  modalConfirm,
  notification,
  Row,
  Select,
  SelectOption,
} from "../../components/ui";
import React, { memo, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { carTypes } from "../../data-list";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFormUtils } from "../../hooks";
import Col from "antd/lib/col";
import assert from "assert";
import { orderBy } from "lodash";
import { sort } from "../../utils/drivers";
import { useNextCompanies } from "../../providers/NextCompaniesProvider";

interface FormData {
  carType: CarType;
  driverId: string;
}

export interface ReservationChangeCarProps {
  onChangeCar: (carType: CarType, driver: Driver) => void;
  onClose: () => void;
  reservation: Reservation;
  drivers: Driver[];
  companies: Company[];
}

const ReservationChangeCar = ({
  drivers,
  companies,
  onChangeCar,
  onClose,
  reservation,
}: ReservationChangeCarProps): JSX.Element => {
  const { nextCompanies } = useNextCompanies();

  const schema = yup.object({
    carType: yup.string().required(),
    driverId: yup.string().required(),
  });

  const {
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    control,
    watch,
  } = useForm<FormData>({
    resolver: yupResolver<yup.AnyObjectSchema>(schema),
  });

  const { required, error, errorMessage } = useFormUtils({ errors, schema });

  useEffect(() => {
    reservationToForm();
  }, [reservation]);

  const reservationToForm = () =>
    reset({
      carType: reservation.carType,
    });

  const changeCar = async (): Promise<void> =>
    handleSubmit(async (formData) => {
      try {
        const driver = drivers.find(
          (driver) => driver.id === formData.driverId
        );
        assert(driver, "Missing driver");

        await onChangeCar(formData.carType, driver);
      } catch (e) {
        notification({ type: "error" });
      }
    })();

  const onConfirm = () =>
    handleSubmit(() => {
      modalConfirm({
        title: "¿Estás seguro de que quieres cambiar de vehículo?",
        onOk: () => changeCar(),
      });
    })();

  const companyName = (companyId: string) =>
    companies.find((company) => company.id === companyId)?.name || "";

  const filteredDrivers = orderBy(
    drivers.filter((driver) => driver.status === "available"),
    (driver) => driver.availableAt,
    ["asc"]
  );

  const viewDrivers = sort(
    filteredDrivers.filter((driver) => watch("carType") === driver.car.type),
    nextCompanies
  );

  return (
    <Row justify="end" gutter={[20, 20]}>
      <Form onSubmit={handleSubmit(onConfirm)}>
        <Controller
          name="carType"
          control={control}
          defaultValue={undefined}
          render={({ field: { onChange, value, name } }) => (
            <Select
              label="Tipo de vehículo"
              value={value}
              onChange={(value) => {
                onChange(value);
                setValue("driverId", "");
              }}
              error={error(name)}
              helperText={errorMessage(name)}
              required={required(name)}
            >
              {carTypes.map((carType, index) => (
                <SelectOption key={`carType-${index}`} value={carType.id}>
                  {carType.name}
                </SelectOption>
              ))}
            </Select>
          )}
        />
        <Controller
          name="driverId"
          control={control}
          defaultValue=""
          render={({ field: { onChange, value, name } }) => (
            <Select
              label="Conductor"
              value={value}
              onChange={onChange}
              error={error(name)}
              helperText={errorMessage(name)}
              required={required(name)}
            >
              {viewDrivers.map((driver, index) => (
                <SelectOption key={`driver-${index}`} value={driver.id}>
                  {`${driver.firstName} ${driver.lastName} - ${companyName(
                    driver.companyId
                  )}`}
                </SelectOption>
              ))}
            </Select>
          )}
        />
        <Row justify="end" gutter={[16, 16]}>
          <Col xs={24} sm={6} md={6}>
            <Button block size="large" onClick={() => onClose()}>
              Cancelar
            </Button>
          </Col>
          <Col xs={24} sm={6} md={6}>
            <Button block htmlType="submit" type="primary" size="large">
              Guardar
            </Button>
          </Col>
        </Row>
      </Form>
    </Row>
  );
};

export default memo(ReservationChangeCar);
