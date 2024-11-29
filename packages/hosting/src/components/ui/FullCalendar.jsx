import React, { useEffect, useState } from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import styled from "styled-components";
import esLocale from "@fullcalendar/core/locales/es";
import FullCalendar from "@fullcalendar/react";
import { mediaQuery } from "../../styles";
import dayjs from "dayjs";

export const FullCalendarComponent = ({
  startDate,
  endDate,
  props,
  activities,
  onShowActivityInformation,
}) => {
  console.log("activities:", activities);
  const [rerender, setRerender] = useState(null);

  useEffect(() => {
    setRerender(Math.random());
  }, []);

  const defaultEvents = [
    {
      start: startDate,
      end: endDate,
      display: "background",
      backgroundColor: "lightgreen",
    },
  ];

  const activityEvents =
    activities?.map((activity) => ({
      title: activity.title,
      start: dayjs(activity.date, "DD/MM/YYYY HH:mm").toISOString(),
      allDay: activity.allDay,
      location: activity.location || null,
      backgroundColor: activity.color,
      borderColor: activity.color,
      extendedProps: {
        description: activity.description,
        activityId: activity.id,
      },
    })) || [];

  const events = [...defaultEvents, ...activityEvents];

  const handleEventClick = (info) => {
    const event = info.event;
    // Llamar a la función que muestra la información de la actividad
    onShowActivityInformation(event.extendedProps.activityId);
  };

  return (
    <Container>
      <FullCalendar
        key={rerender}
        plugins={[dayGridPlugin]}
        locale={esLocale}
        events={events}
        eventClick={handleEventClick}
        allDayContent={true}
        height={500}
        {...props}
      />
    </Container>
  );
};

const Container = styled.div`
  margin: 1.5em 0;
  width: 100%;
  height: 100%;

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
