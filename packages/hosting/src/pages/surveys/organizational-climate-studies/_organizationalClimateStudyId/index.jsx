import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Steps,
  Title,
  notification,
} from "../../../../components";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDefaultFirestoreProps, useFormUtils } from "../../../../hooks";
import { Surveys } from "../../../../data-list";
import { firestore } from "../../../../firebase";
import { getOrganizationalClimateStudyId } from "../../../../firebase/collections/organizationalClimateStudies";

export const OrganizationalClimateStudyIntegration = () => {
  const { assignCreateProps } = useDefaultFirestoreProps();
  const [loading, setLoading] = useState(false);

  const mapForm = (formData, organizationalClimateStudyId) => ({
    id: organizationalClimateStudyId,
    questions: {
      ...formData.questions,
    },
    items: {
      ...formData.items,
    },
  });

  const saveOrganizationalClimateStudies = async (formData) => {
    try {
      setLoading(true);
      console.log(mapForm(formData));

      const organizationalClimateStudyId = getOrganizationalClimateStudyId();

      await firestore
        .collection("organizational-climate-studies-surveys")
        .doc(organizationalClimateStudyId)
        .set(
          assignCreateProps(mapForm(formData, organizationalClimateStudyId))
        );

      notification({ type: "success" });
    } catch (e) {
      console.error("ErrorSaveOrganizationalClimateStudiesSurveys: ", e);
      notification({ type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row>
      <Col span={24}>
        <Title level={2}>
          Cuestionario para el estudio del Clima Organizacional
        </Title>
      </Col>
      <Col span={24}>
        <OrganizationalClimateStudies
          onSaveOrganizationalClimateStudies={saveOrganizationalClimateStudies}
          loading={loading}
        />
      </Col>
    </Row>
  );
};

const OrganizationalClimateStudies = ({
  onSaveOrganizationalClimateStudies,
  loading,
}) => {
  const schema = yup.object({
    questions: yup.object({
      establishment: yup.string().required(),
      type: yup.string().required(),
      subsector: yup.string().required(),
      ubigeus: yup.string().required(),
      age: yup.string().required(),
      gender: yup.string().required(),
      occupationalGroup: yup.string().required(),
      profession: yup.string().required(),
      condition: yup.string().required(),
      dwellTime: yup.string().required(),
      timeInCurrentPosition: yup.string().required(),
    }),
    items: yup.object({
      item1: yup.number(),
      item2: yup.number(),
      item3: yup.number(),
      item4: yup.number(),
      item5: yup.number(),
      item6: yup.number(),
      item7: yup.number(),
      item8: yup.number(),
      item9: yup.number(),
      item10: yup.number(),
      item11: yup.number(),
      item12: yup.number(),
      item13: yup.number(),
      item14: yup.number(),
      item15: yup.number(),
      item16: yup.number(),
      item17: yup.number(),
      item18: yup.number(),
      item19: yup.number(),
      item20: yup.number(),
      item21: yup.number(),
      item22: yup.number(),
      item23: yup.number(),
      item24: yup.number(),
      item25: yup.number(),
      item26: yup.number(),
      item27: yup.number(),
      item28: yup.number(),
      item29: yup.number(),
      item30: yup.number(),
      item31: yup.number(),
      item32: yup.number(),
      item33: yup.number(),
      item34: yup.number(),
    }),
  });

  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      isHeadline: true,
    },
  });

  const { required, error } = useFormUtils({ errors, schema });

  useEffect(() => {
    resetForm();
  }, []);

  const resetForm = () => {
    reset({
      questions: {
        establishment: "",
        type: "",
        subsector: "",
        ubigeus: "",
        age: "",
        gender: "",
        occupationalGroup: "",
        profession: "",
        condition: "",
        dwellTime: "",
        timeInCurrentPosition: "",
      },
      items: {
        item1: "",
        item2: "",
        item3: "",
        item4: "",
        item5: "",
        item6: "",
        item7: "",
        item8: "",
        item9: "",
        item10: "",
        item11: "",
        item12: "",
        item13: "",
        item14: "",
        item15: "",
        item16: "",
        item17: "",
        item18: "",
        item19: "",
        item20: "",
        item21: "",
        item22: "",
        item23: "",
        item24: "",
        item25: "",
        item26: "",
        item27: "",
        item28: "",
        item29: "",
        item30: "",
        item31: "",
        item32: "",
        item33: "",
        item34: "",
      },
    });
  };

  const [current, setCurrent] = useState(0);

  const steps = [
    {
      title: "Preguntas",
      content: (
        <QuestionsOrganizationalStudies
          control={control}
          error={error}
          required={required}
        />
      ),
    },
    {
      title: "Items",
      content: (
        <ItemsOrganizationalStudies
          control={control}
          error={error}
          required={required}
        />
      ),
    },
  ];

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  const onSubmit = (formData) => onSaveOrganizationalClimateStudies(formData);

  return (
    <>
      <Steps current={current} items={items} />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row gutter={[16, 16]}>{steps[current].content}</Row>
        <Row justify="space-between" gutter={[16, 16]}>
          {current > 0 && (
            <Col xs={24} sm={6} md={4}>
              <Button
                type="primary"
                size="large"
                block
                onClick={() => setCurrent(current - 1)}
              >
                Atrás
              </Button>
            </Col>
          )}
          {current < steps.length - 1 && (
            <Col xs={24} sm={6} md={4}>
              <Button
                type="primary"
                size="large"
                block
                onClick={() => setCurrent(current + 1)}
              >
                Siguiente
              </Button>
            </Col>
          )}

          {current > 0 && (
            <Col xs={24} sm={6} md={4}>
              <Button
                type="primary"
                size="large"
                block
                htmlType="submit"
                loading={loading}
              >
                Guardar
              </Button>
            </Col>
          )}
        </Row>
      </Form>
    </>
  );
};

const QuestionsOrganizationalStudies = ({ control, error, required }) => {
  return Surveys.questions.map((question, index) => {
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
  });
};

const ItemsOrganizationalStudies = ({ control, error, required }) => {
  return Surveys.items.options.map((option, index) => (
    <Col key={index} span={24} md={12}>
      <Controller
        name={option.code}
        control={control}
        render={({ field: { onChange, value, name } }) => (
          <Select
            variant="outlined"
            label={option.label}
            name={name}
            value={value}
            options={Surveys.items.responses}
            onChange={onChange}
            error={error(name)}
            required={required(name)}
          />
        )}
      />
    </Col>
  ));
};