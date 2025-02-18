import React, { useEffect } from "react";
import {
  Acl,
  Button,
  Col,
  DatePicker,
  Form,
  IconAction,
  Input,
  InputNumber,
  notification,
  Row,
  Select,
  Space,
} from "../../../../../components";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { useAuthentication } from "../../../../../providers";
import { assign } from "lodash";
import { useFormUtils } from "../../../../../hooks";
import { useApiUserPut } from "../../../../../api";
import dayjs from "dayjs";
import { yupResolver } from "@hookform/resolvers/yup";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import { UbigeosPeru } from "../../../../../data-list";
import { DATE_FORMAT_TO_FIRESTORE } from "../../../../../firebase/firestore";

export const CmstsForm = ({ cmstsEnrollment }) => {
  const { authUser } = useAuthentication();
  const navigate = useNavigate();

  const { putUser, putUserResponse, putUserLoading } = useApiUserPut();

  const findPlaceByUbigeo = (ubigeo) =>
    UbigeosPeru.find((ubigeoPeru) => ubigeoPeru.ubigeo === ubigeo) || null;

  const mapUser = (formData) =>
    assign({}, formData, {
      id: authUser.id,
      email: authUser.email,
      phone: authUser.phone,
      birthdate: dayjs(formData.birthdate).format(DATE_FORMAT_TO_FIRESTORE),
      placeBirth: findPlaceByUbigeo(formData.placeBirth),
      houseLocation: findPlaceByUbigeo(formData.houseLocation),
      emergencyCellPhone: {
        number: formData.emergencyCellPhone,
        prefix: "+51",
      },
    });

  const onUpdateCmstsUser = async (formData) => {
    try {
      const user = mapUser(formData);

      await putUser(user);

      if (!putUserResponse.ok) {
        throw new Error(JSON.stringify(putUserResponse));
      }

      notification({ type: "success" });
    } catch (e) {
      console.log("ErrorUpdateUser: ", e);
      notification({ type: "error" });
    }
  };

  const schema = yup.object({
    firstName: yup.string().required(),
    paternalSurname: yup.string().required(),
    maternalSurname: yup.string().required(),
    cip: yup.string().min(9).max(9).required(),
    dni: yup.string().min(8).max(8).required(),
    civilStatus: yup.string().required(),
    gender: yup.string().required(),
    placeBirth: yup.string().required(),
    birthdate: yup.date().required(),
    houseLocation: yup.string().required(),
    urbanization: yup.string().required(),
    address: yup.string().required(),
    emergencyCellPhone: yup.string().min(9).max(9).required(),
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
  }, [authUser]);

  const resetForm = () => {
    reset({
      firstName: authUser?.firstName || "",
      paternalSurname: authUser?.paternalSurname || "",
      maternalSurname: authUser?.maternalSurname || "",
      cip: authUser?.cip || "",
      dni: authUser?.dni || "",
      civilStatus: authUser?.civilStatus || "",
      gender: authUser?.gender || "",
      placeBirth: authUser?.placeBirth?.ubigeo || null,
      birthdate: authUser?.birthdate
        ? dayjs(authUser.birthdate, DATE_FORMAT_TO_FIRESTORE)
        : undefined,
      houseLocation: authUser?.houseLocation?.ubigeo || null,
      urbanization: authUser?.urbanization || "",
      address: authUser?.address || "",
      emergencyCellPhone: authUser?.emergencyCellPhone?.number || "",
    });
  };

  const onNavigateTo = (pathName) => navigate(pathName);

  const ubigeos = UbigeosPeru.map((ubigeoPeru) => ({
    label: `${ubigeoPeru.department} - ${ubigeoPeru.province} - ${ubigeoPeru.district}`,
    value: ubigeoPeru.ubigeo,
  }));

  const onSubmit = (formData) => onUpdateCmstsUser(formData);

  return (
    <Row gutter={[16, 16]}>
      <Col sm={24}>
        <Space
          align="middle"
          style={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
          }}
        >
          <Acl
            category="jefatura-de-bienestar-del-ejercito"
            subCategory="inscriptions"
            name="/inscriptions/cmsts/sheet/:cmstsEnrollmentId"
          >
            <IconAction
              className="pointer"
              onClick={() => onNavigateTo(`sheet/${cmstsEnrollment.id}`)}
              styled={{ color: (theme) => theme.colors.error }}
              icon={faFilePdf}
            />
          </Acl>
        </Space>
      </Col>
      <Col span={24}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row gutter={[16, 16]}>
            <Col span={24} md={8}>
              <Controller
                name="firstName"
                control={control}
                render={({ field: { onChange, value, name } }) => (
                  <Input
                    label="Nombres"
                    name={name}
                    value={value}
                    onChange={onChange}
                    error={error(name)}
                    required={required(name)}
                  />
                )}
              />
            </Col>
            <Col span={24} md={8}>
              <Controller
                name="paternalSurname"
                control={control}
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
            <Col span={24} md={8}>
              <Controller
                name="maternalSurname"
                control={control}
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
            <Col span={24} md={8}>
              <Controller
                name="cip"
                control={control}
                render={({ field: { onChange, value, name } }) => (
                  <Input
                    label="CIP"
                    name={name}
                    value={value}
                    onChange={onChange}
                    error={error(name)}
                    required={required(name)}
                  />
                )}
              />
            </Col>
            <Col span={24} md={8}>
              <Controller
                name="dni"
                control={control}
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
            <Col span={24} md={8}>
              <Controller
                name="civilStatus"
                control={control}
                render={({ field: { onChange, value, name } }) => (
                  <Select
                    label="Estado Civil"
                    value={value}
                    onChange={onChange}
                    error={error(name)}
                    required={required(name)}
                    options={[
                      {
                        value: "single",
                        label: "Soltero",
                      },
                      {
                        value: "married",
                        label: "Casado",
                      },
                      {
                        value: "widower",
                        label: "Viudo",
                      },
                      {
                        value: "divorced",
                        label: "Divorciado",
                      },
                      {
                        value: "separate",
                        label: "Separado",
                      },
                      {
                        value: "cohabitant",
                        label: "Conviviente",
                      },
                    ]}
                  />
                )}
              />
            </Col>
            <Col span={24} md={4}>
              <Controller
                name="gender"
                control={control}
                render={({ field: { onChange, value, name } }) => (
                  <Select
                    label="Género"
                    value={value}
                    onChange={onChange}
                    error={error(name)}
                    required={required(name)}
                    options={[
                      {
                        value: "male",
                        label: "Masculino",
                      },
                      {
                        value: "female",
                        label: "Femenino",
                      },
                    ]}
                  />
                )}
              />
            </Col>
            <Col span={24} md={8}>
              <Controller
                name="placeBirth"
                control={control}
                render={({ field: { onChange, value, name } }) => (
                  <Select
                    label="Ubigeo de Nacimiento"
                    value={value}
                    onChange={onChange}
                    error={error(name)}
                    required={required(name)}
                    options={ubigeos}
                  />
                )}
              />
            </Col>
            <Col span={24} md={4}>
              <Controller
                name="birthdate"
                control={control}
                render={({ field: { onChange, value, name } }) => (
                  <DatePicker
                    label="Fecha de Nacimiento"
                    name={name}
                    value={value}
                    onChange={onChange}
                    error={error(name)}
                    required={required(name)}
                  />
                )}
              />
            </Col>
            <Col span={24} md={8}>
              <Controller
                name="houseLocation"
                control={control}
                render={({ field: { onChange, value, name } }) => (
                  <Select
                    label="Ubigeo de Vivienda"
                    value={value}
                    onChange={onChange}
                    error={error(name)}
                    required={required(name)}
                    options={ubigeos}
                  />
                )}
              />
            </Col>
            <Col span={24} md={8}>
              <Controller
                name="urbanization"
                control={control}
                render={({ field: { onChange, value, name } }) => (
                  <Input
                    label="Urbanización"
                    name={name}
                    value={value}
                    onChange={onChange}
                    error={error(name)}
                    required={required(name)}
                  />
                )}
              />
            </Col>
            <Col span={24} md={8}>
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
            <Col span={24} md={8}>
              <Controller
                name="emergencyCellPhone"
                control={control}
                render={({ field: { onChange, value, name } }) => (
                  <InputNumber
                    label="Celular de Emergencia"
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
            <Col xs={24} sm={24} md={10} lg={6}>
              <Button
                type="primary"
                size="large"
                block
                htmlType="submit"
                loading={putUserLoading}
              >
                Guardar mi informacion personal
              </Button>
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  );
};
