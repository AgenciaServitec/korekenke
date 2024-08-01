import React from "react";
import {
  Acl,
  Alert,
  Button,
  Divider,
  modalConfirm,
  Space,
} from "../../../../../../../components";
import dayjs from "dayjs";
import styled from "styled-components";
import { orderBy } from "lodash";
import { updateDasApplication } from "../../../../../../../firebase/collections/dasApplications";

export const ObservationsList = ({
  section,
  observations = [],
  dasRequest,
}) => {
  const observationsView = orderBy(observations, ["createAt"], ["desc"]).filter(
    (observation) => observation.isDeleted === false
  );

  const findObservation = (observationId) =>
    dasRequest?.[section]?.observations.find(
      (observation) => observation.id === observationId
    );

  const excludeObservation = (observationId) =>
    dasRequest[section].observations.filter(
      (observation) => observation.id !== observationId
    );

  const updatedObservations = async (observations) => {
    await updateDasApplication(dasRequest.id, {
      [section]: {
        ...dasRequest[section],
        observations: observations,
      },
    });
  };

  const onCloseObservation = (observationId) => {
    return modalConfirm({
      title: "¿Estás seguro de que quieres cerrar esta observación?",
      onOk: async () => {
        await updatedObservations(excludeObservation(observationId));
      },
    });
  };

  const onResolverObservation = (observationId) => {
    return modalConfirm({
      title: "¿Estás seguro resolviste la observación?",
      onOk: async () => {
        const observation = findObservation(observationId);
        const observations = excludeObservation(observationId);

        if (!observation) return;

        const newObservations = [
          ...observations,
          { ...observation, status: "resolved" },
        ];

        await updatedObservations(newObservations);
      },
    });
  };

  return (
    <Container>
      {observationsView.length > 0 && <Divider />}
      {observationsView.map((observation, index) => (
        <div key={index}>
          <Alert
            message={
              <div>
                <p>
                  Observación{" "}
                  <small style={{ fontSize: ".6em" }}>
                    {dayjs(observation.createAt.toDate()).format(
                      "DD/MM/YYYY HH:mm"
                    )}
                  </small>
                </p>
              </div>
            }
            description={
              <div style={{ whiteSpace: "pre-line" }}>
                {observation.message}
              </div>
            }
            type={observation.status === "pending" ? "info" : "success"}
            showIcon
            action={
              <Space direction="vertical">
                <Acl
                  redirect
                  category="departamento-de-apoyo-social"
                  subCategory="dasRequests"
                  name="/das-requests/:dasRequestId#resolverObservation"
                >
                  {observation.status === "pending" && (
                    <Button
                      size="small"
                      type="primary"
                      onClick={() => onResolverObservation(observation.id)}
                    >
                      Resolver
                    </Button>
                  )}
                </Acl>
                <Acl
                  redirect
                  category="departamento-de-apoyo-social"
                  subCategory="dasRequests"
                  name="/das-requests/:dasRequestId#closeObservation"
                >
                  {observation.status === "resolved" && (
                    <Button
                      size="small"
                      danger
                      onClick={() => onCloseObservation(observation.id)}
                    >
                      Cerrar
                    </Button>
                  )}
                </Acl>
              </Space>
            }
          />
          <br />
        </div>
      ))}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
`;
