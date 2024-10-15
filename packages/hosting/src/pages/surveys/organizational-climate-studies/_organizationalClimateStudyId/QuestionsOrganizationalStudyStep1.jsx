import React, { useEffect } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  RadioGroup,
  Row,
  Select,
} from "../../../../components";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFormUtils } from "../../../../hooks";
import { Surveys } from "../../../../data-list";
import { useNavigate } from "react-router";
import { Space } from "antd";

export const QuestionsOrganizationalStudyStep1 = ({
  onSetCurrent,
  loading,
  stepData1,
  onSetStepData1,
}) => {
  const navigate = useNavigate();

  const onGoBack = () => navigate(-1);

  const schema = yup.object({
    questions: yup.object({
      dependencyName: yup.string().required(),
      positionHeld: yup.string().required(),
      dependencyType: yup.string().required(),
      age: yup.number().required(),
      gender: yup.string().required(),
      ocupationalGroup: yup.string().required(),
      condition: yup.string().required(),
      timeWorkingInstitution: yup.number().required(),
      timeWorkingCurrentPosition: yup.number().required(),
      recreationalActivitiesInSixMonths: yup.string().required(),
    }),
  });

  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { required, error } = useFormUtils({ errors, schema });

  useEffect(() => {
    resetForm();
  }, []);

  const resetForm = () => {
    reset({
      questions: {
        dependencyName: stepData1?.questions?.dependencyName || "",
        positionHeld: stepData1?.questions?.positionHeld || "",
        dependencyType: stepData1?.questions?.dependencyType || "",
        age: stepData1?.questions?.age || "",
        gender: stepData1?.questions?.gender || "",
        ocupationalGroup: stepData1?.questions?.ocupationalGroup || "",
        condition: stepData1?.questions?.condition || "",
        timeWorkingInstitution:
          stepData1?.questions?.timeWorkingInstitution || "",
        timeWorkingCurrentPosition:
          stepData1?.questions?.timeWorkingCurrentPosition || "",
        recreationalActivitiesInSixMonths:
          stepData1?.questions?.recreationalActivitiesInSixMonths || "",
      },
    });
  };

  const onSubmitStep1 = (formData) => {
    onSetStepData1(formData);
    onSetCurrent(1);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmitStep1)}>
      <Row gutter={[16, 16]}>
        {Surveys.questions.map((question, index) => {
          return question?.options ? (
            question?.element === "select" ? (
              <Col key={index} span={24} md={12}>
                <Controller
                  name={question.code}
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <Select
                      variant="outlined"
                      label={`${index + 1}. ${question.label}`}
                      name={name}
                      value={value}
                      options={question.options}
                      onChange={onChange}
                      error={error(name)}
                      required={required(name)}
                    />
                  )}
                />
              </Col>
            ) : (
              <Col key={index} span={24} md={12}>
                <Controller
                  name={question.code}
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <RadioGroup
                      variant="outlined"
                      label={`${index + 1}. ${question.label}`}
                      name={name}
                      value={value}
                      options={question.options}
                      onChange={onChange}
                      error={error(name)}
                      required={required(name)}
                    />
                  )}
                />
              </Col>
            )
          ) : (
            <Col key={index} span={24} md={12}>
              <Controller
                name={question.code}
                control={control}
                render={({ field: { onChange, value, name } }) => (
                  <Input
                    variant="outlined"
                    label={`${index + 1}. ${question.label}`}
                    name={name}
                    value={value}
                    onChange={onChange}
                    error={error(name)}
                    required={required(name)}
                  />
                )}
              />
            </Col>
          );
        })}
      </Row>
      <Row justify="end" gutter={[16, 16]}>
        <Col xs={24} sm={6} md={4}>
          <Button size="large" block onClick={onGoBack} loading={loading}>
            Cancelar
          </Button>
        </Col>
        <Col xs={24} sm={6} md={4}>
          <Button
            type="primary"
            size="large"
            block
            htmlType="submit"
            loading={loading}
          >
            Siguiente
          </Button>
        </Col>
      </Row>
    </Form>
  );
};
