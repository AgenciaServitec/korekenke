import React from "react";
import {
  Button,
  Col,
  FullCalendarComponent,
  Row,
  Space,
  Text,
} from "../../../../components";
import dayjs from "dayjs";
import {
  faArrowRight,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { mediaQuery } from "../../../../styles";

const FORMAT_DATE_FULLCALENDAR = "YYYY-MM-DD";

export const ShowCalendar = ({ holidaysRange, onSetCurrentStep }) => {
  const dateRangeRules = () => {
    const [startDate, endDate] = holidaysRange;

    return {
      startDate: dayjs(startDate.toDate()).format(FORMAT_DATE_FULLCALENDAR),
      endDate: dayjs(endDate.toDate())
        .add(1, "day")
        .format(FORMAT_DATE_FULLCALENDAR),
    };
  };

  return (
    <Container gutter={[16, 16]}>
      {holidaysRange ? (
        <>
          <Col span={24}>
            <FullCalendarComponent
              startDate={dateRangeRules().startDate}
              endDate={dateRangeRules().endDate}
              viewTypes="dayGridMonth multiMonth"
            />
          </Col>
          <Col span={24} style={{ display: "flex", justifyContent: "end" }}>
            <Button
              type="primary"
              size="large"
              onClick={() => onSetCurrentStep(1)}
              className="btn-next"
              icon={<FontAwesomeIcon icon={faArrowRight} />}
            >
              Continuar
            </Button>
          </Col>
        </>
      ) : (
        <Col span={24}>
          <div className="search-make">
            <Space direction="vertical" align="center">
              <div className="icon">
                <FontAwesomeIcon icon={faMagnifyingGlass} size="3x" />
              </div>
              <div className="description">
                <Text level={1}>
                  Realice la búsqueda de disponibilidad de vacaciones
                </Text>
              </div>
            </Space>
          </div>
        </Col>
      )}
    </Container>
  );
};

const Container = styled(Row)`
  .search-make {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 2em auto;
    width: 100%;
    min-height: 30vh;
    height: auto;
    opacity: 0.8;
  }

  .btn-next {
    padding: 1em 5em;

    ${mediaQuery.minTablet} {
      padding: 1em 8em;
    }
  }
`;
