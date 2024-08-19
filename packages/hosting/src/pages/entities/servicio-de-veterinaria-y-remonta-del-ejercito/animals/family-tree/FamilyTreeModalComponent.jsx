import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { useFormUtils } from "../../../../../hooks";
import {
  Button,
  Col,
<<<<<<< HEAD
<<<<<<< HEAD
  ComponentContainer,
  DataEntryModal,
  Form,
  Input,
  notification,
<<<<<<< HEAD
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
=======
  ComponentContainer,
>>>>>>> 6d170a0 (refactored the add and edit animal parents information)
  DataEntryModal,
  Form,
  Input,
  notification,
  Radio,
=======
>>>>>>> d43dd82 (refactored code)
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

<<<<<<< HEAD
  console.log("fatherInformation:", fatherInformation);

<<<<<<< HEAD
<<<<<<< HEAD
  console.log("Animal: ", animal);
  console.log(animalView(animal));
>>>>>>> 61dfb95 (added family tree)
=======
  const fatherInformation = currentAnimal?.parents?.[0];
  const motherInformation = currentAnimal?.parents?.[1];
=======
>>>>>>> 6d170a0 (refactored the add and edit animal parents information)
=======
>>>>>>> d43dd82 (refactored code)
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
>>>>>>> 7ca4409 (added reset form)

  const onClearData = () => {
    setCurrentAnimal({});
    onSetParentId(null);
  };

  return (
    <FamilyTreeModal
      isVisibleModal={isVisibleModal}
      onSetIsVisibleModal={onSetIsVisibleModal}
<<<<<<< HEAD
<<<<<<< HEAD
      fatherInformation={fatherInformation}
      motherInformation={motherInformation}
      onAddAnimalParents={onAddAnimalParents}
      onClearData={onClearData}
      loading={loading}
=======
      relationship={relationship}
      fatherInformation={fatherInformation}
      motherInformation={motherInformation}
      onSetRelationship={setRelationship}
<<<<<<< HEAD
>>>>>>> 61dfb95 (added family tree)
=======
=======
      fatherInformation={fatherInformation}
      motherInformation={motherInformation}
>>>>>>> d43dd82 (refactored code)
      onAddAnimalParents={onAddAnimalParents}
      onClearData={onClearData}
      loading={loading}
>>>>>>> 7ca4409 (added reset form)
    />
  );
};

const FamilyTreeModal = ({
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
>>>>>>> 7ca4409 (added reset form)
=======
  onSetParentId,
>>>>>>> 6d170a0 (refactored the add and edit animal parents information)
=======
>>>>>>> d43dd82 (refactored code)
  isVisibleModal,
  onSetIsVisibleModal,
  fatherInformation,
  motherInformation,
<<<<<<< HEAD
  onSetRelationship,
<<<<<<< HEAD
>>>>>>> 61dfb95 (added family tree)
=======
=======
>>>>>>> d43dd82 (refactored code)
  onAddAnimalParents,
  onClearData,
  loading,
>>>>>>> 7ca4409 (added reset form)
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
<<<<<<< HEAD
<<<<<<< HEAD
    resetForm();
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> d43dd82 (refactored code)
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
=======
    resetForm(fatherInformation, motherInformation);
=======
    resetForm();
>>>>>>> 6d170a0 (refactored the add and edit animal parents information)
  }, [fatherInformation, motherInformation, isVisibleModal]);
>>>>>>> 7ca4409 (added reset form)

  console.log("fatherFullName:", watch("fatherFullName"));
  console.log("relationship", relationship);

  const resetForm = () => {
    reset({
<<<<<<< HEAD
<<<<<<< HEAD
      fatherFullName: animal?.fatherFullName || "",
      fatherRegistrationNumber: animal?.fatherRegistrationNumber || "",
      fatherRaceOrLine: animal?.fatherRaceOrLine || "",
      motherFullName: animal?.motherFullName || "",
      motherRegistrationNumber: animal?.motherRegistrationNumber || "",
      motherRaceOrLine: animal?.motherRaceOrLine || "",
>>>>>>> 61dfb95 (added family tree)
=======
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
>>>>>>> 7ca4409 (added reset form)
=======
      fatherFullName: fatherInformation?.fullName || "",
      fatherRegistrationNumber: fatherInformation?.registrationNumber || "",
      fatherRaceOrLine: fatherInformation?.raceOrLine || "",
      motherFullName: motherInformation?.fullName || "",
      motherRegistrationNumber: motherInformation?.registrationNumber || "",
      motherRaceOrLine: motherInformation?.raceOrLine || "",
>>>>>>> 6d170a0 (refactored the add and edit animal parents information)
    });
  };

  return (
    <DataEntryModal
      title="Datos del familiar"
      visible={isVisibleModal}
<<<<<<< HEAD
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
=======
      onCancel={() => {
        onSetIsVisibleModal(false);
        onClearData();
      }}
>>>>>>> 7ca4409 (added reset form)
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
<<<<<<< HEAD

const Container = styled.div`
  display: flex;
  justify-content: space-between;

  span {
    font-weight: 500;
  }
`;
>>>>>>> 61dfb95 (added family tree)
=======
>>>>>>> d43dd82 (refactored code)
