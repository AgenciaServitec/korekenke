import React, { useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button, Col, Form, notification, Row, Upload } from "../../components";
import { Controller, useForm } from "react-hook-form";
import { useFormUtils } from "../../hooks";
import { useAuthentication } from "../../providers";
import { assign } from "lodash";
import {
  apiErrorNotification,
  getApiErrorResponse,
  useApiUserPut,
} from "../../api";
import { v4 as uuidv4 } from "uuid";

export const ProfileImagesForm = () => {
  const { authUser } = useAuthentication();
  const { putUser, putUserLoading, putUserResponse } = useApiUserPut();

  const schema = yup.object({
    cipPhoto: yup.mixed(),
    dniPhoto: yup.mixed(),
    signaturePhoto: yup.mixed(),
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { error, required } = useFormUtils({ errors, schema });

  const updateProfile = async (formData) => {
    try {
      const response = await putUser(
        assign({}, formData, {
          id: authUser.id,
          phone: authUser.phone,
          email: authUser.email,
          cipPhoto: formData?.cipPhoto || null,
          dniPhoto: formData?.dniPhoto || null,
          signaturePhoto: formData?.signaturePhoto || null,
        })
      );

      if (!putUserResponse.ok) {
        throw new Error(response);
      }

      notification({ type: "success" });
    } catch (e) {
      const errorResponse = await getApiErrorResponse(e);
      apiErrorNotification(errorResponse);
    }
  };

  useEffect(() => {
    resetForm();
  }, [authUser]);

  const resetForm = () => {
    reset({
      cipPhoto: authUser?.cipPhoto || null,
      dniPhoto: authUser?.dniPhoto || null,
      signaturePhoto: authUser?.signaturePhoto || null,
    });
  };

  const onSubmit = async (formData) => {
    await updateProfile(formData);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row justify="end" gutter={[16, 16]}>
        <Col xs={24} sm={12} md={12}>
          <Controller
            control={control}
            name="cipPhoto"
            render={({ field: { onChange, value, onBlur, name } }) => (
              <Upload
                label="Foto de CIP"
                resize="423x304"
                buttonText="Subir foto"
                value={value}
                name={name}
                fileName={`cip-foto-${uuidv4()}`}
                filePath={`users/${authUser.id}/documents`}
                onChange={(file) => onChange(file)}
                required={required(name)}
                error={error(name)}
              />
            )}
          />
        </Col>
        <Col xs={24} sm={12} md={12}>
          <Controller
            control={control}
            name="dniPhoto"
            render={({ field: { onChange, value, onBlur, name } }) => (
              <Upload
                label="Foto de DNI"
                accept="image/*"
                resize="423x304"
                buttonText="Subir foto"
                value={value}
                name={name}
                fileName={`dni-foto-${uuidv4()}`}
                filePath={`users/${authUser.id}/documents`}
                onChange={(file) => onChange(file)}
                required={required(name)}
                error={error(name)}
              />
            )}
          />
        </Col>
        <Col span={24}>
          <Controller
            control={control}
            name="signaturePhoto"
            render={({ field: { onChange, value, onBlur, name } }) => (
              <Upload
                label="Foto de firma"
                resize="423x304"
                buttonText="Subir foto"
                value={value}
                name={name}
                fileName={`signature-foto-${uuidv4()}`}
                filePath={`users/${authUser.id}/documents`}
                onChange={(file) => onChange(file)}
                required={required(name)}
                error={error(name)}
              />
            )}
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Button
            type="primary"
            size="large"
            block
            htmlType="submit"
            loading={putUserLoading}
          >
            Guardar
          </Button>
        </Col>
      </Row>
    </Form>
  );
};
