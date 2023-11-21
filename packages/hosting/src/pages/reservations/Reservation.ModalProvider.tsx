import React, { createContext, useContext, useState } from "react";
import { Modal } from "../../components/ui";

interface Context {
  onShowReservationModal: (modalProps: ModalProps) => void;
  onCloseReservationModal: () => void;
}

interface ModalProps {
  title: string;
  onRenderBody: (drivers: Driver[]) => JSX.Element;
  width?: React.CSSProperties["width"];
}

const ReservationModalContext = createContext<Context>({
  onShowReservationModal: () => console.log(),
  onCloseReservationModal: () => console.log(),
});

interface Props {
  children: JSX.Element;
  drivers: Driver[];
}

export const ReservationModalProvider = ({
  children,
  drivers,
}: Props): JSX.Element => {
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [modalProps, setModalProps] = useState<ModalProps>();

  const onShowReservationModal: Context["onShowReservationModal"] = (
    modalProps
  ) => {
    setVisibleModal(true);
    setModalProps(modalProps);
  };

  const onCloseReservationModal: Context["onCloseReservationModal"] = () => {
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

export const useReservationModal = (): Context =>
  useContext(ReservationModalContext);
