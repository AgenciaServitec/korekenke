import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  DateRange,
  Form,
  notification,
  Row,
  TextArea,
  Title,
} from "../../../../components";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router";
import {
  fetchHoliday,
  fetchHolidaysByUserId,
  updateHoliday,
} from "../../../../firebase/collections/holidays";
import { DATE_FORMAT_TO_FIRESTORE } from "../../../../firebase/firestore";
import { useDefaultFirestoreProps, useFormUtils } from "../../../../hooks";

export const EditHolidayIntegration = ({ user }) => {
  const { holidayRequestId } = useParams();
  const { assignUpdateProps } = useDefaultFirestoreProps();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [holidayRequest, setHolidayRequest] = useState(null);

  const onGoBack = () => navigate(-1);

  useEffect(() => {
    (async () => {
      const holidayRequest = await fetchHoliday(holidayRequestId);

      if (!holidayRequest) return onGoBack();

      setHolidayRequest(holidayRequest);
    })();
  }, [holidayRequestId]);

  const onSaveRequest = async (formData) => {
    try {
      setLoading(true);
      const updatedData = {
        ...holidayRequest,
        startDate: dayjs(formData.dateRange[0].toDate()).format(
          DATE_FORMAT_TO_FIRESTORE,
        ),
        endDate: dayjs(formData.dateRange[1].toDate()).format(
          DATE_FORMAT_TO_FIRESTORE,
        ),
        reason: formData.reason,
      };

      await updateHoliday(holidayRequest.id, assignUpdateProps(updatedData));
      notification({
        type: "success",
      });
      onGoBack();
    } catch (e) {
      console.error("errorUpdateHolidayRequest:", e);
      notification({
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <EditHoliday
      user={user}
      holidayRequest={holidayRequest}
      onGoBack={onGoBack}
      onSaveRequest={onSaveRequest}
      loading={loading}
    />
  );
};

const EditHoliday = ({
  holidayRequest,
  onGoBack,
  onSaveRequest,
  loading,
  user,
}) => {
  const schema = yup.object().shape({
    dateRange: yup.mixed().required(),
    reason: yup.string().required(),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { required, error } = useFormUtils({ errors, schema });

  useEffect(() => {
    reset({
      dateRange: [
        dayjs(holidayRequest?.startDate, DATE_FORMAT_TO_FIRESTORE),
        dayjs(holidayRequest?.endDate, DATE_FORMAT_TO_FIRESTORE),
      ],
      reason: holidayRequest?.reason || "",
    });
  }, [holidayRequest]);

  const disabledDate = (current) => {
    return current && current < dayjs().endOf("day");
  };

  const validateDateRange = (request) => {
    return Math.abs(request) > 30;
  };

  const validateHolidaysRules = (holidaysOfUser = []) => {
    const countSelectedDateRange = watch("dateRange");
    const [start, end] = countSelectedDateRange;
    const lengthCountSelectedDateRange =
      dayjs(end).diff(dayjs(start), "day") + 1;

    const lengthDays =
      holidaysOfUser
        .map(
          (holiday) =>
            dayjs(holiday.endDate, DATE_FORMAT_TO_FIRESTORE).diff(
              dayjs(holiday.startDate, DATE_FORMAT_TO_FIRESTORE),
              "day",
            ) + 1,
        )
        .reduce((a, b) => a + b, 0) + lengthCountSelectedDateRange;
    return lengthDays > 30;
  };

  const onSubmit = async (formData) => {
    const [start, end] = formData.dateRange;

    try {
      const validationResult = validateHolidaysRules(
        await fetchHolidaysByUserId(user.id),
      );
      if (validationResult) {
        notification({
          type: "warning",
          title: "Límite de días alcanzado!",
          description:
            "No se pueden seleccionar estas fechas, ya que alcanzan o superan el límite de 30 días calendario.",
        });
        return;
      }

      if (dayjs(start).day() === 1) {
        formData.dateRange[0] = dayjs(start.toDate()).subtract(1, "day");
      }

      if (dayjs(end).day() === 5) {
        formData.dateRange[1] = dayjs(end.toDate()).add(1, "day");
      }

      if (
        validateDateRange(
          formData.dateRange[0].diff(formData.dateRange[1], "day"),
        )
      )
        return notification({
          type: "warning",
          title: "¡No puedes superar los 30 días!",
        });

      onSaveRequest(formData);
    } catch (e) {
      console.log("Error: ", e);
    }
  };

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Title level={3}>Editar solicitud</Title>
      </Col>
      <Col span={24}>
        <Form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Controller
                name="dateRange"
                control={control}
                render={({ field: { onChange, value, name } }) => (
                  <DateRange
                    name={name}
                    value={value}
                    style={{ width: "100%", height: "100%" }}
                    disabledDate={disabledDate}
                    onChange={onChange}
                    error={error(name)}
                    required={required(name)}
                  />
                )}
              />
            </Col>
            <Col span={24}>
              <Controller
                name="reason"
                control={control}
                render={({ field: { onChange, value, name } }) => (
                  <TextArea
                    label="Motivo y/o Asunto"
                    rows={5}
                    name={name}
                    value={value}
                    onChange={onChange}
                    error={errors.reason}
                    helperText={errors.reason?.message}
                  />
                )}
              />
            </Col>
          </Row>
          <Row justify="end" gutter={[16, 16]}>
            <Col span={24} sm={8}>
              <Button
                type="default"
                size="large"
                block
                onClick={onGoBack}
                disabled={loading}
              >
                Cancelar
              </Button>
            </Col>
            <Col span={24} sm={8}>
              <Button
                type="primary"
                size="large"
                block
                htmlType="submit"
                loading={loading}
                disabled={loading}
              >
                Guardar
              </Button>
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  );
};
