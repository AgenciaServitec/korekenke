import React from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import styled from "styled-components";
import esLocale from "@fullcalendar/core/locales/es";
import FullCalendar from "@fullcalendar/react";
import dayjs from "dayjs";
import { DATE_FORMAT_TO_FIRESTORE } from "../../firebase/firestore";

export const FullCalendarComponent = ({ startDate, endDate, props }) => {
  const events = [
    {
      start: dayjs(startDate, DATE_FORMAT_TO_FIRESTORE).format("YYYY-MM-DD"),
      end: dayjs(endDate, DATE_FORMAT_TO_FIRESTORE).format("YYYY-MM-DD"),
      display: "background",
    },
  ];

  return (
    <Container>
      <FullCalendar
        plugins={[dayGridPlugin]}
        locale={esLocale}
        events={events}
        allDayContent={true}
        {...props}
        height={500}
      />
    </Container>
  );
};

const Container = styled.div`
  margin: 1.5em 0;

  .fc {
    text-transform: uppercase;
    .fc-day-today {
      background-color: transparent;
    }
  }
`;
