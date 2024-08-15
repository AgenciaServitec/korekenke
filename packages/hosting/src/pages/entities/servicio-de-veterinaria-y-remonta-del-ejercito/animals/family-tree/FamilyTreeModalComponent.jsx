import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { useFormUtils } from "../../../../../hooks";
import {
  Button,
  Col,
  DataEntryModal,
  Form,
  Input,
  Radio,
  Row,
} from "../../../../../components";
import styled from "styled-components";

export const FamilyTreeModalComponent = ({
  animal,
  registrationNumber,
  isVisibleModal,
  onSetIsVisibleModal,
}) => {
  const [relationship, setRelationship] = useState("father");

  const parentsView = (parents) =>
    (parent?.parents || []).map((_parent) => {
      if (_parent.registrationNumber === registrationNumber) return _parent;
      return parentsView(_parent.parents);
    });

  const animalView = (animal) =>
    (animal?.parents || []).find((parent) => {
      if (parent.registrationNumber === registrationNumber) return parent;
      return parentsView(parent.parents);
    });

  useEffect(() => {
    animalView(animal);
  }, []);

  console.log("Animal: ", animal);
  console.log(animalView(animal));

  return (
    <FamilyTreeModal
      isVisibleModal={isVisibleModal}
      onSetIsVisibleModal={onSetIsVisibleModal}
      relationship={relationship}
      onSetRelationship={setRelationship}
    />
  );
};

const FamilyTreeModal = ({
  animal,
  isVisibleModal,
  onSetIsVisibleModal,
  relationship,
  onSetRelationship,
}) => {
  const schema = yup.object({
    fatherFullName: yup.string(),
    fatherRegistrationNumber: yup.string(),
    fatherRaceOrLine: yup.string(),
    motherFullName: yup.string(),
    motherRegistrationNumber: yup.string(),
    motherRaceOrLine: yup.string(),
  });

  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { required, error, errorMessage } = useFormUtils({ errors, schema });

  useEffect(() => {
    resetForm();
  }, []);

  const resetForm = () => {
    reset({
      fatherFullName: animal?.fatherFullName || "",
      fatherRegistrationNumber: animal?.fatherRegistrationNumber || "",
      fatherRaceOrLine: animal?.fatherRaceOrLine || "",
      motherFullName: animal?.motherFullName || "",
      motherRegistrationNumber: animal?.motherRegistrationNumber || "",
      motherRaceOrLine: animal?.motherRaceOrLine || "",
    });
  };

  return (
    <DataEntryModal
      title="Datos del familiar"
      visible={isVisibleModal}
      onCancel={() => onSetIsVisibleModal(false)}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Container>
            <span>
              Información{" "}
              {relationship === "father" ? "del Padre" : "de la Madre"}
            </span>
            <Radio.Group
              key={""}
              onChange={(e) => onSetRelationship(e.target.value)}
              defaultValue={relationship}
              buttonStyle="solid"
            >
              <Radio.Button value="father">Padre</Radio.Button>
              <Radio.Button value="mother">Madre</Radio.Button>
            </Radio.Group>
          </Container>
        </Col>
        <Col span={24}>
          <Form handleSubmit={""}>
            <Row gutter={[16, 16]}>
              {relationship === "father" ? (
                <>
                  <Col span={24}>
                    <Controller
                      name="fatherFullName"
                      control={control}
                      defaultValue=""
                      render={({ field: { onChange, value, name } }) => (
                        <Input
                          label="Nombre"
                          name={name}
                          value={value}
                          onChange={onChange}
                          error={error(name)}
                          required={required(name)}
                        />
                      )}
                    />
                  </Col>
                  <Col span={24}>
                    <Controller
                      name="fatherRegistrationNumber"
                      control={control}
                      defaultValue=""
                      render={({ field: { onChange, value, name } }) => (
                        <Input
                          label="N° Matrícula"
                          name={name}
                          value={value}
                          onChange={onChange}
                          error={error(name)}
                          required={required(name)}
                        />
                      )}
                    />
                  </Col>
                  <Col span={24}>
                    <Controller
                      name="fatherRaceOrLine"
                      control={control}
                      defaultValue=""
                      render={({ field: { onChange, value, name } }) => (
                        <Input
                          label="Raza/Línea"
                          name={name}
                          value={value}
                          onChange={onChange}
                          error={error(name)}
                          required={required(name)}
                        />
                      )}
                    />
                  </Col>
                </>
              ) : (
                <>
                  <Col span={24}>
                    <Controller
                      name="motherFullName"
                      control={control}
                      defaultValue=""
                      render={({ field: { onChange, value, name } }) => (
                        <Input
                          label="Nombre"
                          name={name}
                          value={value}
                          onChange={onChange}
                          error={error(name)}
                          required={required(name)}
                        />
                      )}
                    />
                  </Col>
                  <Col span={24}>
                    <Controller
                      name="motherRegistrationNumber"
                      control={control}
                      defaultValue=""
                      render={({ field: { onChange, value, name } }) => (
                        <Input
                          label="N° Matrícula"
                          name={name}
                          value={value}
                          onChange={onChange}
                          error={error(name)}
                          required={required(name)}
                        />
                      )}
                    />
                  </Col>
                  <Col span={24}>
                    <Controller
                      name="motherRaceOrLine"
                      control={control}
                      defaultValue=""
                      render={({ field: { onChange, value, name } }) => (
                        <Input
                          label="Raza/Línea"
                          name={name}
                          value={value}
                          onChange={onChange}
                          error={error(name)}
                          required={required(name)}
                        />
                      )}
                    />
                  </Col>
                </>
              )}
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Button
                  type="primary"
                  size="large"
                  block
                  htmlType="submit"
                  loading={""}
                >
                  Guardar
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </DataEntryModal>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: space-between;

  span {
    font-weight: 500;
  }
`;
