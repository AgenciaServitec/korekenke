import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import {
  Button,
  Col,
  DateRange,
  Form,
  notification,
  Row,
} from "../../../../components";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFormUtils } from "../../../../hooks";
import styled from "styled-components";
import { fetchHolidaysByUserId } from "../../../../firebase/collections/holidays";
import { DATE_FORMAT_TO_FIRESTORE } from "../../../../firebase/firestore";

export const SearchHolidays = ({
  holidaysByUser,
  holidaysRange,
  holidayRequest,
  onSetHolidaysRange,
  onSetHolidayDays,
}) => {
  const [loading, setLoading] = useState(false);

  const disabledDate = (current) => {
    return current && current < dayjs().endOf("day");
  };

  const validateDateRange = (countHolidays) => {
    return Math.abs(countHolidays) > 30;
  };

  const schema = yup.object({
    dateRange: yup.mixed().required(),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm({ resolver: yupResolver(schema) });

  const { required, error } = useFormUtils({ errors, schema });

  const validateHolidaysRules = (_start, _end) => {
    const holidaysSelected = dayjs(_end).diff(dayjs(_start), "day") + 1;
    const accumulatedOldHolidays =
      holidaysByUser
        .map(
          (holiday) =>
            dayjs(holiday?.endDate, DATE_FORMAT_TO_FIRESTORE).diff(
              dayjs(holiday?.startDate, DATE_FORMAT_TO_FIRESTORE),
              "day",
            ) + 1,
        )
        .reduce((a, b) => a + b, 0) + holidaysSelected;
    onSetHolidayDays(accumulatedOldHolidays);
    return accumulatedOldHolidays;
  };

  useEffect(() => {
    reset({
      dateRange:
        holidayRequest?.startDate && holidayRequest?.endDate
          ? [dayjs(holidayRequest?.startDate), dayjs(holidayRequest?.endDate)]
          : holidaysRange?.[0] && holidaysRange?.[1]
            ? [dayjs(holidaysRange[0]), dayjs(holidaysRange?.[1])]
            : null,
    });
  }, [holidayRequest]);

  const onSubmit = async (formData) => {
    const [start, end] = formData.dateRange;

    try {
      setLoading(true);

      const validationRules = validateHolidaysRules(start, end);

      if (validationRules > 30) {
        notification({
          type: "warning",
          title: "Límite de días alcanzado!",
          description:
            "No se pueden seleccionar estas fechas, ya que alcanzan o superan el límite de 30 días calendario.",
        });
        return;
      }

      if (validationRules === 30) {
        notification({
          type: "success",
          title: "Has completado tus 30 días!",
          description:
            "Has utilizado tus 30 días calendario de este año. Se renovará el próximo año",
        });
      }

      if (dayjs(start).day() === 1) {
        formData.dateRange[0] = dayjs(start.toDate()).subtract(1, "day");
      }

      if (dayjs(end).day() === 5) {
        formData.dateRange[1] = dayjs(end.toDate()).add(1, "day");
      }

      if (
        validateDateRange(
          formData.dateRange[0].diff(formData.dateRange[1], "day") + 1,
        )
      )
        return notification({
          type: "warning",
          title: "¡No puedes superar los 30 días!",
        });

      onSetHolidaysRange(formData.dateRange);
    } catch (e) {
      console.log("Error: ", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container gutter={[24, 24]}>
      <Col span={24}>
        <div className="search-wrapper">
          <Form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
            <Row gutter={[16, 16]}>
              <Col span={24} lg={16}>
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
              <Col span={24} lg={8}>
                <Button
                  htmlType="submit"
                  type="primary"
                  size="large"
                  block
                  loading={loading}
                  disabled={loading}
                >
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                  BUSCAR
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </Col>
    </Container>
  );
};

const Container = styled(Row)`
  margin: 1.5em 0;
  height: auto;

  .search-wrapper {
    width: 100%;
    background: rgba(231, 231, 231, 0.82);
    padding: 0.5em;
    border-radius: 0.7em;
  }

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
