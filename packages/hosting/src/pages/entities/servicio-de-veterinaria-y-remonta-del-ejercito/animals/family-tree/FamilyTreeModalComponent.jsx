import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { useFormUtils } from "../../../../../hooks";
import {
  Button,
  Col,
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
      isDefault: !!fatherInformation?.id,
      fullName: formData.fatherFullName,
      registrationNumber: formData.fatherRegistrationNumber,
      raceOrLine: formData.fatherRaceOrLine,
      relationship: "father",
      ...(currentAnimal.id !== parentId
        ? { parents: [] }
        : { parents: [...(fatherInformation.parents || [])] }),
    },
    {
      id: motherInformation?.id || uuidv4(),
      isDefault: !!fatherInformation?.id,
      fullName: formData.motherFullName,
      registrationNumber: formData.motherRegistrationNumber,
      raceOrLine: formData.motherRaceOrLine,
      relationship: "mother",
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

  return (
    <FamilyTreeModal
      isVisibleModal={isVisibleModal}
      onSetIsVisibleModal={onSetIsVisibleModal}
      fatherInformation={fatherInformation}
      motherInformation={motherInformation}
      onAddAnimalParents={onAddAnimalParents}
      onClearData={onClearData}
      loading={loading}
    />
  );
};

const FamilyTreeModal = ({
  isVisibleModal,
  onSetIsVisibleModal,
  fatherInformation,
  motherInformation,
  onAddAnimalParents,
  onClearData,
  loading,
}) => {
  const schema = yup.object({
    fatherFullName: yup.string().notRequired(),
    fatherRegistrationNumber: yup.string().notRequired(),
    fatherRaceOrLine: yup.string().notRequired(),
    motherFullName: yup.string().notRequired(),
    motherRegistrationNumber: yup.string().notRequired(),
    motherRaceOrLine: yup.string().notRequired(),
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
  }, [fatherInformation, motherInformation]);

  const resetForm = () => {
    reset({
      fatherFullName: fatherInformation?.fullName || "",
      fatherRegistrationNumber: fatherInformation?.registrationNumber || "",
      fatherRaceOrLine: fatherInformation?.raceOrLine || "",
      motherFullName: motherInformation?.fullName || "",
      motherRegistrationNumber: motherInformation?.registrationNumber || "",
      motherRaceOrLine: motherInformation?.raceOrLine || "",
    });
  };

  return (
    <DataEntryModal
      title="Datos del familiar"
      visible={isVisibleModal}
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
