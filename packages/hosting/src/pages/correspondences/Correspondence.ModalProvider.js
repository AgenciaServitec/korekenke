import React, { createContext, useContext, useState } from "react";
import { Modal } from "../../components";

const ReservationModalContext = createContext({
  onShowReservationModal: () => console.log(),
  onCloseReservationModal: () => console.log(),
});

export const CorrespondenceModalProvider = ({ children, drivers }) => {
  const [visibleModal, setVisibleModal] = useState(false);
  const [modalProps, setModalProps] = useState();

  const onShowReservationModal = (modalProps) => {
    setVisibleModal(true);
    setModalProps(modalProps);
  };

  const onCloseReservationModal = () => {
    setVisibleModal(false);
    setModalProps(undefined);
  };

  return (
    <ReservationModalContext.Provider
      value={{ onShowReservationModal, onCloseReservationModal }}
    >
      {children}
      <Modal
        visible={visibleModal}
        onCancel={onCloseReservationModal}
        title={modalProps?.title}
        closable
        width={modalProps?.width}
        centered={false}
        destroyOnClose
      >
        {modalProps?.onRenderBody && modalProps.onRenderBody(drivers)}
      </Modal>
    </ReservationModalContext.Provider>
  );
};

export const useReservationModal = () => useContext(ReservationModalContext);
