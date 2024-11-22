import React, { useEffect, useState } from "react";
import { FullCalendarComponent, Modal } from "../../components";
import dayjs from "dayjs";
import { DATE_FORMAT_TO_FIRESTORE } from "../../firebase/firestore";

export const ViewRequestCalendar = ({
  visibleModal,
  onSetVisibleModal,
  request,
}) => {
  const FORMAT_DATE_FULLCALENDAR = "YYYY-MM-DD";

  const [renderCalendar, setRenderCalendar] = useState(false);

  useEffect(() => {
    let timer;
    if (visibleModal) {
      timer = setTimeout(() => {
        setRenderCalendar(true);
      }, 300);
    } else {
      setRenderCalendar(false);
    }

    return () => clearTimeout(timer);
  }, [visibleModal]);

  return (
    <Modal
      style={{ height: "auto" }}
      open={visibleModal}
      onCancel={() => onSetVisibleModal(false)}
      title="Calendario de vacaciones"
      closable
      width="90%"
      centered={false}
      destroyOnClose
    >
      {renderCalendar && (
        <FullCalendarComponent
          key={request?.id}
          startDate={dayjs(request?.startDate, DATE_FORMAT_TO_FIRESTORE).format(
            FORMAT_DATE_FULLCALENDAR,
          )}
          endDate={dayjs(request?.endDate, DATE_FORMAT_TO_FIRESTORE).format(
            FORMAT_DATE_FULLCALENDAR,
          )}
        />
      )}
    </Modal>
  );
};
