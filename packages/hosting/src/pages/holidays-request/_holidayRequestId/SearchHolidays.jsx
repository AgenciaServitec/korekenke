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
  getHolidaysId,
  addHoliday,
  updateHoliday,
  fetchHoliday,
} from "../../../firebase/collections/holidays";

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
        try {
          const fetchedHolidayRequest = await fetchHoliday(holidayRequestId);
          setHolidayRequest(fetchedHolidayRequest);
          setHolidaysRangeData([
            dayjs(fetchedHolidayRequest.startDate),
            dayjs(fetchedHolidayRequest.endDate),
          ]);
        } catch (e) {
          console.error("Error fetching holiday request:", e);
        }
      } else {
        const _holidayRequest = { id: getHolidaysId() };
        setHolidayRequest(_holidayRequest);
      }
    })();
  }, [holidayRequestId]);

  const { acls, createdAt, updateAt, updateBy, role, ...newUser } = user;

  const disabledDate = (current) => {
    return current && current < dayjs().endOf("day");
  };

  const validateDateRange = (request) => {
    return Math.abs(request) > 30;
  };

  const schema = yup.object({
    dateRange: yup.mixed().required(),
    reason: yup.string(),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const { required, error, errorMessage } = useFormUtils({ errors, schema });

  const onSubmitDateRange = (formData) => {
    const [start, end] = formData.dateRange;
    if (start.$W === 1) {
      formData.dateRange[0] = dayjs(start.toDate()).subtract(1, "day");
    }

    if (end.$W === 5) {
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
    user: newUser,
    startDate: dayjs(formData.dateRange[0].toDate()).format(
      FORMAT_DATE_FULLCALENDAR,
    ),
    endDate: dayjs(formData.dateRange[1].toDate()).format(
      FORMAT_DATE_FULLCALENDAR,
    ),
    reason: formData.reason,
    status: "pending",
  });

  const onSubmit = async (formData) => {
    try {
      setLoading(true);

      const holidayData = mapForm(formData);

      isNew
        ? await addHoliday(assignCreateProps(holidayData))
        : await updateHoliday(holidayRequestId, holidayData);

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
        <Row gutter={[16, 16]} justify="space-between">
          <Col span={12}>
            <FullCalendarComponent
              startDate={dateRangeRules().startDate}
              endDate={dateRangeRules().endDate}
            />
          </Col>
          <Col span={11}>
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

const Container = styled.div``;
