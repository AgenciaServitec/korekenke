import React from "react";
import { Button } from "../../components";
import { useNavigate } from "react-router";

export const AssistancesIntegration = () => {
  const navigate = useNavigate();

  const onNavigateGoTo = (pathname = "/") => navigate(pathname);

  return <Assistances onNavigateGoTo={onNavigateGoTo} />;
};

const Assistances = ({ onNavigateGoTo }) => {
  return (
    <div>
      <Button onClick={() => onNavigateGoTo("/assistances/assistance")}>
        Marcar mi asistencia
      </Button>
      <h2>ASISTENCIAS LISTA</h2>
    </div>
  );
};
