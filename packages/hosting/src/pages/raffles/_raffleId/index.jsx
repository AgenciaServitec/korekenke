import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDefaultFirestoreProps, useFormUtils } from "../../../hooks";
import {
  Acl,
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Legend,
  notification,
  Row,
  TextArea,
  Title,
} from "../../../components";
import { Space, Upload } from "antd";
import { useNavigate, useParams } from "react-router";
import {
  addRaffle,
  addRaffleParticipant,
  fetchRaffle,
  getRaffleId,
  getRaffleParticipantId,
  raffleParticipantsRef,
  updateRaffle,
} from "../../../firebase/collections/raffles";
import { useAuthentication } from "../../../providers";
import { faFileImport } from "@fortawesome/free-solid-svg-icons";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as XLSX from "xlsx";
import dayjs from "dayjs";

export const RaffleIntegration = () => {
  const { authUser } = useAuthentication();
  const navigate = useNavigate();
  const { raffleId } = useParams();
  const { assignCreateProps, assignUpdateProps } = useDefaultFirestoreProps();

  const [raffle, setRaffle] = useState({});
  const [loading, setLoading] = useState(false);
  const [participantsImport, setParticipantsImport] = useState("");
  const [quantityParticipants, setQuantityParticipants] = useState("");
  const [fileExcel, setFileExcel] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  const isNew = raffleId === "new";
  const onGoBack = () => navigate(-1);

  useEffect(() => {
    (async () => {
      const _raffle = isNew
        ? { id: getRaffleId() }
        : await fetchRaffle(raffleId);

      if (!_raffle) return onGoBack();

      setRaffle({
        ..._raffle,
        startDate: _raffle.startDate,
        endDate: _raffle.endDate,
      });
    })();
  }, []);

  const mapRaffle = (formData) => ({
    ...raffle,
    title: formData.title,
    group: formData.group,
    winningNumbers: formData.winningNumbers,
    durationSeconds: formData.durationSeconds,
    startDate: formData.startDate
      ? dayjs(formData.startDate).format("DD-MM-YYYY")
      : undefined,
    endDate: formData.endDate
      ? dayjs(formData.endDate).format("DD-MM-YYYY")
      : undefined,
    quantityParticipants: quantityParticipants,
    userId: authUser?.id,
  });

  const onSubmit = async (formData) => {
    try {
      setLoading(true);

      const participants = formData.participants?.split("\n").map((par) => ({
        id: getRaffleParticipantId(),
        fullName: par.split(":")[0],
        dni: par.split(":")[1],
        phone: {
          prefix: "+51",
          number: par.split(":")[2],
        },
      }));

      isNew
        ? await addRaffle(assignCreateProps(mapRaffle(formData)))
        : await updateRaffle(raffle.id, assignUpdateProps(mapRaffle(formData)));

      isNew &&
        participants.map(
          async (participant) =>
            await addRaffleParticipant(
              raffle.id,
              assignCreateProps(participant),
            ),
        );

      notification({ type: "success", message: "Se guardó correctamente." });
      onGoBack();
    } catch (e) {
      console.error(e);
      notification({ type: "error", message: "No se guardó correctamente." });
    } finally {
      setLoading(false);
    }
  };

  const onImportParticipants = () => {
    const file = fileExcel;

    if (!file) return;

    setUploadLoading(true);

    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheet];
      const json = XLSX.utils.sheet_to_json(worksheet);

      const lineas = json.map((row) => {
        const nombre = row.nombres || row.Nombre || "";
        const dni = row.dni || row.DNI || "";
        const celular = row.celular || row.Celular || "";
        return `${nombre}:${dni}:${celular}`;
      });

      setParticipantsImport(lineas.join("\n"));
      setQuantityParticipants(json.length);

      setUploadLoading(false);
    };

    reader.onerror = () => {
      notification({ type: "error", message: "Error al leer el archivo" });
      setUploadLoading(false);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <Acl
      category="public"
      subCategory="raffles"
      name={isNew ? "/raffles/new" : "/raffles/:raffleId"}
      redirect
    >
      <RaffleForm
        isNew={isNew}
        raffle={raffle}
        loading={loading}
        fileExcel={fileExcel}
        onSetFileExcel={setFileExcel}
        uploadLoading={uploadLoading}
        onImportParticipants={onImportParticipants}
        participantsImport={participantsImport}
        onSubmit={onSubmit}
        onGoBack={onGoBack}
      />
    </Acl>
  );
};

const RaffleForm = ({
  isNew,
  raffle,
  loading,
  fileExcel,
  onSetFileExcel,
  onImportParticipants,
  participantsImport,
  onSubmit,
  onGoBack,
}) => {
  const schema = yup.object({
    title: yup.string(),
    group: yup.string(),
    winningNumbers: yup.number(),
    durationSeconds: yup.number(),
    startDate: yup.date().min(dayjs()),
    endDate: yup.date().min(yup.ref("startDate")),
    participants: yup.string(),
  });

  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { required, error } = useFormUtils({ errors, schema });

  useEffect(() => {
    resetForm();
  }, [raffle]);

  useEffect(() => {
    setValue("participants", participantsImport);
  }, [participantsImport]);

  const resetForm = () => {
    reset({
      title: raffle?.title || "",
      group: raffle?.group || "",
      winningNumbers: raffle?.winningNumbers || "",
      durationSeconds: raffle?.durationSeconds || "",
      startDate: raffle.startDate
        ? dayjs(raffle.startDate, "DD-MM-YYYY")
        : undefined,
      endDate: raffle.endDate ? dayjs(raffle.endDate, "DD-MM-YYYY") : undefined,
    });
  };

  const disabledDate = (current) =>
    current && current <= dayjs().startOf("day");

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Title level={2}>{isNew ? "Nuevo Sorteo" : "Editar Sorteo"}</Title>
      </Col>
      <Col span={24}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Controller
                name="title"
                control={control}
                render={({ field: { onChange, value, name } }) => (
                  <Input
                    label="Título del sorteo"
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
                name="group"
                control={control}
                render={({ field: { onChange, value, name } }) => (
                  <Input
                    label="Grupo"
                    name={name}
                    value={value}
                    onChange={onChange}
                    error={error(name)}
                    required={required(name)}
                  />
                )}
              />
            </Col>
            <Col xs={24} md={12}>
              <Controller
                name="startDate"
                control={control}
                render={({ field: { onChange, value, name } }) => (
                  <DatePicker
                    label="Fecha y hora de inicio"
                    name={name}
                    value={value}
                    onChange={onChange}
                    error={error(name)}
                    required={required(name)}
                    disabledDate={disabledDate}
                  />
                )}
              />
            </Col>
            <Col xs={24} md={12}>
              <Controller
                name="endDate"
                control={control}
                render={({ field: { onChange, value, name } }) => (
                  <DatePicker
                    label="Fecha y hora de cierre"
                    name={name}
                    value={value}
                    onChange={onChange}
                    error={error(name)}
                    required={required(name)}
                    disabledDate={disabledDate}
                  />
                )}
              />
            </Col>
            <Col span={24}>
              <Legend title="Animación de Ganador">
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Controller
                      name="winningNumbers"
                      control={control}
                      render={({ field: { onChange, value, name } }) => (
                        <Input
                          type="number"
                          label="N° Ganadores"
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
                      name="durationSeconds"
                      control={control}
                      render={({ field: { onChange, value, name } }) => (
                        <Input
                          type="number"
                          label="Duración en segundos"
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
              </Legend>
            </Col>
            {isNew && (
              <Col span={24}>
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Controller
                      name="participants"
                      control={control}
                      render={({ field: { onChange, value, name } }) => (
                        <TextArea
                          label="Participantes"
                          name={name}
                          value={value}
                          onChange={onChange}
                          error={error(name)}
                          required={required(name)}
                          rows={10}
                          placeholder="nombres:dni:celular"
                          disabled={participantsImport}
                        />
                      )}
                    />
                  </Col>
                  <Col span={24}>
                    <Space align="start">
                      <Upload
                        name="file"
                        onRemove={() => onSetFileExcel(null)}
                        beforeUpload={(file) => {
                          onSetFileExcel(file);
                          return false;
                        }}
                      >
                        <Button icon={<FontAwesomeIcon icon={faFileImport} />}>
                          Importar desde archivo
                        </Button>
                      </Upload>
                      {fileExcel && (
                        <Button onClick={onImportParticipants}>Importar</Button>
                      )}
                    </Space>
                  </Col>
                </Row>
              </Col>
            )}
            <Col span={24}>
              <Row justify="end" gutter={[16, 16]}>
                <Col xs={24} sm={6} md={4}>
                  <Button
                    type="default"
                    size="large"
                    block
                    onClick={onGoBack}
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
                    {isNew ? "Crear Sorteo" : "Guardar Cambios"}
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  );
};
