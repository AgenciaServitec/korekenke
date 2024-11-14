import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import styled from "styled-components";
import esLocale from "@fullcalendar/core/locales/es";

export const HolidaysCalendar = () => {
  return (
    <Container>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        locale={esLocale}
      />
    </Container>
  );
};

const Container = styled.div`
  .fc {
    text-transform: uppercase;
  }
`;
