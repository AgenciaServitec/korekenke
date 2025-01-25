import React, { createContext, useContext, useState } from "react";
import { Modal } from "../components";

const ModalContext = createContext({
  onShowModal: () => console.log(),
  onCloseModal: () => console.log(),
});

export const ModalProvider = ({ children, dataSource }) => {
  const [visibleModal, setVisibleModal] = useState(false);
  const [modalProps, setModalProps] = useState();

  const onShowModal = (modalProps) => {
    setVisibleModal(true);
    setModalProps(modalProps);
  };

  const onCloseModal = () => {
    setVisibleModal(false);
    setModalProps(undefined);
  };

  return (
    <ModalContext.Provider value={{ onShowModal, onCloseModal }}>
      {children}
      <Modal
        open={visibleModal}
        onCancel={onCloseModal}
        title={modalProps?.title}
        closable
        width={modalProps?.width}
        height={modalProps?.height}
        centered={modalProps?.centered || false}
        destroyOnClose
        padding={modalProps?.padding || 10}
        style={{
          top: modalProps?.top || 20,
          overflow: "hidden",
          padding: modalProps?.padding || 10,
        }}
      >
        {modalProps?.onRenderBody && modalProps.onRenderBody(dataSource)}
      </Modal>
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
