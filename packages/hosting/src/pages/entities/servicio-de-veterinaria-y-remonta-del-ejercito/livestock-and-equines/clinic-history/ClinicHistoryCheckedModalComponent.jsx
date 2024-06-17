import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  DataEntryModal,
  Form,
  Row,
  Select,
  notification,
} from "../../../../../components";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFormUtils } from "../../../../../hooks";
import { clinicHistoriesRef } from "../../../../../firebase/collections";

export const ClinicHistoryCheckedModalComponent = ({
  authUser,
  isVisibleModal,
  onSetIsVisibleModal,
  onSetClinicHistoryId,
  currentHistoryClinic,
  livestockAndEquineId,
}) => {
  const [loading, setLoading] = useState(false);

  const mapForm = (formData) => ({
    checkedBy: {
      fullName: `${authUser?.paternalSurname} ${authUser?.maternalSurname} ${authUser?.firstName}`,
      id: authUser?.id,
      cip: authUser?.cip,
    },
    status: formData.checked,
  });

  const onUpdateStatusHistoryClinic = async (formData) => {
    try {
      setLoading(true);
      await clinicHistoriesRef(livestockAndEquineId)
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
      checked: currentHistoryClinic?.status || "",
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
            <Controller
              name="checked"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value, name } }) => (
                <Select
                  label="Revisar"
                  name={name}
                  value={value}
                  options={[
                    {
                      label: "Revisado",
                      value: "checked",
                    },
                    {
                      label: "Pendiente",
                      value: "pending",
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
