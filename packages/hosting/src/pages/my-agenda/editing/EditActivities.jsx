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
} from "../../../components";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDefaultFirestoreProps, useFormUtils } from "../../../hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { useAuthentication } from "../../../providers";
import dayjs from "dayjs";
import { DATE_FORMAT_TO_FIRESTORE } from "../../../firebase/firestore";
import { updateActivity } from "../../../firebase/collections/activities";

export const EditActivityIntegration = ({ activity }) => {
  const [loading, setLoading] = useState(false);

  const { assignUpdateProps } = useDefaultFirestoreProps();
  const { authUser } = useAuthentication();

  const isTask = activity.type === "task";

  const mapForm = (formData) => ({
    ...activity,
    title: formData.title,
    description: formData.description,
    address: formData.address || null,
    date: dayjs(formData.date).format(DATE_FORMAT_TO_FIRESTORE),
    allDay: formData.allDay,
    color: isTask ? "#3498db" : "#58d68d",
    type: isTask ? "task" : "event",
  });

  const onSaveActivity = async (formData) => {
    try {
      setLoading(true);
      const _activity = mapForm(formData);
      await updateActivity(
        authUser.id,
        _activity,
        assignUpdateProps(_activity),
      );

      notification({
        type: "success",
      });
    } catch (e) {
      console.log("Error:", e);
      notification({
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <EditActivity
      activity={activity}
      isTask={isTask}
      onSaveActivity={onSaveActivity}
      loading={loading}
    />
  );
};

const EditActivity = ({ activity, isTask, onSaveActivity, loading }) => {
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

  useEffect(() => {
    if (activity) {
      const formattedDate = activity.date
        ? dayjs(activity.date, "DD/MM/YYYY HH:mm")
        : dayjs();

      reset({
        title: activity.title,
        date: formattedDate.isValid() ? formattedDate : dayjs(),
        allDay: activity.allDay,
        description: activity.description,
        address: activity.address || "",
      });
    }
  }, [activity, reset]);

  const onSubmit = (formData) => onSaveActivity(formData);

  return (
    <Row gutter={[16, 16]}>
      <Form onSubmit={handleSubmit(onSubmit)}>
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
                    { label: "Sí", value: true },
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
              Guardar cambios
            </Button>
          </Col>
        </Row>
      </Form>
    </Row>
  );
};
