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
} from "../../../../../components";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFormUtils } from "../../../../../hooks";
import { useGlobalData } from "../../../../../providers";
import { getLivestockAndEquineId } from "../../../../../firebase/collections";

export const LiveStockAndEquineIntegration = () => {
    const { livestockOrEquineId } = useParams();
    const navigate = useNavigate();
    const { livestockAndEquines } = useGlobalData();

    const [loading, setLoading] = useState(false);
    const [livestockAndEquine, setLivestockAndEquine] = useState({});

    const isNew = livestockOrEquineId === "new";

    useEffect(() => {
        const _livestockOrEquine = isNew
            ? { id: getLivestockAndEquineId() }
            : livestockAndEquines.find(
                (livestockAndEquine) => livestockAndEquine.id === livestockOrEquineId
            );
        if (!_livestockOrEquine) return navigate(-1);

        setLivestockAndEquine(_livestockOrEquine);
    }, []);

    const onSaveLivestockAndEquine = async (formData) => {
        try {
            setLoading(true);
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
        <LiveStockAndEquine onSaveLivestockAndEquine={onSaveLivestockAndEquine} />
    );
};

const LiveStockAndEquine = ({ onSaveLivestockAndEquine }) => {
    const schema = yup.object({
        unit: yup.string().required(),
        greatUnit: yup.string().required(),
        name: yup.string().required(),
        registrationNumber: yup.string().required(),
        chipNumber: yup.string().required(),
        gender: yup.string().required(),
        color: yup.string().required(),
        birthdate: yup.string().required(),
        height: yup.string().required(),
        father: yup.string().required(),
        mother: yup.string().required(),
        procedencia: yup.string().required(),
        raceOrLine: yup.string().required(),
        squadron: yup.string().required(),
        description: yup.string().required(),
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

    const onSubmit = (formData) => onSaveLivestockAndEquine(formData);

    return (
        <Acl name={""} redirect>
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Title level={3}>Equino</Title>
                </Col>
                <Col span={24}>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row gutter={[16, 16]}>
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
                            <Col span={6}>
                                <Controller
                                    name="procedencia"
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
                                            showSearch={false}
                                            filterOption={false}
                                            options={[
                                                {
                                                    value: "male",
                                                    label: "Macho",
                                                },
                                                {
                                                    value: "female",
                                                    label: "Hembra",
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
                                <Button type="default" size="large" block>
                                    Cancelar
                                </Button>
                            </Col>
                            <Col xs={24} sm={6} md={4}>
                                <Button
                                    type="primary"
                                    size="large"
                                    block
                                    htmlType="submit"
                                    loading={false}
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
