import React, { useEffect } from "react";
import { Acl, Col, notification, Row, Tag } from "../../components";
import {
  ActivitiesProvider,
  ModalProvider,
  useActivitiesContext,
  useAuthentication,
  useModal,
} from "../../providers";
import { useDevice } from "../../hooks";
import { ActivitiesCalendar } from "./ActivitiesCalendar";
import { ActivitiesDropdown } from "./ActivitiesDropdown";
import { AddActivityIntegration } from "./AddActivity";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
  activitiesRef,
  updateActivity,
} from "../../firebase/collections/activities";
import { ActivitiesList } from "./ActivitiesList";
import { EditActivityIntegration } from "./editing/EditActivities";
import { ActivityInformation } from "./editing/ActivityInformation";

export const Activities = () => {
  const { authUser } = useAuthentication();

  const [activities = [], activitiesLoading, activitiesError] =
    useCollectionData(
      activitiesRef(authUser.id).where("isDeleted", "==", false),
    );

  useEffect(() => {
    activitiesError && notification({ type: "error" });
  }, [activitiesError]);

  return (
    <ActivitiesProvider>
      <ModalProvider>
        <Activity
          activities={activities}
          activitiesLoading={activitiesLoading}
          user={authUser}
        />
      </ModalProvider>
    </ActivitiesProvider>
  );
};

const Activity = ({ activities, activitiesLoading, user }) => {
  const { isTablet } = useDevice();
  const { onShowModal, onCloseModal } = useModal();
  const { setActivities } = useActivitiesContext();

  const onAddActivity = (newActivity) => {
    setActivities((prev) => [...prev, newActivity]);
    onCloseModal();
  };

  const onShowAddActivity = (type) => {
    onShowModal({
      title: type === "task" ? "Agregar Tarea" : "Agregar Evento",
      width: `${isTablet ? "90%" : "50%"}`,
      onRenderBody: () => (
        <AddActivityIntegration
          onCloseModal={onCloseModal}
          activityType={type}
          onSubmit={(data) => {
            onAddActivity(data);
          }}
        />
      ),
    });
  };

  const onEditActivity = (activityId) => {
    const activity = activities.find((activity) => activity.id === activityId);
    if (activity) {
      onShowModal({
        title: activity.type === "task" ? "Editar Tarea" : "Editar Evento",
        width: `${isTablet ? "90%" : "50%"}`,
        onRenderBody: () => (
          <EditActivityIntegration
            onCloseModal={onCloseModal}
            activity={activity}
          />
        ),
      });
    }
  };

  const onShowActivityInformation = (activityId) => {
    const activity = activities.find((activity) => activity.id === activityId);
    if (activity) {
      onShowModal({
        title:
          activity.type === "task" ? (
            <Tag color="blue">Tarea</Tag>
          ) : (
            <Tag color="green">Evento</Tag>
          ),
        width: `${isTablet ? "90%" : "30%"}`,
        onRenderBody: () => (
          <ActivityInformation
            activity={activity}
            onEditActivity={onEditActivity}
            onConfirmDeleteActivity={onConfirmDeleteActivity}
          />
        ),
      });
    }
  };

  const onConfirmDeleteActivity = async (activityId) => {
    try {
      await updateActivity(user.id, {
        id: activityId,
        isDeleted: true,
      });
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  return (
    <Acl redirect category="default" subCategory="myAgenda" name="/my-agenda">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Row gutter={[16, 16]}>
            <Col span={24} sm={24} md={18}>
              <ActivitiesCalendar
                activities={activities}
                activitiesLoading={activitiesLoading}
                onEditActivity={onEditActivity}
                onConfirmDeleteActivity={onConfirmDeleteActivity}
                onShowActivityInformation={onShowActivityInformation}
              />
            </Col>
            <Col span={24} sm={24} md={6}>
              <Row gutter={[8, 8]}>
                <Col span={24}>
                  <ActivitiesDropdown
                    onShowAddTask={() => onShowAddActivity("task")}
                    onShowAddEvent={() => onShowAddActivity("event")}
                  />
                </Col>
                <Col span={24}>
                  <ActivitiesList
                    activities={activities}
                    onEditActivity={onEditActivity}
                    onConfirmDeleteActivity={onConfirmDeleteActivity}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </Acl>
  );
};
