import React, { useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import { Button, Form, notification, Upload } from "../../components";
import { Controller, useForm } from "react-hook-form";
import { useFormUtils } from "../../hooks";
import { useAuthentication } from "../../providers";
import { assign } from "lodash";
import { ApiErrors } from "../../data-list";
import { useApiUserPut } from "../../api";

export const ProfileImagesForm = () => {
  const { authUser } = useAuthentication();
  const { putUser, putUserLoading, putUserResponse } = useApiUserPut();

  const schema = yup.object({
    dniPhoto: yup.mixed().required(),
    cipPhoto: yup.mixed().required(),
    signaturePhoto: yup.mixed().required(),
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
      await putUser(
        assign({}, formData, {
          id: authUser.id,
          phone: authUser.phone,
          email: authUser.email,
        })
      );

      if (!putUserResponse.ok) {
        throw new Error(JSON.stringify(putUserResponse));
      }

      notification({ type: "success" });
    } catch (e) {
      console.log("ErrorUpdateUserImages: ", e);
      const errorParse = JSON.parse(e.message);

      ApiErrors?.[errorParse.data]
        ? notification({ type: "warning", title: ApiErrors[errorParse.data] })
        : notification({ type: "error" });
    }
  };

  useEffect(() => {
    resetForm();
  }, [authUser]);

  const resetForm = () => {
    reset({
      dniPhoto: authUser?.dniPhoto || null,
      cipPhoto: authUser?.cipPhoto || null,
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
            name="dniPhoto"
            render={({ field: { onChange, value, onBlur, name } }) => (
              <Upload
                label="Foto de DNI"
                accept="image/*"
                resize="423x304"
                buttonText="Subir foto"
                value={value}
                name={name}
                filePath={`users/${authUser.id}/documents`}
                fileName="dni-photo"
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
            name="cipPhoto"
            render={({ field: { onChange, value, onBlur, name } }) => (
              <Upload
                label="Foto de CIP"
                resize="423x304"
                buttonText="Subir foto"
                value={value}
                name={name}
                filePath={`users/${authUser.id}/documents`}
                fileName="cip-photo"
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
                filePath={`users/${authUser.id}/documents`}
                fileName="signature-photo"
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
