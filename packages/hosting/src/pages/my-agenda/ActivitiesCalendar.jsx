import React from "react";
import { FullCalendarComponent } from "../../components";
import styled from "styled-components";

export const ActivitiesCalendar = ({
  activitiesLoading,
  activities,
  onShowActivityInformation,
  onShowAddActivity,
}) => {
  return (
    <Container>
      {activitiesLoading ? (
        <p>Cargando actividades...</p>
      ) : (
        <FullCalendarComponent
          activities={activities}
          onShowActivityInformation={onShowActivityInformation}
          onShowAddActivity={onShowAddActivity}
        />
      )}
    </Container>
  );
};

const Container = styled.div`
  max-width: 100%;
  width: 100%;
  height: 100vh;
  padding: 1em;

  border: 5px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  box-shadow:
    0px 4px 8px rgba(0, 0, 0, 0.2),
    inset 0px 2px 4px rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
`;
