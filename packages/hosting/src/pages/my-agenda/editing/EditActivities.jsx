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
import {
  getActivityId,
  updateActivity,
} from "../../../firebase/collections/activities";

export const EditActivityIntegration = ({ activity, onCloseModal }) => {
  const [loading, setLoading] = useState(false);

  const { assignUpdateProps } = useDefaultFirestoreProps();
  const { authUser } = useAuthentication();

  const isTask = activity.type === "task";
  const DATE_FORMAT = "DD/MM/YYYY";
  const [isAllDay, setIsAllDay] = useState(false);
  const [startDateValue, setStartDateValue] = useState(null);

  const mapForm = (formData) => {
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
        ? dayjs(formData.endDate)
            .set("hour", dayjs(formData.endTime, "HH:mm").hour())
            .set("minute", dayjs(formData.endTime, "HH:mm").minute())
        : null;

    return {
      ...activity,
      id: activity.id,
      title: formData.title,
      description: formData.description,
      address: formData.address || null,
      startDate: dayjs(formData.startDate).format(DATE_FORMAT),
      startTime: startDateTime ? startDateTime.format("HH:mm") : null,
      endDate: formData.allDay
        ? dayjs(formData.startDate).format(DATE_FORMAT)
        : formData.endDate
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

      onCloseModal();
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
      isAllDay={isAllDay}
      setIsAllDay={setIsAllDay}
      startDateValue={startDateValue}
      setStartDateValue={setStartDateValue}
    />
  );
};

const EditActivity = ({
  activity,
  isTask,
  onSaveActivity,
  loading,
  isAllDay,
  setIsAllDay,
  startDateValue,
  setStartDateValue,
}) => {
  const schema = yup.object({
    title: yup.string(),
    startDate: yup.string().required("La fecha de inicio es requerida"),
    startTime: yup
      .string()
      .test("startTime-required", function (value) {
        const { allDay } = this.parent;
        if (allDay) {
          return true;
        }
        if (!value) {
          return false;
        }
        return true;
      })
      .nullable(),
    endDate: yup.string(),
    endTime: yup
      .string()
      .test("endTime-required", function (value) {
        const { allDay, startTime } = this.parent;
        if (allDay) {
          return true;
        }
        if (!startTime) {
          return false;
        }
        return !!value;
      })
      .nullable(),
    allDay: yup.boolean(),
    ...(isTask
      ? {
          description: yup.string(),
        }
      : {
          address: yup.string().required("La dirección es requerida"),
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
      setIsAllDay(activity.allDay || false);
      setStartDateValue(
        activity.startDate ? dayjs(activity.startDate, "DD/MM/YYYY") : null,
      );

      reset({
        title: activity.title || "",
        startDate: activity.startDate
          ? dayjs(activity.startDate, "DD/MM/YYYY").isValid()
            ? dayjs(activity.startDate, "DD/MM/YYYY")
            : null
          : null,
        endDate: activity.endDate
          ? dayjs(activity.endDate, "DD/MM/YYYY").isValid()
            ? dayjs(activity.endDate, "DD/MM/YYYY")
            : null
          : null,
        startTime: activity.startTime
          ? dayjs(activity.startTime, "HH:mm").isValid()
            ? dayjs(activity.startTime, "HH:mm").format("HH:mm")
            : null
          : null,
        endTime: activity.endTime
          ? dayjs(activity.endTime, "HH:mm").isValid()
            ? dayjs(activity.endTime, "HH:mm").format("HH:mm")
            : null
          : null,
        allDay: activity.allDay || false,
        description: activity.description || "",
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
                      label="Fecha de fin (opcional)"
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
                      label="Hora de fin (opcional)"
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
              Guardar cambios
            </Button>
          </Col>
        </Row>
      </Form>
    </Row>
  );
};
