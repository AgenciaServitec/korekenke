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
      open={visibleModal}
      onCancel={() => onSetVisibleModal(false)}
      title="Calendario de vacaciones"
      closable
      width="50%"
      centered={false}
      destroyOnClose
      style={{ width: "80%", height: "80vh" }}
    >
      <Row gutter={[16, 16]} style={{ height: "100%" }}>
        <Col span={24} style={{ height: "100%" }}>
          <FullCalendarComponent
            startDate={processedDates[0]?.startDate}
            endDate={processedDates[0]?.endDate}
          />
        </Col>
      </Row>
    </Modal>
  );
};
