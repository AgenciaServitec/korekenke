import React from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import { Button, Form, Upload } from "../../components";
import { useForm, Controller } from "react-hook-form";

export const ProfileImagesForm = () => {
  const schema = yup.object({
    dniPhoto: yup.mixed(),
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onHandleSubmit = (e) => {
    e.preventDefault();
    console.log(e.target);
  };

  const handleOnChange = (e) => {
    console.log(e);
  };

  return (
    <Form onSubmit={handleSubmit(onHandleSubmit)}>
      <Row></Row>
      <Row justify="end" gutter={[16, 16]}>
        <Col xs={24} sm={12} md={12}>
          <Controller
            control={control}
            name="dniPhoto"
            render={({ field: { onChange, value, onBlur, name } }) => (
              <Upload
                label="Foto de DNI"
                accept="image/*"
                resize="400x400"
                buttonText="Subir foto"
                onChange={(file) => onChange(file)}
                value={value}
                name={name}
              />
            )}
          />
        </Col>
        <Col xs={24} sm={12} md={12}>
          <Upload label="Foto de CIP" onChange={handleOnChange} />
        </Col>
        <Col span={24}>
          <Upload label="Foto de Firma" onChange={handleOnChange} />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Button type="primary" size="large" block htmlType="submit">
            Guardar
          </Button>
        </Col>
      </Row>
    </Form>
  );
};
