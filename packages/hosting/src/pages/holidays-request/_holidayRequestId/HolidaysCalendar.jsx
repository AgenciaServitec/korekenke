import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import styled from "styled-components";
import esLocale from "@fullcalendar/core/locales/es";

export const HolidaysCalendar = () => {
  const events = [
    {
      start: "2024-11-21",
      end: "2024-11-23",
      display: "background",
    },
  ];
  const today = "2024-11-14";
  return (
    <Container>
      <FullCalendar
        plugins={[dayGridPlugin]}
        locale={esLocale}
        events={events}
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
