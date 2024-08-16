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
  notification,
  Radio,
  Row,
} from "../../../../../components";
import styled from "styled-components";
import { updateAnimal } from "../../../../../firebase/collections";
import { useParams } from "react-router";
import { v4 as uuidv4 } from "uuid";

export const FamilyTreeModalComponent = ({
  animal,
  parentId,
  isVisibleModal,
  onSetIsVisibleModal,
}) => {
  const { animalId } = useParams();
  const [relationship, setRelationship] = useState("father");
  const [currentAnimal, setCurrentAnimal] = useState({});
  const [loading, setLoading] = useState(false);

  const animalView = (animal) => {
    if (animal.id === parentId) setCurrentAnimal(animal);

    return (animal?.parents || []).find((parent) => {
      if (parent.id === parentId) {
        setCurrentAnimal(parent);
        return;
      }

      if (parent.id !== parentId) return animalView(parent);
    });
  };

  useEffect(() => {
    animalView(animal);
  }, [parentId, animal]);

  const fatherInformation = currentAnimal?.parents?.[0];
  const motherInformation = currentAnimal?.parents?.[1];
  const mapForm = (formData) => [
    {
      id: uuidv4(),
      fullName: formData.fatherFullName,
      registrationNumber: formData.fatherRegistrationNumber,
      raceOrLine: formData.fatherRaceOrLine,
      parents: [],
    },
    {
      id: uuidv4(),
      fullName: formData.motherFullName,
      registrationNumber: formData.motherRegistrationNumber,
      raceOrLine: formData.motherRaceOrLine,
      parents: [],
    },
  ];

  const onAddAnimalParents = async (formData) => {
    try {
      setLoading(true);

      await updateAnimal(animalId, { ...animal, parents: mapForm(formData) });

      notification({ type: "success" });
      onSetIsVisibleModal(false);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FamilyTreeModal
      parentId={parentId}
      isVisibleModal={isVisibleModal}
      onSetIsVisibleModal={onSetIsVisibleModal}
      relationship={relationship}
      fatherInformation={fatherInformation}
      motherInformation={motherInformation}
      onSetRelationship={setRelationship}
      onAddAnimalParents={onAddAnimalParents}
      onSetCurrentAnimal={setCurrentAnimal}
      loading={loading}
    />
  );
};

const FamilyTreeModal = ({
  isVisibleModal,
  onSetIsVisibleModal,
  relationship,
  fatherInformation,
  motherInformation,
  onSetRelationship,
  onAddAnimalParents,
  onSetCurrentAnimal,
  loading,
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
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { required, error, errorMessage } = useFormUtils({ errors, schema });

  useEffect(() => {
    resetForm(fatherInformation, motherInformation);
  }, [fatherInformation, motherInformation, isVisibleModal]);

  const resetForm = (fatherInformation, motherInformation) => {
    reset({
      fatherFullName: fatherInformation?.fullName || watch("fatherFullName"),
      fatherRegistrationNumber:
        fatherInformation?.registrationNumber ||
        watch("fatherRegistrationNumber"),
      fatherRaceOrLine:
        fatherInformation?.raceOrLine || watch("fatherRaceOrLine"),
      motherFullName: motherInformation?.fullName || watch("motherFullName"),
      motherRegistrationNumber:
        motherInformation?.registrationNumber ||
        watch("motherRegistrationNumber"),
      motherRaceOrLine:
        motherInformation?.raceOrLine || watch("motherRaceOrLine"),
    });
  };

  return (
    <DataEntryModal
      title="Datos del familiar"
      visible={isVisibleModal}
      onCancel={() => {
        onSetCurrentAnimal({});
        onSetIsVisibleModal(false);
      }}
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
          <Form onSubmit={handleSubmit(onAddAnimalParents)}>
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
                  loading={loading}
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
