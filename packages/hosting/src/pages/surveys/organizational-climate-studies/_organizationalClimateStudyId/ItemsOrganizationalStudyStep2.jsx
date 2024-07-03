import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  RadioGroup,
  Row,
  Select,
  Steps,
  Title,
  notification,
} from "../../../../components";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFormUtils } from "../../../../hooks";
import { Surveys } from "../../../../data-list";

export const ItemsOrganizationalStudyStep2 = ({
  current,
  onSetCurrent,
  loading,
  onSubmit,
}) => {
  const schema = yup.object({
    items: yup.object({
      item1: yup.number().required(),
      item2: yup.number().required(),
      item3: yup.number().required(),
      item4: yup.number().required(),
      item5: yup.number().required(),
      item6: yup.number().required(),
      item7: yup.number().required(),
      item8: yup.number().required(),
      item9: yup.number().required(),
      item10: yup.number().required(),
      item11: yup.number().required(),
      item12: yup.number().required(),
      item13: yup.number().required(),
      item14: yup.number().required(),
      item15: yup.number().required(),
      item16: yup.number().required(),
      item17: yup.number().required(),
      item18: yup.number().required(),
      item19: yup.number().required(),
      item20: yup.number().required(),
      item21: yup.number().required(),
      item22: yup.number().required(),
      item23: yup.number().required(),
      item24: yup.number().required(),
      item25: yup.number().required(),
      item26: yup.number().required(),
      item27: yup.number().required(),
      item28: yup.number().required(),
      item29: yup.number().required(),
      item30: yup.number().required(),
      item31: yup.number().required(),
      item32: yup.number().required(),
      item33: yup.number().required(),
      item34: yup.number().required(),
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

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row gutter={[16, 16]}>
        {Surveys.items.options.map((option, index) => (
          <Col key={index} span={24} md={12}>
            <Controller
              name={option.code}
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <RadioGroup
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
        ))}
      </Row>
      <Row justify="space-between" gutter={[16, 16]}>
        <Col xs={24} sm={6} md={4}>
          <Button
            type="primary"
            size="large"
            block
            onClick={() => onSetCurrent(current - 1)}
          >
            Atrás
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
            Guardar
          </Button>
        </Col>
      </Row>
    </Form>
  );
};
