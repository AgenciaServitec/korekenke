import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import {
  Row,
  Col,
  Button,
  DateRange,
  Form,
  FullCalendarComponent,
} from "../../../components";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFormUtils } from "../../../hooks";

const FORMAT_DATE_FULLCALENDAR = "YYYY-MM-DD";

export const SearchHolidays = () => {
  const [holidaysRangeData, setHolidaysRangeData] = useState([
    dayjs(),
    dayjs(),
  ]);

  const disabledDate = (current) => {
    return current && current < dayjs().endOf("day");
  };

  const schema = yup.object({
    dateRange: yup.mixed().required(),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const { required, error, errorMessage } = useFormUtils({ errors, schema });

  const onSubmit = (formData) => {
    console.log("formData: ", formData);

    setHolidaysRangeData(formData.dateRange);
  };

  const dateRangeRules = () => {
    const [startDate, endDate] = holidaysRangeData;

    const _dateRange = {
      startDate: dayjs(startDate.toDate()).format(FORMAT_DATE_FULLCALENDAR),
      endDate: dayjs(endDate.toDate()).format(FORMAT_DATE_FULLCALENDAR),
    };

    return _dateRange;
  };

  return (
    <Row gutter={[16, 16]}>
      <Form onSubmit={handleSubmit(onSubmit)}>
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
      <Col span={24}>
        <FullCalendarComponent
          startDate={dateRangeRules().startDate}
          endDate={dateRangeRules().endDate}
          size="small"
        />
      </Col>
    </Row>
  );
};
