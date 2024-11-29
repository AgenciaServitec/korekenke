import React, { useEffect } from "react";
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
  const { authUser } = useAuthentication();

  return <EditActivity activity={activity} authUser={authUser} />;
};

const EditActivity = ({ activity, authUser }) => {
  const [loading, setLoading] = React.useState(false);

  const { assignUpdateProps } = useDefaultFirestoreProps();

  const isTask = activity.type === "task";

  const schema = yup.object({
    title: yup.string(),
    date: yup.string().required(),
    allDay: yup.boolean(),
    description: yup.string(),
    ...(isTask
      ? {}
      : {
          location: yup.string().required(),
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
        location: activity.location || "",
      });
    }
  }, [activity, reset]);

  const mapForm = (data) => ({
    ...activity,
    title: data.title,
    description: data.description,
    location: data.location || null,
    date: dayjs(data.date).format(DATE_FORMAT_TO_FIRESTORE),
    allDay: data.allDay,
    color: isTask ? "#3498db" : "#58d68d",
    type: isTask ? "task" : "event",
  });

  const onSaveActivity = async (data) => {
    try {
      setLoading(true);
      const activityData = mapForm(data);
      await updateActivity(
        authUser.id,
        activityData,
        assignUpdateProps(activityData),
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
    <Row gutter={[16, 16]}>
      <Form onSubmit={handleSubmit(onSaveActivity)}>
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
                name="location"
                control={control}
                render={({ field: { onChange, value, name } }) => (
                  <Input
                    label="Ubicación"
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
