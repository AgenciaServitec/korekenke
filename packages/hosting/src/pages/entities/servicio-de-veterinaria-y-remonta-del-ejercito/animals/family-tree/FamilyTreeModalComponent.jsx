import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { useFormUtils } from "../../../../../hooks";
import {
  Button,
  Col,
<<<<<<< HEAD
  ComponentContainer,
  DataEntryModal,
  Form,
  Input,
  notification,
  Row,
} from "../../../../../components";
import { updateAnimal } from "../../../../../firebase/collections";
import { useParams } from "react-router";
import { v4 as uuidv4 } from "uuid";

export const FamilyTreeModalComponent = ({
  animal,
  parentId,
  onSetParentId,
  isVisibleModal,
  onSetIsVisibleModal,
  onFindAndUpdateAnimalInformation,
}) => {
  const { animalId } = useParams();
  const [currentAnimal, setCurrentAnimal] = useState({});
  const [loading, setLoading] = useState(false);

  const animalView = (animal) => {
    if (animal?.id === parentId) setCurrentAnimal(animal);

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
  }, [animal]);

  const fatherInformation = currentAnimal?.parents?.[0] || {};
  const motherInformation = currentAnimal?.parents?.[1] || {};

  const mapForm = (formData) => [
    {
      id: fatherInformation?.id || uuidv4(),
      fullName: formData.fatherFullName,
      registrationNumber: formData.fatherRegistrationNumber,
      raceOrLine: formData.fatherRaceOrLine,
      ...(currentAnimal.id !== parentId
        ? { parents: [] }
        : { parents: [...(fatherInformation.parents || [])] }),
    },
    {
      id: motherInformation?.id || uuidv4(),
      fullName: formData.motherFullName,
      registrationNumber: formData.motherRegistrationNumber,
      raceOrLine: formData.motherRaceOrLine,
      ...(currentAnimal.id !== parentId
        ? { parents: [] }
        : { parents: [...(motherInformation.parents || [])] }),
    },
  ];

  const onAddAnimalParents = async (formData) => {
    try {
      setLoading(true);

      await updateAnimal(animalId, {
        ...animal,
        parents: onFindAndUpdateAnimalInformation(
          animal,
          animal.parents,
          parentId,
          mapForm(formData),
        ),
      });

      notification({ type: "success" });
      onSetIsVisibleModal(false);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const onClearData = () => {
    setCurrentAnimal({});
    onSetParentId(null);
  };
=======
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
>>>>>>> 61dfb95 (added family tree)

  return (
    <FamilyTreeModal
      isVisibleModal={isVisibleModal}
      onSetIsVisibleModal={onSetIsVisibleModal}
<<<<<<< HEAD
      fatherInformation={fatherInformation}
      motherInformation={motherInformation}
      onAddAnimalParents={onAddAnimalParents}
      onClearData={onClearData}
      loading={loading}
=======
      relationship={relationship}
      onSetRelationship={setRelationship}
>>>>>>> 61dfb95 (added family tree)
    />
  );
};

const FamilyTreeModal = ({
<<<<<<< HEAD
  isVisibleModal,
  onSetIsVisibleModal,
  fatherInformation,
  motherInformation,
  onAddAnimalParents,
  onClearData,
  loading,
=======
  animal,
  isVisibleModal,
  onSetIsVisibleModal,
  relationship,
  onSetRelationship,
>>>>>>> 61dfb95 (added family tree)
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
<<<<<<< HEAD
  }, [fatherInformation, motherInformation]);

  const resetForm = () => {
    reset({
      fatherFullName: fatherInformation?.fullName || "",
      fatherRegistrationNumber: fatherInformation?.registrationNumber || "",
      fatherRaceOrLine: fatherInformation?.raceOrLine || "",
      motherFullName: motherInformation?.fullName || "",
      motherRegistrationNumber: motherInformation?.registrationNumber || "",
      motherRaceOrLine: motherInformation?.raceOrLine || "",
=======
  }, []);

  const resetForm = () => {
    reset({
      fatherFullName: animal?.fatherFullName || "",
      fatherRegistrationNumber: animal?.fatherRegistrationNumber || "",
      fatherRaceOrLine: animal?.fatherRaceOrLine || "",
      motherFullName: animal?.motherFullName || "",
      motherRegistrationNumber: animal?.motherRegistrationNumber || "",
      motherRaceOrLine: animal?.motherRaceOrLine || "",
>>>>>>> 61dfb95 (added family tree)
    });
  };

  return (
    <DataEntryModal
      title="Datos del familiar"
      visible={isVisibleModal}
<<<<<<< HEAD
      onCancel={() => {
        onSetIsVisibleModal(false);
        onClearData();
      }}
    >
      <Form onSubmit={handleSubmit(onAddAnimalParents)}>
        <Row gutter={[16, 16]}>
          <Col span={24} md={12}>
            <ComponentContainer.group label="Padre">
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Controller
                    name="fatherFullName"
                    control={control}
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
              </Row>
            </ComponentContainer.group>
          </Col>
          <Col span={24} md={12}>
            <ComponentContainer.group label="Madre">
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Controller
                    name="motherFullName"
                    control={control}
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
              </Row>
            </ComponentContainer.group>
          </Col>
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
    </DataEntryModal>
  );
};
=======
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
>>>>>>> 61dfb95 (added family tree)
