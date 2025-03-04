import React from "react";
import {
  Acl,
  Alert,
  Button,
  Divider,
  IconAction,
  modalConfirm,
  Space,
} from "../../../../../../../components";
import dayjs from "dayjs";
import styled from "styled-components";
import { orderBy } from "lodash";
import { updateDasRequest } from "../../../../../../../firebase/collections";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { ObservationForApplicantDocumentsModal } from "./ObservationForApplicantDocumentsModal";
import { useDasRequestModal } from "./DasRequest.ModalProvider";
import { useDevice } from "../../../../../../../hooks";
import { ObservationForInstitucionalDataModal } from "./ObservationForInstitucionalDataModal";
import { ObservationPersonalInformationModal } from "./ObservationPersonalInformationModal";

export const ObservationsList = ({
  section,
  observations = [],
  dasRequest,
  onAddOrEditObservation,
}) => {
  const { onShowDasRequestModal, onCloseDasRequestModal } =
    useDasRequestModal();
  const { isTablet } = useDevice();

  const observationsView = orderBy(observations, ["createAt"], ["desc"]).filter(
    (observation) => observation.isDeleted === false,
  );

  const findObservation = (observationId) =>
    dasRequest?.[section]?.observations.find(
      (observation) => observation.id === observationId,
    );

  const excludeObservation = (observationId) =>
    dasRequest[section].observations.filter(
      (observation) => observation.id !== observationId,
    );

  const updatedObservations = async (observations) => {
    await updateDasRequest(dasRequest.id, {
      [section]: {
        ...dasRequest[section],
        observations: observations,
      },
    });
  };

  const onEditObservationPersonalInformation = (dasRequest, observation) => {
    onShowDasRequestModal({
      title:
        observation.id === "new" ? "Agregar Observación" : "Editar Observación",
      width: `${isTablet ? "90%" : "50%"}`,
      onRenderBody: () => (
        <ObservationPersonalInformationModal
          dasRequest={dasRequest}
          observation={observation}
          onCloseDasRequestModal={onCloseDasRequestModal}
          onAddOrEditObservation={onAddOrEditObservation}
        />
      ),
    });
  };

  const onEditObservationInstitutionData = (dasRequest, observation) => {
    onShowDasRequestModal({
      title:
        observation.id === "new" ? "Agregar Observación" : "Editar Observación",
      width: `${isTablet ? "90%" : "50%"}`,
      onRenderBody: () => (
        <ObservationForInstitucionalDataModal
          dasRequest={dasRequest}
          observation={observation}
          onCloseDasRequestModal={onCloseDasRequestModal}
          onAddOrEditObservation={onAddOrEditObservation}
        />
      ),
    });
  };

  const onEditObservationApplicantDocuments = (dasRequest, observation) => {
    onShowDasRequestModal({
      title:
        observation.id === "new" ? "Agregar Observación" : "Editar Observación",
      width: `${isTablet ? "90%" : "50%"}`,
      onRenderBody: () => (
        <ObservationForApplicantDocumentsModal
          dasRequest={dasRequest}
          observation={observation}
          onCloseDasRequestModal={onCloseDasRequestModal}
          onAddOrEditObservation={onAddOrEditObservation}
        />
      ),
    });
  };

  const informationSection = {
    headline: onEditObservationPersonalInformation,
    institution: onEditObservationInstitutionData,
    applicant: onEditObservationApplicantDocuments,
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
                      "DD/MM/YYYY HH:mm",
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
                <Space>
                  <Acl
                    category="public"
                    subCategory="dasRequests"
                    name="/das-requests/:dasRequestId#editObservation"
                    redirect
                  >
                    {observation.status === "pending" && (
                      <IconAction
                        tooltipTitle="Editar"
                        icon={faEdit}
                        onClick={() =>
                          informationSection?.[section](dasRequest, observation)
                        }
                      />
                    )}
                  </Acl>
                  <Acl
                    category="public"
                    subCategory="dasRequests"
                    name="/das-requests/:dasRequestId#resolverObservation"
                    redirect
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
                </Space>
                <Acl
                  category="public"
                  subCategory="dasRequests"
                  name="/das-requests/:dasRequestId#closeObservation"
                  redirect
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
