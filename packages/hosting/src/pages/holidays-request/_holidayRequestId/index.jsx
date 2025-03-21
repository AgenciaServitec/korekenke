import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import styled from "styled-components";
import { SearchHolidays } from "./steps/SearchHolidays";
import { Col, Row, Steps, Title } from "../../../components";
import { useAuthentication } from "../../../providers";
import { SendHolidayRequestIntegration } from "./steps/SendHolidayRequestIntegration";
import dayjs from "dayjs";
import {
  fetchHoliday,
  fetchHolidaysByUserId,
  getHolidaysId,
} from "../../../firebase/collections/holidays";
import { DATE_FORMAT_TO_FIRESTORE } from "../../../firebase/firestore";
import { ShowCalendar } from "./steps/ShowCalendar";
import { mediaQuery } from "../../../styles";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { EditHolidayIntegration } from "./editing/EditHoliday";

export const HolidayRequestIntegration = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthentication();
  const { holidayRequestId } = useParams();

  const [currentStep, setCurrentStep] = useState(0);
  const [holidayRequest, setHolidayRequest] = useState(null);
  const [holidaysRange, setHolidaysRange] = useState(null);
  const [holidaysByUser, setHolidaysByUser] = useState([]);
  const [holidayDays, setHolidayDays] = useState(0);

  const isNew = holidayRequestId === "new";

  const onSetCurrentStep = (step) => setCurrentStep(step);
  const onSetHolidaysRange = (range) => setHolidaysRange(range);
  const onSetHolidayDays = (_holidayDays) => setHolidayDays(_holidayDays);
  const onNavigateGoTo = (pathname) => navigate(pathname);
  const onGoBack = () => navigate(-1);

  useEffect(() => {
    (async () => {
      if (!isNew) {
        const _holidayRequest = await fetchHoliday(holidayRequestId);
        setHolidayRequest(_holidayRequest);
        setHolidaysRange([
          dayjs(_holidayRequest.startDate, DATE_FORMAT_TO_FIRESTORE),
          dayjs(_holidayRequest.endDate, DATE_FORMAT_TO_FIRESTORE),
        ]);

        if (!_holidayRequest) return onGoBack();
      }

      const _holidaysByUser = await fetchHolidaysByUserId(authUser.id);
      setHolidaysByUser(_holidaysByUser);

      const _holidayRequest = { id: getHolidaysId() };
      setHolidayRequest(_holidayRequest);
    })();
  }, [isNew]);

  const onShowStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <ShowCalendar
            holidaysRange={holidaysRange}
            onSetCurrentStep={onSetCurrentStep}
          />
        );
      case 1:
        return (
          <SendHolidayRequestIntegration
            user={authUser}
            holidaysByUser={holidaysByUser}
            holidaysRange={holidaysRange}
            holidayRequest={holidayRequest}
            onNavigateGoTo={onNavigateGoTo}
            onSetCurrentStep={onSetCurrentStep}
            holidayDays={holidayDays}
          />
        );
      default:
        return (
          <ShowCalendar
            holidaysRange={holidaysRange}
            onSetCurrentStep={onSetCurrentStep}
          />
        );
    }
  };

  return (
    <Container>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Title level={2}>SOLICITUD DE VACACIONES</Title>
        </Col>
        <Col span={24}>
          {isNew ? (
            <>
              <div className="header-wrapper">
                {currentStep === 0 ? (
                  <SearchHolidays
                    user={authUser}
                    holidaysByUser={holidaysByUser}
                    holidaysRange={holidaysRange}
                    holidayRequest={holidayRequest}
                    onSetHolidaysRange={onSetHolidaysRange}
                    onSetHolidayDays={onSetHolidayDays}
                  />
                ) : (
                  <div className="item-date-range">
                    <div className="item-date">
                      <label>Desde</label>
                      <h3>{dayjs(holidaysRange[0]).format("DD MMM YYYY")}</h3>
                    </div>
                    <div className="item-icon">
                      <FontAwesomeIcon icon={faArrowRight} size="2x" />
                    </div>
                    <div className="item-date">
                      <label>Hasta</label>
                      <h3>{dayjs(holidaysRange[1]).format("DD MMM YYYY")}</h3>
                    </div>
                  </div>
                )}
              </div>
              <div className="steps-wrapper">
                <Steps
                  current={currentStep}
                  items={[
                    {
                      title: "Dias de vacaciones",
                    },
                    {
                      title: "Motivo y/o asunto",
                    },
                  ]}
                />
              </div>
              {onShowStep()}
            </>
          ) : (
            <EditHolidayIntegration user={authUser} />
          )}
        </Col>
      </Row>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;

  .header-wrapper {
    width: 100%;
    .item-date-range {
      width: auto;
      max-width: 100%;
      margin: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 2em;
      background: rgba(231, 231, 231, 0.82);
      padding: 1em;
      border-radius: 0.7em;
      ${mediaQuery.minTablet} {
        max-width: 27em;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .item-date {
        text-transform: uppercase;
        h3 {
          margin: 0;
        }
      }
    }
  }

  .steps-wrapper {
    width: 100%;
    margin: 2em auto auto auto;
    ${mediaQuery.minTablet} {
      width: 50%;
    }
  }
`;
