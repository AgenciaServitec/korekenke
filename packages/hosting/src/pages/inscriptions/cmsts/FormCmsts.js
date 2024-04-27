import React, { useEffect } from "react";
import { Button, DatePicker, Form, Input, Select } from "../../../components";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import Title from "antd/lib/typography/Title";
import { Controller, useForm } from "react-hook-form";
import { useAuthentication } from "../../../providers";

export const FormCmsts = () => {
  const { authUser } = useAuthentication();

  console.log(authUser);

  const { control, reset } = useForm({
    defaultValues: {
      active: false,
    },
  });

//   useEffect(() => {
//     resetForm();
//   }, []);

//   const resetForm = () => {
//     reset({
//       fullName: correspondence?.destination || "",
//       cip: correspondence?.receivedBy || "",
//       dni: correspondence?.class || "",
//       civilStatus: correspondence?.indicative || "",
//       gender: correspondence?.classification || "",
//       placeBirth: correspondence?.issue || "",
//       birthdate: correspondence?.dateCorrespondence || "",
//       houseLocation: correspondence?.photos || null,
//       urbanization: correspondence?.documents || null,
//       address: correspondence?.documents || null,
//       emergencyCellPhone: correspondence?.documents || null,
//     });
//   };

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Title level={2}>
          Circulo Militar de Superiores tecnicos y sub oficiales
        </Title>
      </Col>
      <Col span={24}>
        <Form>
          <Row gutter={[16, 16]}>
            <Col span={24} md={6}>
              <Controller
                name="fullname"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, name } }) => (
                  <Input
                    label="Nombres y Apellidos"
                    name={name}
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
            </Col>
            <Col span={24} md={6}>
              <Controller
                name="cip"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, name } }) => (
                  <Input
                    label="CIP"
                    name={name}
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
            </Col>
            <Col span={24} md={6}>
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
                  />
                )}
              />
            </Col>
            <Col span={24} md={6}>
              <Controller
                name="civilStatus"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, name } }) => (
                  <Select
                    label="Estado Civil"
                    defaultValue=""
                    onChange={onchange}
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
                defaultValue=""
                render={({ field: { onChange, value, name } }) => (
                  <Select
                    label="Género"
                    defaultValue=""
                    onChange={onchange}
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
                defaultValue=""
                render={({ field: { onChange, value, name } }) => (
                  <Select
                    label="Ubigeo de Nacimiento"
                    defaultValue=""
                    onChange={onchange}
                    options={[
                      {
                        value: "lima",
                        label: "Lima",
                      },
                      {
                        value: "cusco",
                        label: "Cusco",
                      },
                    ]}
                  />
                )}
              />
            </Col>
            <Col span={24} md={4}>
              <Controller
                name="birthdate"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, name } }) => (
                  <DatePicker
                    label="Fecha de Nacimiento"
                    name={name}
                    value={value}
                    onChange={onchange}
                  />
                )}
              />
            </Col>
            <Col span={24} md={8}>
              <Controller
                name="houseLocation"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, name } }) => (
                  <Select
                    label="Ubigeo de Vivienda"
                    defaultValue=""
                    onChange={onchange}
                    options={[
                      {
                        value: "lima",
                        label: "Lima",
                      },
                      {
                        value: "cusco",
                        label: "Cusco",
                      },
                    ]}
                  />
                )}
              />
            </Col>
            <Col span={24} md={8}>
              <Controller
                name="urbanization"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, name } }) => (
                  <Input
                    label="Urbanización"
                    name={name}
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
            </Col>
            <Col span={24} md={8}>
              <Controller
                name="address"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, name } }) => (
                  <Input
                    label="Dirección"
                    name={name}
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
            </Col>
            <Col span={24} md={8}>
              <Controller
                name="emergencyCellPhone"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, name } }) => (
                  <Input
                    label="Celular de Emergencia"
                    name={name}
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
            </Col>
          </Row>
          <Row justify="end" gutter={[16, 16]}>
            <Col xs={24} sm={6} md={4}>
              <Button type="default" size="large" block>
                Cancelar
              </Button>
            </Col>
            <Col xs={24} sm={6} md={4}>
              <Button type="primary" size="large" block htmlType="submit">
                Enviar
              </Button>
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  );
};
