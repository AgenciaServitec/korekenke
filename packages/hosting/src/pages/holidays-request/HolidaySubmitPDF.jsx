import React, { useEffect } from "react";
import { Form, Row, Col, Upload, Button, notification } from "../../components";
import { useDefaultFirestoreProps, useFormUtils } from "../../hooks";
import { Controller, useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import * as yup from "yup";
import { updateHoliday } from "../../firebase/collections/holidays";

export const HolidaySubmitPdf = ({ holidayRequest, onCloseModal }) => {
  const { assignUpdateProps } = useDefaultFirestoreProps();

  const schema = yup.object({
    document: yup.mixed(),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { error, errorMessage, required } = useFormUtils({ errors, schema });

  const resetForm = () => {
    reset({
      document: holidayRequest?.document || null,
    });
  };

  useEffect(() => {
    resetForm();
  }, []);

  const onSubmit = async (formData) => {
    const updatedHolidayRequest = {
      ...holidayRequest,
      document: formData.document || null,
    };

    try {
      await updateHoliday(
        holidayRequest.id,
        assignUpdateProps(updatedHolidayRequest),
      );
      notification({ type: "success" });
    } catch (err) {
      notification({ type: "error" });
      console.error("Error: ", err);
    }
    onCloseModal();
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Controller
            control={control}
            name="document"
            render={({ field: { onChange, value, name } }) => (
              <Upload
                isImage={false}
                label="Subir PDF"
                accept="application/pdf"
                value={value}
                name={name}
                fileName={`documento-${uuidv4()}`}
                onChange={(file) => onChange(file)}
                error={error(name)}
              />
            )}
          />
        </Col>
      </Row>
      <Row justify="end" gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Button type="primary" size="large" block htmlType="submit">
            Guardar
          </Button>
        </Col>
      </Row>
    </Form>
  );
};
