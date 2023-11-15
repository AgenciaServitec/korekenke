import React from "react";
import Col from "antd/lib/col";
import Row from "antd/lib/row";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

// interface Props {
//   value: Moment;
//   onChange: (value: Moment) => void;
// }

const byMonths = ({ value, onChange }) => {
  const increaseDate = () => {
    const newValue = value.clone();

    return onChange(newValue.add(1, "months"));
  };

  const decreaseDate = () => {
    const newValue = value.clone();

    return onChange(newValue.subtract(1, "months"));
  };

  return (
    <div style={{ padding: 8 }}>
      <Row gutter={8} justify="space-between">
        <Col span={8}>
          <FontAwesomeIcon icon={faArrowLeft} onClick={decreaseDate} />
        </Col>
        <Col span={8}>{value.format("MMMM YYYY")}</Col>
        <Col span={8}>
          <FontAwesomeIcon icon={faArrowRight} onClick={increaseDate} />
        </Col>
      </Row>
    </div>
  );
};

export const CalendarHeader = { byMonths };
