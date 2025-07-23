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
  viewTypes = "timeGridDay timeGridWeek dayGridMonth multiMonth",
  activities,
  onShowActivityInformation,
  onShowAddActivity,
  props,
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

  const activityEvents = activities
    ?.map((activity) => {
      const startDateTime = activity.allDay
        ? dayjs(activity.startDate, "DD/MM/YYYY").startOf("day")
        : dayjs(activity.startDate, "DD/MM/YYYY")
            .set("hour", dayjs(activity.startTime, "HH:mm").hour())
            .set("minute", dayjs(activity.startTime, "HH:mm").minute());

      const endDateTime = activity.endDate
        ? activity.allDay
          ? dayjs(activity.endDate, "DD/MM/YYYY").endOf("day")
          : dayjs(activity.endDate, "DD/MM/YYYY")
              .set("hour", dayjs(activity.endTime, "HH:mm").hour())
              .set("minute", dayjs(activity.endTime, "HH:mm").minute())
        : null;

      return {
        title: activity?.title || "Sin Título",
        start: startDateTime.toISOString(),
        end: endDateTime ? endDateTime.toISOString() : null,
        allDay: activity.allDay,
        location: activity.location || null,
        backgroundColor: activity.color,
        borderColor: activity.color,
        extendedProps: {
          description: activity.description,
          activityId: activity.id,
        },
      };
    })
    .filter(Boolean);

  const events = [...defaultEvents, ...(activityEvents ? activityEvents : [])];

  const handleEventClick = (info) => {
    if (!onShowActivityInformation) return;
    const event = info.event;
    onShowActivityInformation(event.extendedProps.activityId);
  };

  const handleDateClick = (info) => {
    if (!onShowAddActivity) return;
    const selectedDate = dayjs(info.date);
    onShowAddActivity("task", selectedDate);
  };

  return (
    <Container>
      <FullCalendar
        key={rerender}
        locale={esLocale}
        events={events}
        selectable
        firstDay={0}
        headerToolbar={{
          start: "today prev next",
          center: "title",
          end: viewTypes,
        }}
        buttonText={{
          multiMonth: "Meses",
        }}
        duration={{ months: 12 }}
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
          timeZone: "America/Lima",
        }}
        eventClick={handleEventClick}
        dateClick={handleDateClick}
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
