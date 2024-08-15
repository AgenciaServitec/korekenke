import React, { useEffect, useState } from "react";
import {
  Acl,
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  notification,
  Row,
  Select,
  TextArea,
  Title,
  Upload,
} from "../../../../../components";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  useAnimalLogs,
  useDefaultFirestoreProps,
  useFormUtils,
  useQuery,
} from "../../../../../hooks";
import { useAuthentication, useGlobalData } from "../../../../../providers";
import {
  addAnimal,
  getAnimalId,
  updateAnimal,
} from "../../../../../firebase/collections";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";
import { DATE_FORMAT_TO_FIRESTORE } from "../../../../../firebase/firestore";
import { userFullName } from "../../../../../utils/users/userFullName2";
import { AnimalsType } from "../../../../../data-list";
import { isProduction } from "../../../../../config";
import { isEmpty } from "lodash";

export const AnimalIntegration = () => {
  const { animalId } = useParams();
  const { animalType } = useQuery();
  const navigate = useNavigate();
<<<<<<< HEAD:packages/hosting/src/pages/entities/servicio-de-veterinaria-y-remonta-del-ejercito/animals/_animalId/index.jsx
  const { authUser } = useAuthentication();
  const { animals, users, units } = useGlobalData();
=======
  const { livestockAndEquines, departments, users, units } = useGlobalData();
>>>>>>> 98c9bc3 (Updated fields with units and large units):packages/hosting/src/pages/entities/servicio-de-veterinaria-y-remonta-del-ejercito/livestock-and-equines/_livestockAndEquineId/index.jsx
  const { assignCreateProps, assignUpdateProps } = useDefaultFirestoreProps();
  const { onSetAnimalLog } = useAnimalLogs();

  const [loading, setLoading] = useState(false);
  const [animal, setAnimal] = useState({});

  const isNew = animalId === "new";

  useEffect(() => {
    const _animal = isNew
      ? { id: getAnimalId() }
      : animals.find((animal) => animal?.id === animalId);

    if (!_animal) return navigate(-1);

    setAnimal(_animal);
  }, []);

  const mapAnimal = (formData) => ({
    ...animal,
    nsgId: formData?.nsgId || null,
    rightProfilePhoto: formData?.rightProfilePhoto || null,
    frontPhoto: formData?.frontPhoto || null,
    leftProfilePhoto: formData?.leftProfilePhoto || null,
    rightProfilePhotoCopy:
      formData?.rightProfilePhotoCopy || animal?.rightProfilePhotoCopy,
    frontPhotoCopy: formData?.frontPhotoCopy || animal?.frontPhotoCopy,
    leftProfilePhotoCopy:
      formData?.leftProfilePhotoCopy || animal?.leftProfilePhotoCopy,
    animalUnit: formData.animalUnit,
    unitId: formData.unitId,
    greatUnitStatic: formData.greatUnitStatic,
    name: formData.name,
    ...(formData.type === "cattle" && { slopeNumber: formData.slopeNumber }),
    registrationNumber: formData.registrationNumber,
    chipNumber: formData.chipNumber || null,
    gender: formData.gender,
    color: formData.color,
    birthdate: dayjs(formData.birthdate).format(DATE_FORMAT_TO_FIRESTORE),
    height: formData.height,
    father: formData.father,
    mother: formData.mother,
    origin: formData.origin,
    raceOrLine: formData.raceOrLine,
    fur: formData.fur,
    assignedOrAffectedId: formData.assignedOrAffectedId,
    description: formData.description,
    type: animalType,
    status: animal?.status || "registered",
    userId: authUser.id,
<<<<<<< HEAD
    ...(isNew
      ? {
          parents: [
            {
              id: uuidv4(),
              fullName: formData.father,
              registrationNumber: "",
              raceOrLine: "",
              parents: [],
            },
            {
              id: uuidv4(),
              fullName: formData.mother,
              registrationNumber: "",
              raceOrLine: "",
              parents: [],
            },
          ],
        }
      : animal.parents),
=======
    parents: [
      {
        id: 1,
        fullName: formData.father,
        registrationNumber: "abc-123",
        raceOrLine: "test raza",
        parents: [
          {
            id: 1,
            fullName: "test abuelo",
            registrationNumber: "abc-234",
            raceOrLine: "test raza",
            parents: [
              {
                id: 1,
                fullName: "test bisabuelo",
                registrationNumber: "abc-345",
                raceOrLine: "test raza",
                parents: [
                  {
                    id: 1,
                    fullName: "test tatarabuelo",
                    registrationNumber: "abc-456",
                    raceOrLine: "test raza",
                    parents: [],
                  },
                  {
                    id: 2,
                    fullName: "test tatarabuela",
                    registrationNumber: "abc-678",
                    raceOrLine: "test raza",
                    parents: [],
                  },
                ],
              },
              {
                id: 2,
                fullName: "test bisabuela",
                registrationNumber: "abc-789",
                raceOrLine: "test raza",
                parents: [
                  {
                    id: 1,
                    fullName: "test tatarabuelo",
                    registrationNumber: "abc-890",
                    raceOrLine: "test raza",
                    parents: [],
                  },
                  {
                    id: 2,
                    fullName: "test tatarabuela",
                    registrationNumber: "abc-901",
                    raceOrLine: "test raza",
                    parents: [],
                  },
                ],
              },
            ],
          },
          {
            id: 2,
            fullName: "test abuela",
            registrationNumber: "abc-012",
            raceOrLine: "test raza",
            parents: [
              {
                id: 1,
                fullName: "test bisabuelo",
                registrationNumber: "abc-098",
                raceOrLine: "test raza",
                parents: [
                  {
                    id: 1,
                    fullName: "test tatarabuelo",
                    registrationNumber: "abc-987",
                    raceOrLine: "test raza",
                    parents: [],
                  },
                  {
                    id: 2,
                    fullName: "test tatarabuela",
                    registrationNumber: "abc-876",
                    raceOrLine: "test raza",
                    parents: [],
                  },
                ],
              },
              {
                id: 2,
                fullName: "test bisabuela",
                registrationNumber: "abc-765",
                raceOrLine: "test raza",
                parents: [
                  {
                    id: 1,
                    fullName: "test tatarabuelo",
                    registrationNumber: "abc-654",
                    raceOrLine: "test raza",
                    parents: [],
                  },
                  {
                    id: 2,
                    fullName: "test tatarabuela",
                    registrationNumber: "abc-543",
                    raceOrLine: "test raza",
                    parents: [],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 2,
        fullName: formData.mother,
        registrationNumber: "asd-123",
        raceOrLine: "test raza",
        parents: [
          {
            id: 1,
            fullName: "test abuelo",
            registrationNumber: "asd-234",
            raceOrLine: "test raza",
            parents: [
              {
                id: 1,
                fullName: "test bisabuelo",
                registrationNumber: "asd-345",
                raceOrLine: "test raza",
                parents: [
                  {
                    id: 1,
                    fullName: "test tatarabuelo",
                    registrationNumber: "asd-456",
                    raceOrLine: "test raza",
                    parents: [],
                  },
                  {
                    id: 2,
                    fullName: "test tatarabuela",
                    registrationNumber: "asd-567",
                    raceOrLine: "test raza",
                    parents: [],
                  },
                ],
              },
              {
                id: 2,
                fullName: "test bisabuela",
                registrationNumber: "asd-678",
                raceOrLine: "test raza",
                parents: [
                  {
                    id: 1,
                    fullName: "test tatarabuelo",
                    registrationNumber: "asd-789",
                    raceOrLine: "test raza",
                    parents: [],
                  },
                  {
                    id: 2,
                    fullName: "test tatarabuela",
                    registrationNumber: "asd-890",
                    raceOrLine: "test raza",
                    parents: [],
                  },
                ],
              },
            ],
          },
          {
            id: 2,
            fullName: "test abuela",
            registrationNumber: "asd-901",
            raceOrLine: "test raza",
            parents: [
              {
                id: 1,
                fullName: "test bisabuelo",
                registrationNumber: "asd-012",
                raceOrLine: "test raza",
                parents: [
                  {
                    id: 1,
                    fullName: "test tatarabuelo",
                    registrationNumber: "asd-098",
                    raceOrLine: "test raza",
                    parents: [],
                  },
                  {
                    id: 2,
                    fullName: "test tatarabuela",
                    registrationNumber: "asd-987",
                    raceOrLine: "test raza",
                    parents: [],
                  },
                ],
              },
              {
                id: 2,
                fullName: "test bisabuela",
                registrationNumber: "asd-876",
                raceOrLine: "test raza",
                parents: [
                  {
                    id: 1,
                    fullName: "test tatarabuelo",
                    registrationNumber: "asd-765",
                    raceOrLine: "test raza",
                    parents: [],
                  },
                  {
                    id: 2,
                    fullName: "test tatarabuela",
                    registrationNumber: "asd-654",
                    raceOrLine: "test raza",
                    parents: [],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
>>>>>>> 61dfb95 (added family tree)
  });

  const onSaveAnimal = async (formData) => {
    try {
      setLoading(true);

      const _formData = mapAnimal(formData);

      isNew
        ? await addAnimal(assignCreateProps(_formData))
        : await updateAnimal(animal.id, assignUpdateProps(_formData));

      await onSetAnimalLog({ animal, formData: _formData });

      await notification({ type: "success" });
      onGoBack();
    } catch (e) {
      console.error("ErrorSaveEntity: ", e);
      notification({ type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const cologeUsers = users
    .filter((user) =>
      (user?.commands || []).map((command) => command.code).includes("cologe")
    )
    .map((_user) => ({
      label: userFullName(_user),
      value: _user.id,
    }));

  const onGoBack = () => navigate(-1);

  return (
    <Animal
      isNew={isNew}
<<<<<<< HEAD:packages/hosting/src/pages/entities/servicio-de-veterinaria-y-remonta-del-ejercito/animals/_animalId/index.jsx
      user={authUser}
      animalType={animalType}
      units={units}
      animal={animal}
=======
      units={units}
      departmentsView={departmentsView}
      livestockAndEquine={livestockAndEquine}
>>>>>>> 98c9bc3 (Updated fields with units and large units):packages/hosting/src/pages/entities/servicio-de-veterinaria-y-remonta-del-ejercito/livestock-and-equines/_livestockAndEquineId/index.jsx
      cologeUsers={cologeUsers}
      onSaveAnimal={onSaveAnimal}
      loading={loading}
      onGoBack={onGoBack}
    />
  );
};

const Animal = ({
  isNew,
<<<<<<< HEAD:packages/hosting/src/pages/entities/servicio-de-veterinaria-y-remonta-del-ejercito/animals/_animalId/index.jsx
  user,
  animalType,
  units,
  animal,
=======
  units,
  livestockAndEquine,
>>>>>>> 98c9bc3 (Updated fields with units and large units):packages/hosting/src/pages/entities/servicio-de-veterinaria-y-remonta-del-ejercito/livestock-and-equines/_livestockAndEquineId/index.jsx
  cologeUsers,
  onSaveAnimal,
  loading,
  onGoBack,
}) => {
<<<<<<< HEAD:packages/hosting/src/pages/entities/servicio-de-veterinaria-y-remonta-del-ejercito/animals/_animalId/index.jsx
  const [rightProfilePhotoCopy, setRightProfilePhotoCopy] = useState(
    animal?.rightProfilePhotoCopy
  );
  const [frontPhotoCopy, setFrontPhotoCopy] = useState(animal?.frontPhotoCopy);
  const [leftProfilePhotoCopy, setLeftProfilePhotoCopy] = useState(
    animal?.leftProfilePhotoCopy
  );

  const isEquine = animalType === "equine";
  const isCattle = animalType === "cattle";
=======
  const unitsView = units.map((unit) => ({
    label: unit.name,
    value: unit.id,
  }));
>>>>>>> 98c9bc3 (Updated fields with units and large units):packages/hosting/src/pages/entities/servicio-de-veterinaria-y-remonta-del-ejercito/livestock-and-equines/_livestockAndEquineId/index.jsx

  const schema = yup.object({
    nsgId: yup.string(),
    rightProfilePhoto: yup.mixed().required(),
    frontPhoto: yup.mixed().required(),
    leftProfilePhoto: yup.mixed().required(),
    animalUnit: yup.string().required(),
    unitId: yup.string().required(),
    greatUnitStatic: yup.string(),
    name: yup.string().required(),
    slopeNumber: isCattle
      ? yup.string().required()
      : yup.string().notRequired(),
    registrationNumber: isEquine
      ? yup.string().required()
      : yup.string().notRequired(),
    chipNumber: isEquine ? yup.string().required() : yup.string().notRequired(),
    gender: yup.string().required(),
    color: yup.string().required(),
    birthdate: yup.date().required(),
    height: isEquine ? yup.string().required() : yup.string().notRequired(),
    father: yup.string().required(),
    mother: yup.string().required(),
    origin: yup.string().required(),
    raceOrLine: yup.string().required(),
    fur: yup.string(),
    assignedOrAffectedId: yup.string(),
    description: yup.string(),
  });

  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { required, error } = useFormUtils({ errors, schema });

  useEffect(() => {
    resetForm();
  }, [animal]);

  const resetForm = () => {
    reset({
      nsgId: animal?.nsgId || "",
      rightProfilePhoto: animal?.rightProfilePhoto || null,
      frontPhoto: animal?.frontPhoto || null,
      leftProfilePhoto: animal?.leftProfilePhoto || null,
      animalUnit: animal?.animalUnit || "",
      unitId: animal?.unitId
        ? animal?.unitId
        : isProduction
        ? "mVywdUjcwEBT2QxnLzaT"
        : "R7zZr5jtrN6F3acc0xnr",
      greatUnitStatic: animal?.greatUnitStatic || "",
      name: animal?.name || "",
      slopeNumber: animal?.slopeNumber || "",
      registrationNumber: animal?.registrationNumber || null,
      gender: animal?.gender || "",
      chipNumber: animal?.chipNumber || "",
      color: animal?.color || "",
      birthdate: animal?.birthdate
        ? dayjs(animal.birthdate, DATE_FORMAT_TO_FIRESTORE)
        : undefined,
      height: animal?.height || "",
      father: animal?.father || "",
      mother: animal?.mother || "",
      origin: animal?.origin || "",
      raceOrLine: animal?.raceOrLine || "",
      fur: animal?.fur || "",
      assignedOrAffectedId: animal?.assignedOrAffectedId || "",
      description: animal?.description || "",
    });
  };

<<<<<<< HEAD:packages/hosting/src/pages/entities/servicio-de-veterinaria-y-remonta-del-ejercito/animals/_animalId/index.jsx
  const onSubmit = (formData) =>
    onSaveAnimal({
      ...formData,
      rightProfilePhotoCopy,
      frontPhotoCopy,
      leftProfilePhotoCopy,
    });
=======
  const onChangeGreatUnit = (onChange, value) => {
    const _unit = units.find((_unit) => _unit.id === value);

    if (_unit) setValue("greatUnit", _unit?.greatUnit);
    if (!_unit) setValue("greatUnit", "");

    return onChange(value);
  };

  const onSubmit = (formData) => {
    onSaveLivestockAndEquine(formData);
  };
>>>>>>> 98c9bc3 (Updated fields with units and large units):packages/hosting/src/pages/entities/servicio-de-veterinaria-y-remonta-del-ejercito/livestock-and-equines/_livestockAndEquineId/index.jsx

  return (
    <Acl
      category="servicio-de-veterinaria-y-remonta-del-ejercito"
      subCategory="animals"
      name={isNew ? "/animals/new" : "/animals/:animalId"}
      redirect
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Title level={3}>{AnimalsType?.[animalType]?.titleSingular}</Title>
        </Col>
        <Col span={24}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row gutter={[16, 16]}>
              <Col span={24} md={8}>
                <Controller
                  control={control}
                  name="rightProfilePhoto"
                  render={({ field: { onChange, value, name } }) => (
                    <Upload
                      isImage
                      label="Foto perfil derecho"
                      accept="image/*"
                      buttonText="Subir foto"
                      value={value}
                      name={name}
                      withThumbImage={false}
                      bucket="servicioDeVeterinariaYRemontaDelEjercito"
                      fileName={`right-profile-photo-${uuidv4()}`}
                      filePath={`animals/${animal.id}/photos`}
                      copyFilesTo={
                        animal?.status !== "registered"
                          ? null
                          : {
                              withThumbImage: false,
                              isImage: true,
                              bucket:
                                "servicioDeVeterinariaYRemontaDelEjercito",
                              fileName: `right-profile-photo-${uuidv4()}`,
                              filePath: `animal-logs/${animal?.id}/images`,
                            }
                      }
                      onChange={(file) => onChange(file)}
                      onChangeCopy={(file) =>
                        file && setRightProfilePhotoCopy(file)
                      }
                      required={required(name)}
                      error={error(name)}
                    />
                  )}
                />
              </Col>
              <Col span={24} md={8}>
                <Controller
                  control={control}
                  name="frontPhoto"
                  render={({ field: { onChange, value, name } }) => (
                    <Upload
                      isImage
                      label="Foto frontal"
                      accept="image/*"
                      buttonText="Subir foto"
                      value={value}
                      name={name}
                      withThumbImage={false}
                      bucket="servicioDeVeterinariaYRemontaDelEjercito"
                      fileName={`front-photo-${uuidv4()}`}
                      filePath={`animals/${animal.id}/photos`}
                      copyFilesTo={
                        animal?.status !== "registered"
                          ? null
                          : {
                              withThumbImage: false,
                              isImage: true,
                              bucket:
                                "servicioDeVeterinariaYRemontaDelEjercito",
                              fileName: `front-photo-${uuidv4()}`,
                              filePath: `animal-logs/${animal?.id}/images`,
                            }
                      }
                      onChange={(file) => onChange(file)}
                      onChangeCopy={(file) => file && setFrontPhotoCopy(file)}
                      required={required(name)}
                      error={error(name)}
                    />
                  )}
                />
              </Col>
              <Col span={24} md={8}>
                <Controller
                  control={control}
                  name="leftProfilePhoto"
                  render={({ field: { onChange, value, name } }) => (
                    <Upload
                      isImage
                      label="Foto perfil izquierdo"
                      accept="image/*"
                      buttonText="Subir foto"
                      value={value}
                      name={name}
                      withThumbImage={false}
                      bucket="servicioDeVeterinariaYRemontaDelEjercito"
                      fileName={`left-profile-photo-${uuidv4()}`}
                      filePath={`animals/${animal.id}/photos`}
                      copyFilesTo={
                        animal?.status !== "registered"
                          ? null
                          : {
                              withThumbImage: false,
                              isImage: true,
                              bucket:
                                "servicioDeVeterinariaYRemontaDelEjercito",
                              fileName: `left-profile-photo-${uuidv4()}`,
                              filePath: `animal-logs/${animal?.id}/images`,
                            }
                      }
                      onChange={(file) => onChange(file)}
                      onChangeCopy={(file) =>
                        file && setLeftProfilePhotoCopy(file)
                      }
                      required={required(name)}
                      error={error(name)}
                    />
                  )}
                />
              </Col>
              <Col span={24} md={6}>
                <Controller
                  name="nsgId"
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <Input
                      label="NSG"
                      name={name}
                      value={value}
                      onChange={onChange}
                      error={error(name)}
                      required={required(name)}
                    />
                  )}
                />
              </Col>
              <Col span={24} md={6}>
                <Controller
                  name="animalUnit"
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <Input
                      label="Unidad"
                      name={name}
                      value={value}
<<<<<<< HEAD:packages/hosting/src/pages/entities/servicio-de-veterinaria-y-remonta-del-ejercito/animals/_animalId/index.jsx
                      onChange={onChange}
=======
                      options={unitsView}
                      onChange={(value) => onChangeGreatUnit(onChange, value)}
>>>>>>> 98c9bc3 (Updated fields with units and large units):packages/hosting/src/pages/entities/servicio-de-veterinaria-y-remonta-del-ejercito/livestock-and-equines/_livestockAndEquineId/index.jsx
                      error={error(name)}
                      required={required(name)}
                    />
                  )}
                />
              </Col>
              <Col span={24} md={6}>
                <Controller
                  name="greatUnitStatic"
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <Input
                      label="Gran unidad"
                      name={name}
                      value={value}
                      onChange={onChange}
                      error={error(name)}
                      required={required(name)}
                    />
                  )}
                />
              </Col>
              <Col span={24} md={6}>
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
              {isEquine && (
                <Col span={24} md={6}>
                  <Controller
                    name="height"
                    control={control}
                    render={({ field: { onChange, value, name } }) => (
                      <Input
                        label="Talla"
                        name={name}
                        value={value}
                        onChange={onChange}
                        error={error(name)}
                        required={required(name)}
                      />
                    )}
                  />
                </Col>
              )}

              <Col span={24} md={6}>
                <Controller
                  name="name"
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
              <Col span={24} md={6}>
                <Controller
                  name="father"
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <Input
                      label="Padre"
                      name={name}
                      value={value}
                      onChange={onChange}
                      error={error(name)}
                      required={required(name)}
                    />
                  )}
                />
              </Col>
              <Col span={24} md={6}>
                <Controller
                  name="mother"
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <Input
                      label="Madre"
                      name={name}
                      value={value}
                      onChange={onChange}
                      error={error(name)}
                      required={required(name)}
                    />
                  )}
                />
              </Col>
              {isCattle && (
                <Col span={24} md={6}>
                  <Controller
                    name="slopeNumber"
                    control={control}
                    render={({ field: { onChange, value, name } }) => (
                      <Input
                        label="N° de Arete"
                        name={name}
                        value={value}
                        onChange={onChange}
                        error={error(name)}
                        required={required(name)}
                      />
                    )}
                  />
                </Col>
              )}
              {!isCattle && (
                <>
                  <Col span={24} md={6}>
                    <Controller
                      name="registrationNumber"
                      control={control}
                      render={({ field: { onChange, value, name } }) => (
                        <Input
                          label="N° de Matrícula"
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
              {isEquine && (
                <Col span={24} md={6}>
                  <Controller
                    name="chipNumber"
                    control={control}
                    render={({ field: { onChange, value, name } }) => (
                      <Input
                        label="N° de Chip"
                        name={name}
                        value={value}
                        onChange={onChange}
                        error={error(name)}
                        required={required(name)}
                      />
                    )}
                  />
                </Col>
              )}
              <Col span={24} md={6}>
                <Controller
                  name="origin"
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <Input
                      label="Procedencia"
                      name={name}
                      value={value}
                      onChange={onChange}
                      error={error(name)}
                      required={required(name)}
                    />
                  )}
                />
              </Col>
              <Col span={24} md={6}>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <Select
                      label="Sexo"
                      name={name}
                      value={value}
                      onChange={onChange}
                      error={error(name)}
                      required={required(name)}
                      options={[
                        {
                          label: "Macho",
                          value: "male",
                        },
                        {
                          label: "Hembra",
                          value: "female",
                        },
                      ]}
                    />
                  )}
                />
              </Col>
              <Col span={24} md={6}>
                <Controller
                  name="raceOrLine"
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <Input
                      label="Raza / Línea"
                      name={name}
                      value={value}
                      onChange={onChange}
                      error={error(name)}
                      required={required(name)}
                    />
                  )}
                />
              </Col>
              <Col span={24} md={6}>
                <Controller
                  name="fur"
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <Input
                      label="Pelaje"
                      name={name}
                      value={value}
                      onChange={onChange}
                      error={error(name)}
                      required={required(name)}
                    />
                  )}
                />
              </Col>
              <Col span={24} md={6}>
                <Controller
                  name="color"
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <Input
                      label="Color"
                      name={name}
                      value={value}
                      onChange={onChange}
                      error={error(name)}
                      required={required(name)}
                    />
                  )}
                />
              </Col>
              <Col span={24} md={6}>
                <Controller
                  name="assignedOrAffectedId"
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <Select
                      label="Asignado u Afectado"
                      name={name}
                      value={value}
                      options={cologeUsers}
                      onChange={onChange}
                      error={error(name)}
                      required={required(name)}
                    />
                  )}
                />
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <TextArea
                      label="Descripción"
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

            {["super_admin", "manager"].includes(user.roleCode) && (
              <>
                <br />
                <Row justify="end">
                  <Col span={24} md={12}>
                    <Controller
                      name="unitId"
                      control={control}
                      render={({ field: { onChange, value, name } }) => (
                        <Select
                          label="Unidad"
                          name={name}
                          value={value}
                          options={units.map((unit) => ({
                            label: unit.name,
                            value: unit.id,
                          }))}
                          disabled={
                            !["super_admin", "manager"].includes(user.roleCode)
                          }
                          onChange={onChange}
                          error={error(name)}
                          required={required(name)}
                        />
                      )}
                    />
                  </Col>
                </Row>
              </>
            )}
            <Row justify="end" gutter={[16, 16]}>
              <Col xs={24} sm={6} md={4}>
                <Button
                  type="default"
                  size="large"
                  block
                  onClick={() => onGoBack()}
                >
                  Cancelar
                </Button>
              </Col>
              <Col xs={24} sm={6} md={4}>
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
    </Acl>
  );
};
