import React from "react";
import { Button, Col, Row } from "antd";
import { DatePicker } from "../../../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import {
  faHourglassEnd,
  faHourglassStart,
} from "@fortawesome/free-solid-svg-icons";

export const SearchHolidays = () => {
  const showStartAndEndDate = (date, dateString) => {
    let count = 0;

    const dayAndNumber = [
      {
        day: date.format("dddd"),
        number: date.$D,
      },
    ];

    dayAndNumber.map((item) => {
      if (item.day === "viernes" || item.day === "lunes") {
        count++;
      }
      console.log("limite", count);
    });
    // console.log("Date String", dateString);
  };

  return (
    <Row gutter={[16, 16]} justify="center">
      <Col span={6}>
        <DatePicker
          prefix={<FontAwesomeIcon icon={faHourglassStart} />}
          onChange={showStartAndEndDate}
        />
      </Col>
      <Col span={6}>
        <DatePicker
          prefix={<FontAwesomeIcon icon={faHourglassEnd} />}
          onChange={showStartAndEndDate}
        />
      </Col>
      <Col span={4}>
        <Button
          color="success"
          variant="solid"
          size="large"
          style={{ width: "100%" }}
        >
          <FontAwesomeIcon icon={faCircleCheck} />
          GENERAR
        </Button>
      </Col>
    </Row>
  );
};
