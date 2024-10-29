import React, { createContext, useContext, useState } from "react";
import { Modal } from "../../components";

const CorrespondenceModalContext = createContext({
  onShowCorrespondenceModal: () => console.log(),
  onCloseCorrespondenceModal: () => console.log(),
});

export const CorrespondenceModalProvider = ({ children, drivers }) => {
  const [visibleModal, setVisibleModal] = useState(false);
  const [modalProps, setModalProps] = useState();

  const onShowCorrespondenceModal = (modalProps) => {
    setVisibleModal(true);
    setModalProps(modalProps);
  };

  const onCloseCorrespondenceModal = () => {
    setVisibleModal(false);
    setModalProps(undefined);
  };

  return (
    <CorrespondenceModalContext.Provider
      value={{ onShowCorrespondenceModal, onCloseCorrespondenceModal }}
    >
      {children}
      <Modal
        open={visibleModal}
        onCancel={onCloseCorrespondenceModal}
        title={modalProps?.title}
        closable
        width={modalProps?.width}
        centered={false}
        destroyOnClose
      >
        {modalProps?.onRenderBody && modalProps.onRenderBody(drivers)}
      </Modal>
    </CorrespondenceModalContext.Provider>
  );
};

export const useCorrespondenceModal = () =>
  useContext(CorrespondenceModalContext);
