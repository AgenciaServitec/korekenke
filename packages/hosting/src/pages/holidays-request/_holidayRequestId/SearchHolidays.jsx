import React, { useEffect, useState } from "react";
import { Button, Col, DatePicker, Row } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import dayjs from "dayjs";
import { isEmpty } from "lodash";
import { HolidaysCalendar } from "./HolidaysCalendar";

export const SearchHolidays = () => {
  const { RangePicker } = DatePicker;
  const [date, setDate] = useState([]);
  const [dateString, setDateString] = useState([]);
  const [holidaysRangeData, setHolidaysRangeData] = useState([]);
  const disabledDate = (current) => {
    return current && current < dayjs().endOf("day");
  };

  const setStartDateAndEndDate = async (date, dateString) => {
    setDate(date);
    setDateString(dateString);
  };

  useEffect(() => {
    if (!isEmpty(date && dateString)) {
      console.log("Fechas:", date);
      console.log("Fechas en String:", dateString);
    }
  }, [date]);

  const holidaysRange = () => {};

  return (
    <Row gutter={[16, 16]} justify="center">
      <Col span={8}>
        <RangePicker
          disabledDate={disabledDate}
          style={{ width: "100%", height: "100%" }}
          onChange={setStartDateAndEndDate}
        />
      </Col>
      <Col span={4}>
        <Button
          color="success"
          variant="solid"
          size="large"
          style={{ width: "100%" }}
          // onclick={getHolidaysRange}
        >
          <FontAwesomeIcon icon={faCircleCheck} />
          GENERAR
        </Button>
      </Col>
      <Col span={24}>
        <HolidaysCalendar />
      </Col>
    </Row>
  );
};
