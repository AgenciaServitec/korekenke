import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useHistory } from "react-router";
import * as yup from "yup";
import { useFormUtils } from "../../../hooks";
import {
  Button,
  Divider,
  Form,
  Input,
  notification,
  Select,
  SelectOption,
  Wrapper,
} from "../../../components/ui";
import { yupResolver } from "@hookform/resolvers/yup";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import { useGlobalData } from "../../../providers";
import { capitalize, isEmpty, toString } from "lodash";
import { carTypes } from "../../../data-list";
import { CarType, PaymentType, ReservationsApi } from "../../../openapi";
import { useOpenApi } from "../../../api";

interface FormData {
  passengersCount: number;
  firstName: string;
  lastName: string;
  districtId: string;
  address: string;
  carType: CarType;
  driverId: string;
  email: string;
  paymentType: PaymentType;
}

export const ReservationIntegration = (): JSX.Element => {
  const history = useHistory();

  const { drivers, districts } = useGlobalData();

  const {
    run: postReservation,
    loading,
    error,
  } = useOpenApi(ReservationsApi, "postReservation");

  useEffect(() => {
    error && notification({ type: "error" });
  }, [error]);

  const onNavigateTo = (pathname: string): void => history.push(pathname);

  const onSaveReservation = async (formData: FormData): Promise<void> => {
    await postReservation({
      reservationPayLoad: {
        passengersCount: +formData.passengersCount,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        districtId: formData.districtId,
        carType: formData.carType,
        paymentType: formData.paymentType,
      },
    });

    onNavigateTo("/reservations");
    notification({ type: "success" });
  };

  return (
    <Reservation
      drivers={drivers}
      districts={districts}
      isSavingReservation={loading}
      onSaveReservation={onSaveReservation}
      onCancel={() => history.goBack()}
    />
  );
};

interface ReservationProps {
  drivers: Driver[];
  districts: District[];
  onSaveReservation: (formData: FormData) => Promise<void>;
  isSavingReservation: boolean;
  onCancel: () => void;
}

const Reservation = ({
  drivers,
  districts,
  isSavingReservation,
  onSaveReservation,
  onCancel,
}: ReservationProps) => {
  const schema = yup.object({
    passengersCount: yup.number().min(1).required(),
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    districtId: yup.string().required(),
    carType: yup.string().required(),
    email: yup.string().email().required(),
    paymentType: yup.string().required(),
  });

  const {
    formState: { errors },
    handleSubmit,
    control,
    watch,
  } = useForm<FormData>({
    resolver: yupResolver<yup.AnyObjectSchema>(schema),
  });

  const { required, error, errorMessage } = useFormUtils({ errors, schema });

  const { carType, districtId } = watch();

  const findDistrict = (districtId: string) =>
    districts.find((district) => district.id === districtId);

  const totalPrice =
    carType && districtId
      ? findDistrict(districtId)?.price[carType].toFixed(2)
      : 0;

  const existsAvailableDrivers = drivers
    .filter((driver) => driver.status === "available")
    .filter((driver) => driver.car.type === carType);

  const onSubmitReservation = (formData: FormData): Promise<void> =>
    onSaveReservation(formData);

  return (
    <Form onSubmit={handleSubmit(onSubmitReservation)}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={18}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Controller
                name="carType"
                control={control}
                render={({ field: { onChange, value, name } }) => (
                  <Select
                    label="Tipo de vehículo"
                    value={value}
                    onChange={onChange}
                    error={error(name)}
                    helperText={errorMessage(name)}
                    required={required(name)}
                  >
                    {carTypes.map((carType) => (
                      <SelectOption
                        key={`carType-${carType.id}`}
                        value={carType.id}
                      >
                        {carType.name}
                      </SelectOption>
                    ))}
                  </Select>
                )}
              />
            </Col>
            <Col span={24}>
              <Controller
                name="districtId"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, name } }) => (
                  <Select
                    label="Distrito"
                    value={value}
                    onChange={onChange}
                    error={error(name)}
                    helperText={errorMessage(name)}
                    required={required(name)}
                  >
                    {districts.map((district) => (
                      <SelectOption
                        key={`district-${district.id}`}
                        value={district.id}
                      >
                        {district.name}
                      </SelectOption>
                    ))}
                  </Select>
                )}
              />
            </Col>
          </Row>
        </Col>
        <Col xs={24} sm={24} md={6}>
          <Wrapper>
            <>
              <h5>PRECIO TOTAL:</h5>
              {<h2>S/ {totalPrice || 0}</h2>}
            </>
          </Wrapper>
        </Col>
      </Row>
      <Divider />
      {carType && isEmpty(existsAvailableDrivers) ? (
        <h2>No hay conductores disponibles</h2>
      ) : !districtId || !carType ? (
        <></>
      ) : (
        <>
          <Controller
            name="passengersCount"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <Select
                label="Número de pasajeros"
                value={toString(value)}
                onChange={onChange}
                error={error(name)}
                helperText={errorMessage(name)}
                required={required(name)}
              >
                {Array.from({ length: 10 }, (x, i) => i + 1).map((number) => (
                  <SelectOption key={number} index={number}>
                    {number}
                  </SelectOption>
                ))}
              </Select>
            )}
          />
          <Controller
            name="firstName"
            control={control}
            defaultValue=""
            render={({ field: { onChange, value, name } }) => (
              <Input
                label="Nombres"
                name={name}
                value={value}
                onChange={onChange}
                error={error(name)}
                helperText={errorMessage(name)}
                required={required(name)}
              />
            )}
          />
          <Controller
            name="lastName"
            control={control}
            defaultValue=""
            render={({ field: { onChange, value, name } }) => (
              <Input
                label="Apellidos"
                name={name}
                value={value}
                onChange={onChange}
                error={error(name)}
                helperText={errorMessage(name)}
                required={required(name)}
              />
            )}
          />
          <Controller
            name="email"
            defaultValue=""
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <Input
                label="Email"
                name={name}
                value={value}
                onChange={onChange}
                error={error(name)}
                helperText={errorMessage(name)}
                required={required(name)}
              />
            )}
          />
          <Controller
            name="paymentType"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <Select
                label="Tipo de pago"
                value={value}
                onChange={onChange}
                error={error(name)}
                helperText={errorMessage(name)}
                required={required(name)}
              >
                {[
                  { label: "Efectivo", value: "cash" },
                  { label: "Tarjeta", value: "card" },
                ].map((paymentType, index) => (
                  <SelectOption
                    key={`paymentType-${index}`}
                    value={paymentType.value}
                  >
                    {capitalize(paymentType.label)}
                  </SelectOption>
                ))}
              </Select>
            )}
          />
          <Row justify="end" gutter={[16, 16]}>
            <Col xs={24} sm={12} md={4}>
              <Button
                block
                size="large"
                onClick={() => onCancel()}
                disabled={isSavingReservation}
              >
                Cancelar
              </Button>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Button
                block
                htmlType="submit"
                type="primary"
                size="large"
                disabled={isSavingReservation}
                loading={isSavingReservation}
              >
                Guardar
              </Button>
            </Col>
          </Row>
        </>
      )}
    </Form>
  );
};
