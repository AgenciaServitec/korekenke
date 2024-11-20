import React from "react";
import { FullCalendarComponent, Modal } from "../../components";

export const ViewRequestCalendar = ({
  visibleModal,
  onSetVisibleModal,
  request,
}) => {
  return (
    <Modal
      style={{ height: "auto" }}
      open={visibleModal}
      onCancel={() => onSetVisibleModal(false)}
      title="Calendario de vacaciones"
      closable
      width="50%"
      centered={false}
      destroyOnClose
    >
      <FullCalendarComponent
        key={request?.id}
        startDate={request?.startDate}
        endDate={request?.endDate}
      />
    </Modal>
  );
};
