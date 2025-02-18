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
  TimePicker,
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

export const AddActivityIntegration = ({
  activityType = "task",
  onCloseModal,
  selectedDate,
}) => {
  const { authUser } = useAuthentication();
  const { activityId } = useParams();

  const [activity, setActivity] = useState(null);
  const [currentActivityType, setCurrentActivityType] = useState(activityType);
  const [modalTitle, setModalTitle] = useState(
    currentActivityType === "task" ? "Agregar Tarea" : "Agregar Evento",
  );

  const isTask = currentActivityType === "task";

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

  const toggleActivityType = () => {
    const newActivityType = isTask ? "event" : "task";
    setCurrentActivityType(newActivityType);
    setModalTitle(
      newActivityType === "task" ? "Agregar Tarea" : "Agregar Evento",
    );
  };

  return (
    <div>
      <h5>{modalTitle}</h5>
      <Button
        onClick={toggleActivityType}
        type="default"
        style={{ marginBottom: "10px" }}
      >
        Cambiar a {isTask ? "Evento" : "Tarea"}
      </Button>
      <AddActivity
        isTask={isTask}
        user={authUser}
        activity={activity}
        selectedDate={selectedDate}
        onCloseModal={onCloseModal}
      />
    </div>
  );
};

const AddActivity = ({
  isTask,
  user,
  activity,
  onCloseModal,
  selectedDate,
}) => {
  const { assignCreateProps } = useDefaultFirestoreProps();

  const [loading, setLoading] = useState(false);
  const [isAllDay, setIsAllDay] = useState(false);
  const [startDateValue, setStartDateValue] = useState(
    selectedDate ? dayjs(selectedDate, "DD/MM/YYYY") : undefined,
  );

  const DATE_FORMAT = "DD/MM/YYYY";

  const schema = yup.object({
    title: yup.string(),
    startDate: yup.string().required(),
    startTime: yup.string().test("startTime-required", function (value) {
      const { allDay } = this.parent;
      if (allDay && value === "") {
        return true;
      }
      if (!allDay && !value) {
        return false;
      }
      return true;
    }),
    endDate: yup.string(),
    endTime: yup.string(),
    allDay: yup.boolean(),
    ...(isTask
      ? {
          description: yup.string(),
        }
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
    defaultValues: {
      allDay: false,
    },
  });
  const { required, error } = useFormUtils({ errors, schema });

  useEffect(() => {
    reset((formValues) => ({
      title: "",
      startDate: selectedDate ? dayjs(selectedDate, "DD/MM/YYYY") : undefined,
      endDate: "",
      startTime: selectedDate
        ? dayjs(selectedDate, "DD/MM/YYYY HH:mm").format("HH:mm")
        : undefined,
      allDay: false,
      description: "",
      address: "",
    }));
  }, [selectedDate]);

  const mapActivity = (formData) => {
    const startDateTime = formData.allDay
      ? null
      : formData.startTime
        ? dayjs(formData.startDate)
            .set("hour", dayjs(formData.startTime, "HH:mm").hour())
            .set("minute", dayjs(formData.startTime, "HH:mm").minute())
        : null;

    const endDateTime = formData.allDay
      ? null
      : formData.endTime
        ? dayjs(formData?.endDate || formData.startDate)
            .set("hour", dayjs(formData.endTime, "HH:mm").hour())
            .set("minute", dayjs(formData.endTime, "HH:mm").minute())
        : null;

    return {
      ...activity,
      id: getActivityId(user.id),
      title: formData.title,
      description: formData.description,
      address: formData.address || null,
      startDate: dayjs(formData.startDate).format(DATE_FORMAT),
      startTime: startDateTime ? startDateTime.format("HH:mm") : null,
      endDate: formData.endDate
        ? dayjs(formData.endDate).format(DATE_FORMAT)
        : dayjs(formData.startDate).format(DATE_FORMAT),
      endTime: endDateTime
        ? endDateTime.format("HH:mm")
        : startDateTime
          ? startDateTime.format("HH:mm")
          : null,
      allDay: formData.allDay,
      color: isTask ? "#3498db" : "#58d68d",
      type: isTask ? "task" : "event",
    };
  };

  const onSubmitActivity = async (formData) => {
    try {
      setLoading(true);
      const _activity = mapActivity(formData);
      await addActivity(user.id, assignCreateProps(_activity));

      notification({
        type: "success",
      });

      reset();

      onCloseModal();
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
              name="startDate"
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <DatePicker
                  label="Fecha de inicio"
                  name={name}
                  value={value}
                  onChange={(date) => {
                    onChange(date);
                    setStartDateValue(date);
                  }}
                  error={error(name)}
                  required={required(name)}
                />
              )}
            />
          </Col>
          {!isAllDay && (
            <>
              <Col span={24} md={12}>
                <Controller
                  name="endDate"
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <DatePicker
                      label="Fecha de fin (Opcional)"
                      name={name}
                      value={value}
                      onChange={onChange}
                      error={error(name)}
                      disabled={
                        startDateValue && dayjs(value).isBefore(startDateValue)
                      }
                      disabledDate={(current) =>
                        current && current.isBefore(startDateValue)
                      }
                    />
                  )}
                />
              </Col>
              <Col span={24} md={12}>
                <Controller
                  name="startTime"
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <TimePicker
                      label="Hora de inicio"
                      picker="time"
                      format="HH:mm"
                      minuteStep={5}
                      showNow={false}
                      use12hours={false}
                      name={name}
                      value={value ? dayjs(value, "HH:mm") : null}
                      onChange={(time) =>
                        onChange(time ? time.format("HH:mm") : null)
                      }
                      error={error(name)}
                      required={required(name)}
                    />
                  )}
                />
              </Col>

              <Col span={24} md={12}>
                <Controller
                  name="endTime"
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <TimePicker
                      label="Hora de fin"
                      picker="time"
                      format="HH:mm"
                      minuteStep={5}
                      showNow={false}
                      use12hours={false}
                      name={name}
                      value={value ? dayjs(value, "HH:mm") : null}
                      onChange={(time) =>
                        onChange(time ? time.format("HH:mm") : null)
                      }
                      error={error(name)}
                    />
                  )}
                />
              </Col>
            </>
          )}
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
                  onChange={(e) => {
                    onChange(e);
                    setIsAllDay(e.target.value);
                  }}
                  options={[
                    { label: "Sí", value: true },
                    { label: "No", value: false },
                  ]}
                  error={error(name)}
                />
              )}
            />
          </Col>

          {isTask && (
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
          )}

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
