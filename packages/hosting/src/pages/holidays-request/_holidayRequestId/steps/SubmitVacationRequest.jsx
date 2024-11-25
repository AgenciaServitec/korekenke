import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  notification,
  Row,
  TextArea,
  Title,
} from "../../../../components";
import { Controller, useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import {
  addHoliday,
  fetchHolidaysByUserId,
  updateHoliday,
} from "../../../../firebase/collections/holidays";
import { omit } from "lodash";
import dayjs from "dayjs";
import { DATE_FORMAT_TO_FIRESTORE } from "../../../../firebase/firestore";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDefaultFirestoreProps, useFormUtils } from "../../../../hooks";

export const SubmitVacationRequest = ({
  isNew,
  user,
  holidaysRange,
  holidayRequest,
  onNavigateGoTo,
  onSetCurrentStep,
}) => {
  const { assignCreateProps } = useDefaultFirestoreProps();

  const [loading, setLoading] = useState(false);

  const schema = yup.object({
    reason: yup.string(),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(schema) });

  const { required, error, errorMessage } = useFormUtils({ errors, schema });

  const validateHolidaysLimitYear = async () => {
    const holidays = await fetchHolidaysByUserId(user.id);

    const lengthDays = holidays.map(
      (holiday) =>
        dayjs(holiday.endDate, DATE_FORMAT_TO_FIRESTORE).diff(
          dayjs(holiday.startDate, DATE_FORMAT_TO_FIRESTORE),
          "day",
        ) + 1,
    );

    return lengthDays.reduce((a, b) => a + b, 0);
  };

  const mapForm = (formData) => ({
    ...holidayRequest,
    user: omit(user, "acls"),
    startDate: dayjs(holidaysRange[0].toDate()).format(
      DATE_FORMAT_TO_FIRESTORE,
    ),
    endDate: dayjs(holidaysRange[1].toDate()).format(DATE_FORMAT_TO_FIRESTORE),
    reason: formData.reason,
    status: "pending",
  });

  useEffect(() => {
    reset({
      reason: holidayRequest?.reason || "",
    });
  }, [holidayRequest]);

  const onSubmit = async (formData) => {
    try {
      setLoading(true);

      const holidayData = mapForm(formData);

      await validateHolidaysLimitYear();

      isNew
        ? await addHoliday(assignCreateProps(holidayData))
        : await updateHoliday(holidayRequest.id, holidayData);

      notification({
        type: "success",
      });

      onNavigateGoTo("/holidays-request");
    } catch (e) {
      console.log("Error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Title level={3}>Motivo y/o Asunto</Title>
      </Col>
      <Form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Controller
              name="reason"
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <TextArea
                  label="Ingrese el motivo por el cual solicita sus vacaciones:"
                  rows={7}
                  name={name}
                  value={value}
                  onChange={onChange}
                  error={error(name)}
                  helperText={errorMessage(name)}
                  required={required(name)}
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
              onClick={() => onSetCurrentStep(0)}
            >
              Atras
            </Button>
          </Col>
          <Col span={24} sm={8}>
            <Button
              htmlType="submit"
              type="primary"
              size="large"
              loading={loading}
              disabled={loading}
              block
            >
              <FontAwesomeIcon icon={faPaperPlane} />
              ENVIAR SOLICITUD
            </Button>
          </Col>
        </Row>
      </Form>
    </Row>
  );
};
