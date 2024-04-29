import React from "react";
import { Col, Row } from "antd/lib";
import {
  Button,
  Form,
  Input,
  modalConfirm,
  notification,
  Select,
} from "../../../components";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useFormUtils } from "../../../hooks";
import { useApiUserPut } from "../../../api";
import { assign } from "lodash";
import { useAuthentication } from "../../../providers";
import { CmstsTable } from "./CmstsTable";

export const CmstsFamilyForm = () => {
  const { authUser } = useAuthentication();
  const { putUser, putUserResponse, putUserLoading } = useApiUserPut();

  const mapUserToApi = (formData) => {
    console.log(authUser?.familyMembers || []);

    return assign(
      {},
      {
        id: authUser.id,
        email: authUser.email,
        phone: authUser.phone,
        familyMembers: [
          ...(authUser?.familyMembers || []),
          { ...formData, id: formData.dni },
        ],
      }
    );
  };

  const exitsFamilyMember = (dni) =>
    !!(authUser?.familyMembers || []).find(
      (familyMember) => familyMember?.dni === dni
    );

  const onSubmitSaveFamilyUser = async (formData) => {
    try {
      const familyMember = exitsFamilyMember(formData.dni);

      if (familyMember)
        return notification({
          type: "warning",
          title: "El DNI ya esta registrado.",
        });

      const user = mapUserToApi(formData);

      await putUser(user);

      if (!putUserResponse.ok) {
        throw new Error(JSON.stringify(putUserResponse));
      }

      notification({ type: "success" });
      clearForm();
    } catch (e) {
      console.log("ErrorUpdateUser: ", e);
      notification({ type: "error" });
    }
  };

  const schema = yup.object({
    firstName: yup.string().required(),
    paternalSurname: yup.string().required(),
    maternalSurname: yup.string().required(),
    relationship: yup.string().required(),
    age: yup.number().required(),
    cciiffs: yup.string().required(),
    dni: yup.string().min(8).max(8).required(),
  });

  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const clearForm = () =>
    reset({
      firstName: "",
      paternalSurname: "",
      maternalSurname: "",
      relationship: "",
      age: "",
      cciiffs: "",
      dni: "",
    });

  const { required, error } = useFormUtils({ errors, schema });

  const onConfirmFamilyMember = (dni) =>
    modalConfirm({
      title: "¿Estás seguro de que quieres eliminar este familiar?",
      onOk: () => deleteFamilyMember(dni),
    });

  const deleteFamilyMember = async (dni) => {
    try {
      const familyMembers = authUser.familyMembers.filter(
        (familyMember) => familyMember.dni !== dni
      );

      const user = assign(
        {},
        {
          id: authUser.id,
          email: authUser.email,
          phone: authUser.phone,
          familyMembers: familyMembers,
        }
      );

      await putUser(user);

      notification({ type: "success" });
    } catch (e) {
      console.log("ErrorUpdateUser: ", e);
      notification({ type: "error" });
    }
  };

  const onSubmit = (formData) => onSubmitSaveFamilyUser(formData);

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row gutter={[16, 16]}>
            <Col span={24} md={4}>
              <Controller
                name="firstName"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, name } }) => (
                  <Input
                    label="Nombres del Familiar"
                    name={name}
                    value={value}
                    onChange={onChange}
                    error={error(name)}
                    required={required(name)}
                  />
                )}
              />
            </Col>
            <Col span={24} md={4}>
              <Controller
                name="paternalSurname"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, name } }) => (
                  <Input
                    label="Apellido Paterno"
                    name={name}
                    value={value}
                    onChange={onChange}
                    error={error(name)}
                    required={required(name)}
                  />
                )}
              />
            </Col>
            <Col span={24} md={4}>
              <Controller
                name="maternalSurname"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, name } }) => (
                  <Input
                    label="Apellido Materno"
                    name={name}
                    value={value}
                    onChange={onChange}
                    error={error(name)}
                    required={required(name)}
                  />
                )}
              />
            </Col>
            <Col span={24} md={3}>
              <Controller
                name="relationship"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, name } }) => (
                  <Select
                    label="Parentesco"
                    defaultValue=""
                    value={value}
                    onChange={onChange}
                    error={error(name)}
                    required={required(name)}
                    options={[
                      {
                        value: "son",
                        label: "Hijo (a)",
                      },
                      {
                        value: "husband",
                        label: "Esposo (a)",
                      },
                      {
                        value: "brother",
                        label: "Hermano (a)",
                      },
                    ]}
                  />
                )}
              />
            </Col>
            <Col span={24} md={2}>
              <Controller
                name="age"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, name } }) => (
                  <Input
                    label="Edad"
                    name={name}
                    value={value}
                    onChange={onChange}
                    error={error(name)}
                    required={required(name)}
                  />
                )}
              />
            </Col>
            <Col span={24} md={3}>
              <Controller
                name="cciiffs"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, name } }) => (
                  <Input
                    label="CCIIFFS"
                    name={name}
                    value={value}
                    onChange={onChange}
                    error={error(name)}
                    required={required(name)}
                  />
                )}
              />
            </Col>
            <Col span={24} md={4}>
              <Controller
                name="dni"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, name } }) => (
                  <Input
                    label="DNI"
                    name={name}
                    value={value}
                    onChange={onChange}
                    error={error(name)}
                    required={required(name)}
                  />
                )}
              />
            </Col>
          </Row>
          <Row justify="end" gutter={[16, 16]}>
            <Col xs={24} sm={6} md={4}>
              <Button
                type="primary"
                size="large"
                block
                htmlType="submit"
                loading={putUserLoading}
              >
                Añadir Familiar
              </Button>
            </Col>
          </Row>
        </Form>
      </Col>
      <Col span={24}>
        <CmstsTable onDeleteFamilyMember={onConfirmFamilyMember} />
      </Col>
    </Row>
  );
};
