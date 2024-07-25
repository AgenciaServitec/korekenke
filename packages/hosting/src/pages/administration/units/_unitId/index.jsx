import React, { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { useDefaultFirestoreProps, useFormUtils } from "../../../../hooks";
import {
  Button,
  Col,
  Form,
  Input,
  notification,
  Row,
  Title,
} from "../../../../components";
import { useNavigate, useParams } from "react-router";
import {
  addUnit,
  fetchUnit,
  getUnitId,
} from "../../../../firebase/collections";
import { useCommand, useGlobalData } from "../../../../providers";
import { getNameId } from "../../../../utils";
import { lowerCase, update } from "lodash";

export const UnitIntegration = () => {
  const navigate = useNavigate();
  const { unitId } = useParams();
  const { rolesAcls } = useGlobalData();
  const [loading, setLoading] = useState();
  const [unit, setUnit] = useState({});
  const { currentCommand } = useCommand();
  const { assignCreateProps, assignUpdateProps } = useDefaultFirestoreProps();

  const isNew = unitId === "new";
  const onGoBack = () => navigate(-1);

  useEffect(() => {
    const _unit = isNew
      ? { id: getUnitId() }
      : (async () =>
          await fetchUnit(unitId).then((response) => {
            if (!response) return onGoBack();
            setUnit(response);
            return;
          }))();

    setUnit(_unit);
  }, []);

  const mapUnit = (formData) => ({
    ...unit,
    commandId: currentCommand.id,
    name: formData.name,
    nameId: getNameId(formData.name),
    abbreviation: lowerCase(formData.abbreviation),
    bossUnitId: formData.bossUnitId || null,
  });

  const saveUnit = async (formData) => {
    try {
      setLoading(true);

      isNew
        ? await addUnit(assignCreateProps(mapUnit(formData)))
        : await update(unit.id, assignUpdateProps(mapUnit(formData)));

      notification({ type: "success" });

      onGoBack();
    } catch (e) {
      console.error("ErrorSaveUnit: ", e);
      notification({ type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Unit
      unit={unit}
      rolesAcls={rolesAcls}
      loading={loading}
      onSaveUnit={saveUnit}
      onGoBack={onGoBack}
    />
  );
};

const Unit = ({ unit, loading, onSaveUnit, onGoBack }) => {
  const schema = yup.object({
    name: yup.string().required(),
    abbreviation: yup.string(),
    bossUnitId: yup.string().nullable(),
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
  }, [unit]);

  const resetForm = () => {
    reset({
      name: unit?.name || "",
      abbreviation: unit?.abbreviation || "",
      bossUnitId: unit?.bossUnitId || "",
    });
  };

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Title level={3}>Unidad</Title>
      </Col>
      <Col span={24}>
        <Form onSubmit={handleSubmit(onSaveUnit)}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Controller
                name="name"
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
                name="abbreviation"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, name } }) => (
                  <Input
                    label="Siglas"
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
                name="bossUnitId"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, name } }) => (
                  <Input
                    label="Jefe"
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
                disabled={loading}
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
  );
};
