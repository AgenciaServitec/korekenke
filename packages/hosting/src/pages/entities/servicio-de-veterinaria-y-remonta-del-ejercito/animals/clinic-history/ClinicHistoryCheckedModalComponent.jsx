import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  DataEntryModal,
  Form,
  notification,
  Row,
  Select,
  Tag,
} from "../../../../../components";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFormUtils } from "../../../../../hooks";
import { clinicHistoriesRef } from "../../../../../firebase/collections";
import { faWarning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const ClinicHistoryCheckedModalComponent = ({
  user,
  isVisibleModal,
  onSetIsVisibleModal,
  onSetClinicHistoryId,
  currentHistoryClinic,
  animalId,
}) => {
  const [loading, setLoading] = useState(false);

  const mapForm = (formData) => ({
    checkedBy: {
      fullName: `${user?.paternalSurname} ${user?.maternalSurname} ${user?.firstName}`,
      id: user?.id,
      cip: user?.cip,
    },
    status: formData.checked,
  });

  const onUpdateStatusHistoryClinic = async (formData) => {
    try {
      setLoading(true);
      await clinicHistoriesRef(animalId)
        .doc(currentHistoryClinic.id)
        .update(mapForm(formData));

      onSetIsVisibleModal();
      onSetClinicHistoryId("");
      notification({ type: "success" });
    } catch (e) {
      console.log("Error:", e);
      notification({ type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ClinicHistoryCheckedModal
      isVisibleModal={isVisibleModal}
      onSetIsVisibleModal={onSetIsVisibleModal}
      onSetClinicHistoryId={onSetClinicHistoryId}
      currentHistoryClinic={currentHistoryClinic}
      loading={loading}
      onSubmit={onUpdateStatusHistoryClinic}
    />
  );
};

const ClinicHistoryCheckedModal = ({
  isVisibleModal,
  onSetIsVisibleModal,
  onSetClinicHistoryId,
  currentHistoryClinic,
  loading,
  onSubmit,
}) => {
  const schema = yup.object({
    checked: yup.string().required(),
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
  }, [currentHistoryClinic]);

  const resetForm = () => {
    reset({
      checked: currentHistoryClinic?.status || undefined,
    });
  };

  return (
    <DataEntryModal
      title="¿Desea cambiar el estado de este historial a revisado?"
      visible={isVisibleModal.historyClinicCheckModal}
      onCancel={() => {
        onSetClinicHistoryId("");
        onSetIsVisibleModal();
      }}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Tag color="red">
              <FontAwesomeIcon icon={faWarning} size="lg" /> Al realizar el
              cambio, no podras revertir esta acción
            </Tag>
          </Col>
          <Col span={24}>
            <Controller
              name="checked"
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <Select
                  label="Revisar"
                  name={name}
                  value={value}
                  options={[
                    {
                      label: "Pendiente",
                      value: "pending",
                    },
                    {
                      label: "Revisado",
                      value: "checked",
                    },
                  ]}
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
