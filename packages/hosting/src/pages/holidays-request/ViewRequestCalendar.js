import React from "react";
import { FullCalendarComponent, Modal } from "../../components";

export const ViewRequestCalendar = ({
  visibleModal,
  onSetVisibleModal,
  request,
}) => {
  // console.log("holidays:", request);
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
        startDate={request?.startDate}
        endDate={request?.endDate}
      />
    </Modal>
  );
};
