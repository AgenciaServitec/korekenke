import React, { useEffect, useState } from "react";
import {
  Acl,
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
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
import { useDefaultFirestoreProps, useFormUtils } from "../../../../../hooks";
import { useGlobalData } from "../../../../../providers";
import {
  addLivestockAndEquine,
  getLivestockAndEquineId,
  updateLivestockAndEquine,
} from "../../../../../firebase/collections";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";
import { DATE_FORMAT_TO_FIRESTORE } from "../../../../../firebase/firestore";

export const LiveStockAndEquineIntegration = () => {
  const { livestockAndEquineId } = useParams();
  const navigate = useNavigate();
  const { livestockAndEquines } = useGlobalData();
  const { assignCreateProps, assignUpdateProps } = useDefaultFirestoreProps();

  const [loading, setLoading] = useState(false);
  const [livestockAndEquine, setLivestockAndEquine] = useState({});

  const isNew = livestockAndEquineId === "new";

  useEffect(() => {
    const _livestockAndEquine = isNew
      ? { id: getLivestockAndEquineId() }
      : livestockAndEquines.find(
          (livestockAndEquine) => livestockAndEquine.id === livestockAndEquineId
        );

    if (!_livestockAndEquine) return navigate(-1);

    setLivestockAndEquine(_livestockAndEquine);
  }, []);

  const mapLiveStockAndEquine = (formData) => ({
    ...livestockAndEquine,
    rightProfilePhoto: formData?.rightProfilePhoto || null,
    frontPhoto: formData?.frontPhoto || null,
    leftProfilePhoto: formData?.leftProfilePhoto || null,
    unit: formData.unit,
    greatUnit: formData.greatUnit,
    name: formData.name,
    registrationNumber: formData.registrationNumber,
    chipNumber: formData.chipNumber,
    gender: formData.gender,
    color: formData.color,
    birthdate: dayjs(formData.birthdate).format(DATE_FORMAT_TO_FIRESTORE),
    height: formData.height,
    father: formData.father,
    mother: formData.mother,
    origin: formData.origin,
    raceOrLine: formData.raceOrLine,
    fur: formData.fur,
    squadron: formData.squadron,
    description: formData.description,
  });

  const onSaveLivestockAndEquine = async (formData) => {
    try {
      setLoading(true);

      isNew
        ? await addLivestockAndEquine(
            assignCreateProps(mapLiveStockAndEquine(formData))
          )
        : await updateLivestockAndEquine(
            livestockAndEquine.id,
            assignUpdateProps(mapLiveStockAndEquine(formData))
          );

      notification({ type: "success" });
      onGoBack();
    } catch (e) {
      console.error("ErrorSaveEntity: ", e);
      notification({ type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const onGoBack = () => navigate(-1);

  return (
    <LiveStockAndEquine
      isNew={isNew}
      livestockAndEquine={livestockAndEquine}
      onSaveLivestockAndEquine={onSaveLivestockAndEquine}
      loading={loading}
      onGoBack={onGoBack}
    />
  );
};

const LiveStockAndEquine = ({
  isNew,
  livestockAndEquine,
  onSaveLivestockAndEquine,
  loading,
  onGoBack,
}) => {
  const schema = yup.object({
    rightProfilePhoto: yup.mixed().required(),
    frontPhoto: yup.mixed().required(),
    leftProfilePhoto: yup.mixed().required(),
    unit: yup.string().required(),
    greatUnit: yup.string().required(),
    name: yup.string().required(),
    registrationNumber: yup.string().required(),
    chipNumber: yup.number().required(),
    gender: yup.string().required(),
    color: yup.string().required(),
    birthdate: yup.date().required(),
    height: yup.string().required(),
    father: yup.string().required(),
    mother: yup.string().required(),
    origin: yup.string().required(),
    raceOrLine: yup.string().required(),
    fur: yup.string().required(),
    squadron: yup.string().required(),
    description: yup.string(),
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
  }, [livestockAndEquine]);

  const resetForm = () => {
    reset({
      rightProfilePhoto: livestockAndEquine?.rightProfilePhoto || null,
      frontPhoto: livestockAndEquine?.frontPhoto || null,
      leftProfilePhoto: livestockAndEquine?.leftProfilePhoto || null,
      unit: livestockAndEquine?.unit || "",
      greatUnit: livestockAndEquine?.greatUnit || "",
      name: livestockAndEquine?.name || "",
      registrationNumber: livestockAndEquine?.registrationNumber || "",
      gender: livestockAndEquine?.gender || "",
      chipNumber: livestockAndEquine?.chipNumber || "",
      color: livestockAndEquine?.color || "",
      birthdate: livestockAndEquine?.birthdate
        ? dayjs(livestockAndEquine.birthdate, DATE_FORMAT_TO_FIRESTORE)
        : undefined,
      height: livestockAndEquine?.height || "",
      father: livestockAndEquine?.father || "",
      mother: livestockAndEquine?.mother || "",
      origin: livestockAndEquine?.origin || "",
      raceOrLine: livestockAndEquine?.raceOrLine || "",
      fur: livestockAndEquine?.fur || "",
      squadron: livestockAndEquine?.squadron || "",
      description: livestockAndEquine?.description || "",
    });
  };

  const onSubmit = (formData) => {
    onSaveLivestockAndEquine(formData);
  };

  return (
    <Acl
      category="servicio-de-veterinaria-y-remonta-del-ejercito"
      subCategory="livestockAndEquines"
      name={
        isNew
          ? "/livestock-and-equines/new"
          : "/livestock-and-equines/:livestockAndEquineId"
      }
      redirect
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Title level={3}>Ganado o equino</Title>
        </Col>
        <Col span={24}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row gutter={[16, 16]}>
              <Col span={24} md={8}>
                <Controller
                  control={control}
                  name="rightProfilePhoto"
                  render={({ field: { onChange, value, onBlur, name } }) => (
                    <Upload
                      label="Foto perfil derecho"
                      accept="image/*"
                      buttonText="Subir foto"
                      value={value}
                      name={name}
                      withThumbImage={false}
                      bucket="servicioDeVeterinariaYRemontaDelEjercito"
                      fileName={`right-profile-photo-${uuidv4()}`}
                      filePath={`livestock-and-equines/${livestockAndEquine.id}/photos`}
                      onChange={(file) => onChange(file)}
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
                  render={({ field: { onChange, value, onBlur, name } }) => (
                    <Upload
                      label="Foto frontal"
                      accept="image/*"
                      buttonText="Subir foto"
                      value={value}
                      name={name}
                      withThumbImage={false}
                      bucket="servicioDeVeterinariaYRemontaDelEjercito"
                      fileName={`front-photo-${uuidv4()}`}
                      filePath={`livestock-and-equines/${livestockAndEquine.id}/photos`}
                      onChange={(file) => onChange(file)}
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
                  render={({ field: { onChange, value, onBlur, name } }) => (
                    <Upload
                      label="Foto perfil izquierdo"
                      accept="image/*"
                      buttonText="Subir foto"
                      value={value}
                      name={name}
                      withThumbImage={false}
                      bucket="servicioDeVeterinariaYRemontaDelEjercito"
                      fileName={`right-profile-photo-${uuidv4()}`}
                      filePath={`livestock-and-equines/${livestockAndEquine.id}/photos`}
                      onChange={(file) => onChange(file)}
                      required={required(name)}
                      error={error(name)}
                    />
                  )}
                />
              </Col>
              <Col span={6}>
                <Controller
                  name="unit"
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <Input
                      label="Unidad"
                      name={name}
                      value={value}
                      onChange={onChange}
                      error={error(name)}
                      required={required(name)}
                    />
                  )}
                />
              </Col>
              <Col span={6}>
                <Controller
                  name="greatUnit"
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <Input
                      label="Gran Unidad"
                      name={name}
                      value={value}
                      onChange={onChange}
                      error={error(name)}
                      required={required(name)}
                    />
                  )}
                />
              </Col>
              <Col span={6}>
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

              <Col span={6}>
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
            </Row>

            <Row gutter={[16, 16]}>
              <Col span={8}>
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
              <Col span={8}>
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
              <Col span={8}>
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
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={6}>
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
              <Col span={6}>
                <Controller
                  name="chipNumber"
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <InputNumber
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
              <Col span={6}>
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
              <Col span={6}>
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
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={6}>
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
              <Col span={6}>
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
              <Col span={6}>
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
              <Col span={6}>
                <Controller
                  name="squadron"
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <Input
                      label="Escuadrón"
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
