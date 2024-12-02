import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  TextArea,
  RadioGroup,
  Button,
  notification,
} from "../../components";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDefaultFirestoreProps, useFormUtils } from "../../hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { useAuthentication } from "../../providers";
import { useParams } from "react-router";
import {
  addActivity,
  fetchActivity,
  getActivityId,
} from "../../firebase/collections/activities";
import dayjs from "dayjs";
import { DATE_FORMAT_TO_FIRESTORE } from "../../firebase/firestore";

export const AddActivityIntegration = ({
  activityType = "task",
  onCloseModal,
}) => {
  const { authUser } = useAuthentication();
  const { activityId } = useParams();
  const [activity, setActivity] = useState(null);

  const isTask = activityType === "task";

  const isNew = activityId === "new";

  useEffect(() => {
    (async () => {
      if (!isNew) {
        const _activity = await fetchActivity(activityId);
        setActivity(_activity);

        if (!_activity) return;
      }

      const _activity = { id: getActivityId(authUser.uid) };
      setActivity(_activity);
    })();
  }, [isNew, activityId]);

  return (
    <AddActivity
      isTask={isTask}
      user={authUser}
      activity={activity}
      onCloseModal={onCloseModal}
    />
  );
};

const AddActivity = ({ isTask, user, activity, onCloseModal }) => {
  const { assignCreateProps } = useDefaultFirestoreProps();
  const [loading, setLoading] = useState(false);

  const schema = yup.object({
    title: yup.string(),
    date: yup.string().required(),
    allDay: yup.boolean(),
    description: yup.string(),
    ...(isTask
      ? {}
      : {
          address: yup.string().required(),
        }),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const { required, error } = useFormUtils({ errors, schema });

  const mapActivity = (formData) => ({
    ...activity,
    id: getActivityId(user.id),
    title: formData.title,
    description: formData.description,
    address: formData.address || null,
    date: dayjs(formData.date).format(DATE_FORMAT_TO_FIRESTORE),
    allDay: formData.allDay,
    color: isTask ? "#3498db" : "#58d68d",
    type: isTask ? "task" : "event",
  });

  const onSubmitActivity = async (formData) => {
    try {
      setLoading(true);
      const _activity = mapActivity(formData);
      await addActivity(user.id, assignCreateProps(_activity));

      notification({
        type: "success",
      });

      reset();

      if (onCloseModal) {
        onCloseModal();
      }
    } catch (e) {
      console.log("Error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row gutter={[16, 16]}>
      <Form onSubmit={handleSubmit(onSubmitActivity)}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Controller
              name="title"
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <Input
                  label="Título"
                  name={name}
                  value={value}
                  onChange={onChange}
                  error={error(name)}
                />
              )}
            />
          </Col>

          <Col span={24} md={12}>
            <Controller
              name="date"
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <DatePicker
                  label="Fecha"
                  name={name}
                  value={value}
                  onChange={onChange}
                  error={error(name)}
                  required={required(name)}
                />
              )}
            />
          </Col>

          <Col span={24} md={12}>
            <Controller
              name="allDay"
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <RadioGroup
                  rows={1}
                  label="¿Es todo el día?"
                  name={name}
                  value={value}
                  onChange={onChange}
                  options={[
                    { label: "Si", value: true },
                    { label: "No", value: false },
                  ]}
                  error={error(name)}
                />
              )}
            />
          </Col>

          <Col span={24}>
            <Controller
              name="description"
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <TextArea
                  rows={3}
                  label="Descripción"
                  name={name}
                  value={value}
                  onChange={onChange}
                />
              )}
            />
          </Col>

          {!isTask && (
            <Col span={24}>
              <Controller
                name="address"
                control={control}
                render={({ field: { onChange, value, name } }) => (
                  <Input
                    label="Dirección"
                    name={name}
                    value={value}
                    onChange={onChange}
                    error={error(name)}
                    required={required(name)}
                  />
                )}
              />
            </Col>
          )}
          <Col span={24}>
            <Button
              htmlType="submit"
              type="primary"
              size="short"
              loading={loading}
              disabled={loading}
              block
            >
              <FontAwesomeIcon icon={faPaperPlane} />
              Guardar
            </Button>
          </Col>
        </Row>
      </Form>
    </Row>
  );
};
