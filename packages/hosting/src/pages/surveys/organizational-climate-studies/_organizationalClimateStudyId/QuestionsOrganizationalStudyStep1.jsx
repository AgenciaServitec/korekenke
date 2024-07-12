import React, { useEffect, useState } from "react";
import { Button, Col, Form, Input, Row, Select } from "../../../../components";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFormUtils } from "../../../../hooks";
import { Surveys } from "../../../../data-list";

export const QuestionsOrganizationalStudyStep1 = ({
  onSetCurrent,
  loading,
  stepData1,
  onSetStepData1,
}) => {
  const schema = yup.object({
    questions: yup.object({
      establishment: yup.string().required(),
      type: yup.number().required(),
      subsector: yup.number().required(),
      ubigeus: yup.number().required(),
      age: yup.number().required(),
      gender: yup.number().required(),
      occupationalGroup: yup.number().required(),
      personal: yup.string().required(),
      condition: yup.number().required(),
      dwellTime: yup.number().required(),
      timeInCurrentPosition: yup.number().required(),
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
        establishment: stepData1?.questions?.establishment || "",
        type: stepData1?.questions?.type || "",
        subsector: stepData1?.questions?.subsector || "",
        ubigeus: stepData1?.questions?.ubigeus || "",
        age: stepData1?.questions?.age || "",
        gender: stepData1?.questions?.gender || "",
        occupationalGroup: stepData1?.questions?.occupationalGroup || "",
        personal: stepData1?.questions?.personal || "",
        condition: stepData1?.questions?.condition || "",
        dwellTime: stepData1?.questions?.dwellTime || "",
        timeInCurrentPosition:
          stepData1?.questions?.timeInCurrentPosition || "",
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
            <Col key={index} span={24} md={12}>
              <Controller
                name={question.code}
                control={control}
                render={({ field: { onChange, value, name } }) => (
                  <Select
                    label={question.label}
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
                  <Input
                    label={question.label}
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
