import React from "react";
import {
  Button,
  Col,
  DataEntryModal,
  Form,
  Input,
  Row,
} from "../../../../../components";
import { Controller } from "react-hook-form";

export const ClinicHistoryModalChecked = ({
  isVisibleModal,
  onSetIsVisibleModal,
  onSetClinicHistoryId,
}) => {
  return (
    <DataEntryModal
      title="¿Desea cambiar el estado de este historial a revisado?"
      visible={isVisibleModal.checkHistoryClinicModal}
      onCancel={() => {
        onSetClinicHistoryId("");
        onSetIsVisibleModal();
      }}
    >
      <Form>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Controller
              name="symptomatology"
              defaultValue=""
              render={({ field: { onChange, value, name } }) => (
                <Input
                  label="Sintomatología"
                  name={name}
                  value={value}
                  onChange={onChange}
                />
              )}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Button type="primary" size="large" block htmlType="submit">
              Guardar
            </Button>
          </Col>
        </Row>
      </Form>
    </DataEntryModal>
  );
};
