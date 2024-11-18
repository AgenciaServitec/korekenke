import React from "react";
import { FullCalendarComponent, Modal, Row, Col } from "../../components";

export const ViewRequestCalendar = ({
  visibleModal,
  onSetVisibleModal,
  calendarData,
}) => {
  const processedDates = calendarData.map((datesTemp) => ({
    startDate: datesTemp.startDate,
    endDate: datesTemp.endDate,
  }));

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
        startDate={processedDates[0]?.startDate}
        endDate={processedDates[0]?.endDate}
      />
    </Modal>
  );
};
