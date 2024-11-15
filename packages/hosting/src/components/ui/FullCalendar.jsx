import React from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import styled from "styled-components";
import esLocale from "@fullcalendar/core/locales/es";
import FullCalendar from "@fullcalendar/react";

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
        {...props}
      />
    </Container>
  );
};

const Container = styled.div`
  .fc {
    text-transform: uppercase;
    .fc-day-today {
      background-color: transparent;
    }
  }
`;
