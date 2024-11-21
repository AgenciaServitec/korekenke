import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import {
  Button,
  Col,
  DateRange,
  Form,
  FullCalendarComponent,
  notification,
  Row,
  TextArea,
  Title,
} from "../../../components";
import {
  faMagnifyingGlass,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDefaultFirestoreProps, useFormUtils } from "../../../hooks";
import styled from "styled-components";
import { Space } from "antd";
import { useNavigate, useParams } from "react-router";
import {
  addHoliday,
  fetchHoliday,
  fetchHolidaysByUserId,
  getHolidaysId,
  updateHoliday,
} from "../../../firebase/collections/holidays";
import { omit } from "lodash";
import { DATE_FORMAT_TO_FIRESTORE } from "../../../firebase/firestore";

const FORMAT_DATE_FULLCALENDAR = "YYYY-MM-DD";

export const SearchHolidays = ({ user }) => {
  const navigate = useNavigate();
  const { holidayRequestId } = useParams();
  const { assignCreateProps } = useDefaultFirestoreProps();

  const [holidayRequest, setHolidayRequest] = useState(null);
  const [holidaysRangeData, setHolidaysRangeData] = useState([
    dayjs(),
    dayjs(),
  ]);
  const [loading, setLoading] = useState(false);

  const isNew = holidayRequestId === "new";

  useEffect(() => {
    (async () => {
      if (!isNew) {
        const _holidayRequest = await fetchHoliday(holidayRequestId);
        setHolidayRequest(_holidayRequest);
        setHolidaysRangeData([
          dayjs(_holidayRequest.startDate, DATE_FORMAT_TO_FIRESTORE),
          dayjs(_holidayRequest.endDate, DATE_FORMAT_TO_FIRESTORE),
        ]);

        return;
      }

      const _holidayRequest = { id: getHolidaysId() };
      setHolidaysRangeData([dayjs(), dayjs()]);
      setHolidayRequest(_holidayRequest);
    })();
  }, [isNew]);

  const disabledDate = (current) => {
    return current && current < dayjs().endOf("day");
  };

  const validateDateRange = (request) => {
    return Math.abs(request) > 30;
  };

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

  const schema = yup.object({
    dateRange: yup.mixed().required(),
    reason: yup.string(),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(schema) });

  const { required, error, errorMessage } = useFormUtils({ errors, schema });

  useEffect(() => {
    reset({
      dateRange:
        holidayRequest?.startDate && holidayRequest?.endDate
          ? [
              dayjs(holidayRequest?.startDate, DATE_FORMAT_TO_FIRESTORE),
              dayjs(holidayRequest?.endDate, DATE_FORMAT_TO_FIRESTORE),
            ]
          : [dayjs(), dayjs()],
      reason: holidayRequest?.reason || "",
    });
  }, [holidayRequest]);

  const onSubmitDateRange = (formData) => {
    const [start, end] = formData.dateRange;

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
    ) {
      return notification({
        type: "warning",
        title: "¡No puedes superar los 30 días!",
      });
    } else {
      setHolidaysRangeData(formData.dateRange);
    }
  };

  const mapForm = (formData) => ({
    ...holidayRequest,
    user: omit(user, "acls"),
    startDate: dayjs(formData.dateRange[0].toDate()).format(
      DATE_FORMAT_TO_FIRESTORE,
    ),
    endDate: dayjs(formData.dateRange[1].toDate()).format(
      DATE_FORMAT_TO_FIRESTORE,
    ),
    reason: formData.reason,
    status: "pending",
  });

  const onSubmit = async (formData) => {
    try {
      setLoading(true);

      const holidayData = mapForm(formData);

      await validateHolidaysLimitYear();

      isNew
        ? await addHoliday(assignCreateProps(holidayData))
        : await updateHoliday(holidayRequestId, holidayData);

      notification({
        type: "success",
      });

      navigate("/holidays-request");
    } catch (e) {
      console.log("Error:", e);
    } finally {
      setLoading(false);
    }
  };

  const dateRangeRules = () => {
    const [startDate, endDate] = holidaysRangeData;

    return {
      startDate: dayjs(startDate.toDate()).format(FORMAT_DATE_FULLCALENDAR),
      endDate: dayjs(endDate.toDate())
        .add(1, "day")
        .format(FORMAT_DATE_FULLCALENDAR),
    };
  };

  return (
    <Container>
      <Space size={15} direction="vertical" style={{ width: "100%" }}>
        <Row gutter={[16, 16]}>
          <Form onSubmit={handleSubmit(onSubmitDateRange)}>
            <Row gutter={[16, 16]} style={{ width: "100%" }}>
              <Col span={12}>
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
                      helperText={errorMessage(name)}
                      required={required(name)}
                    />
                  )}
                />
              </Col>
              <Col span={12}>
                <Button
                  htmlType="submit"
                  color="success"
                  variant="solid"
                  size="large"
                  style={{ width: "100%" }}
                >
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                  BUSCAR
                </Button>
              </Col>
            </Row>
          </Form>
        </Row>
        <Row gutter={[16, 16]} justify="center">
          <Col xs={24} sm={24} md={12} lg={12}>
            <FullCalendarComponent
              startDate={dateRangeRules().startDate}
              endDate={dateRangeRules().endDate}
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={12}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Title level={2}>Motivo y/o Asunto</Title>
              </Col>
              <Col span={24}>
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Controller
                    name="reason"
                    control={control}
                    render={({ field: { onChange, value, name } }) => (
                      <TextArea
                        label="Ingrese el motivo por el cual solicita sus vacaciones:"
                        name={name}
                        value={value}
                        onChange={onChange}
                        error={error(name)}
                        helperText={errorMessage(name)}
                        required={required(name)}
                      />
                    )}
                  />
                  <Button
                    htmlType="submit"
                    color="success"
                    variant="solid"
                    size="large"
                    loading={loading}
                    disabled={loading}
                  >
                    <FontAwesomeIcon icon={faPaperPlane} />
                    ENVIAR
                  </Button>
                </Form>
              </Col>
            </Row>
          </Col>
        </Row>
      </Space>
    </Container>
  );
};

const Container = styled.div`
  margin: 1.5em 0;
  width: 100%;
  max-width: 100%;
  height: auto;

  .fc {
    text-transform: uppercase;

    .fc-toolbar {
      flex-wrap: wrap;
    }

    .fc-daygrid-event {
      font-size: 0.8em;
      padding: 2px;
    }
  }

  @media (max-width: 768px) {
    .fc {
      font-size: 0.75em;
    }
  }
`;
