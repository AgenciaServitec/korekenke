import React, { useEffect, useState } from "react";
import styled from "styled-components";
import esLocale from "@fullcalendar/core/locales/es";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import multiMonthPlugin from "@fullcalendar/multimonth";

import { mediaQuery } from "../../styles";
import dayjs from "dayjs";

export const FullCalendarComponent = ({
  startDate,
  endDate,
  props,
  activities,
  onShowActivityInformation,
}) => {
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
    onShowActivityInformation(event.extendedProps.activityId);
  };

  return (
    <Container>
      <FullCalendar
        key={rerender}
        locale={esLocale}
        events={events}
        selectable
        headerToolbar={{
          start: "today prev next",
          center: "title",
          end: "timeGridDay timeGridWeek dayGridMonth multiMonth",
        }}
        buttonText={{
          multiMonth: "Meses",
        }}
        duration={{ months: 12 }}
        timeZone="America/Lima"
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
          listPlugin,
          multiMonthPlugin,
        ]}
        eventTimeFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          timeZone: "America/Lima",
        }}
        eventClick={handleEventClick}
        allDayContent={true}
        height="95%"
        {...props}
      />
    </Container>
  );
};

const Container = styled.div`
  margin: 1.5em 0;
  width: 100%;
  height: 80svh;

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
