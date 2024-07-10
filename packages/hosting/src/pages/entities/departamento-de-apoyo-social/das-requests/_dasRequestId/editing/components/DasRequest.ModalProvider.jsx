import React, { createContext, useContext, useState } from "react";
import { Modal } from "../../../../../../../components";

const DasRequestModalContext = createContext({
  onShowDasRequestModal: () => console.log(),
  onCloseDasRequestModal: () => console.log(),
});

export const DasRequestModalProvider = ({ children, dasRequest }) => {
  const [visibleModal, setVisibleModal] = useState(false);
  const [modalProps, setModalProps] = useState();

  const onShowDasRequestModal = (modalProps) => {
    setVisibleModal(true);
    setModalProps(modalProps);
  };

  const onCloseDasRequestModal = () => {
    setVisibleModal(false);
    setModalProps(undefined);
  };

  return (
    <DasRequestModalContext.Provider
      value={{ onShowDasRequestModal, onCloseDasRequestModal }}
    >
      {children}
      <Modal
        open={visibleModal}
        onCancel={onCloseDasRequestModal}
        title={modalProps?.title}
        closable
        width={modalProps?.width}
        centered={false}
        destroyOnClose
      >
        {modalProps?.onRenderBody && modalProps.onRenderBody(dasRequest)}
      </Modal>
    </DasRequestModalContext.Provider>
  );
};

export const useDasRequestModal = () => useContext(DasRequestModalContext);
