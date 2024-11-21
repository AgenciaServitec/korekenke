import React from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import styled from "styled-components";
import esLocale from "@fullcalendar/core/locales/es";
import FullCalendar from "@fullcalendar/react";
import { mediaQuery } from "../../styles";

export const FullCalendarComponent = ({ startDate, endDate, props }) => {
  const events = [
    {
      start: startDate,
      end: endDate,
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
    .fc-toolbar {
      flex-wrap: wrap;
    }
    .fc-toolbar-title {
      font-size: 1.25em;
      ${mediaQuery.minTablet} {
        font-size: 1.75em;
      }
    }
  }
`;
