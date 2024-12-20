import React, { useState } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  notification,
  Row,
  TextArea,
  Title,
} from "../../../../components";
import { Controller, useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { addHoliday } from "../../../../firebase/collections/holidays";
import { isEmpty, omit } from "lodash";
import dayjs from "dayjs";
import { DATE_FORMAT_TO_FIRESTORE } from "../../../../firebase/firestore";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDefaultFirestoreProps, useFormUtils } from "../../../../hooks";
import { updateUser } from "../../../../firebase/collections";

export const SendHolidayRequest = ({
  user,
  holidaysByUser,
  holidaysRange,
  holidayRequest,
  onNavigateGoTo,
  onSetCurrentStep,
  holidayDays,
}) => {
  const { assignCreateProps } = useDefaultFirestoreProps();

  const [loading, setLoading] = useState(false);

  const [startDate, endDate] = holidaysRange;

  const oldHolidaysByUser = holidaysByUser.map((holiday) => ({
    start: dayjs(holiday.startDate, DATE_FORMAT_TO_FIRESTORE),
    end: dayjs(holiday.endDate, DATE_FORMAT_TO_FIRESTORE),
  }));

  const schema = yup.object({
    gu: yup.string().required(),
    uu: yup.string().required(),
    reason: yup.string(),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const { required, error, errorMessage } = useFormUtils({ errors, schema });

  const oldHolidaysRequest = (_oldHolidaysByUser) => {
    let workDays = [1, 2, 3, 4, 5];
    let oldWorkingDays = 0;
    let oldSaturdays = 0;
    let oldSundays = 0;
    let totalDays = 0;

    if (!isEmpty(_oldHolidaysByUser)) {
      _oldHolidaysByUser.map(({ start, end }) => {
        while (start.isSameOrBefore(end)) {
          const numberDayStart = start.day();
          if (workDays.includes(numberDayStart)) {
            oldWorkingDays++;
          }
          if (numberDayStart === 0) {
            oldSundays++;
          }
          if (numberDayStart === 6) {
            oldSaturdays++;
          }
          start = start.add(1, "day");
          totalDays = oldWorkingDays + oldSaturdays + oldSundays;
        }
        return {
          oldWorkingDays,
          oldSaturdays,
          oldSundays,
          totalDays,
        };
      });
    }
    return {
      oldWorkingDays,
      oldSaturdays,
      oldSundays,
      totalDays,
    };
  };

  const weekDays = (startDate, endDate) => {
    const workDays = [1, 2, 3, 4, 5];

    let workingDays = 0;
    let saturdays = 0;
    let sundays = 0;
    let totalDays = 0;

    while (dayjs(startDate).isSameOrBefore(dayjs(endDate))) {
      const dayOfStartDate = startDate.day();

      if (workDays.includes(dayOfStartDate)) {
        workingDays++;
      }
      if (dayOfStartDate === 6) {
        saturdays++;
      }
      if (dayOfStartDate === 0) {
        sundays++;
      }
      startDate = startDate.add(1, "day");
      totalDays = workingDays + saturdays + sundays;
    }

    return {
      workingDays,
      saturdays,
      sundays,
      totalDays,
    };
  };

  const _user = {
    ...user,
    holidaysDetail: {
      current: {
        ...weekDays(startDate, endDate),
      },
      old: {
        ...oldHolidaysRequest(oldHolidaysByUser),
      },
    },
    holidayDays: holidayDays || 0,
  };

  const mapForm = (formData) => ({
    ...holidayRequest,
    user: omit(_user, "acls"),
    startDate: dayjs(holidaysRange[0].toDate()).format(
      DATE_FORMAT_TO_FIRESTORE,
    ),
    endDate: dayjs(holidaysRange[1].toDate()).format(DATE_FORMAT_TO_FIRESTORE),
    gu: formData.gu,
    uu: formData.uu,
    reason: formData.reason,
    status: "waiting",
    wasRead: false,
  });

  const onSubmit = async (formData) => {
    try {
      setLoading(true);

      const holidayData = mapForm(formData);
      await addHoliday(assignCreateProps(holidayData));

      await updateUser(user.id, {
        ...user,
        holidayDays: holidayDays || 0,
      });

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
      <Form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
        <Col span={24}>
          <Title level={3}>Unidades Asignadas</Title>
        </Col>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Controller
              name="gu"
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <Input
                  label="Ingrese su Gran Unidad (GU):"
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
          <Col span={12}>
            <Controller
              name="uu"
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <Input
                  label="Ingrese la Unidad a la que pertenece (UU):"
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
        <Col span={24}>
          <Title level={3}>Motivo y/o Asunto</Title>
        </Col>
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
