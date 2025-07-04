import React from "react";
import { Col, modalConfirm, Row, Spinner } from "../../components";
import { RafflesCards } from "./RafflesCards";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { rafflesRef, updateRaffle } from "../../firebase/collections/raffles";
import { useNavigate } from "react-router";
import { useDefaultFirestoreProps, useDevice } from "../../hooks";
import { ModalProvider, useAuthentication, useModal } from "../../providers";
import { AwardsModal } from "./AwardsModal";
import { WinnersInformationModal } from "./WinnersInformationModal";

export const RafflesIntegration = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthentication();
  const { assignDeleteProps } = useDefaultFirestoreProps();

  const [raffles = [], rafflesLoading, rafflesError] = useCollectionData(
    rafflesRef.where("isDeleted", "==", false),
  );

  const onEditRaffle = (raffleId) => navigate(raffleId);

  const onConfirmDeleteRaffle = async (raffleId) =>
    modalConfirm({
      title: "¿Estás seguro de eliminar este sorteo?",
      onOk: async () => {
        await updateRaffle(raffleId, assignDeleteProps({ isDeleted: true }));
      },
    });

  if (rafflesLoading) return <Spinner />;

  return (
    <ModalProvider>
      <Raffles
        raffles={raffles}
        onEditRaffle={onEditRaffle}
        onConfirmDeleteRaffle={onConfirmDeleteRaffle}
        user={authUser}
      />
    </ModalProvider>
  );
};

const Raffles = ({ raffles, onEditRaffle, onConfirmDeleteRaffle, user }) => {
  const { isTablet } = useDevice();
  const { onShowModal, onCloseModal } = useModal();

  const onShowAwardsModal = (raffle) => {
    onShowModal({
      width: `${isTablet ? "100%" : "70%"}`,
      onRenderBody: () => <AwardsModal raffle={raffle} />,
    });
  };
  const onShowWinnersModal = (raffleId, isOrganizer) => {
    onShowModal({
      width: `${isTablet ? "100%" : "70%"}`,
      onRenderBody: () => (
        <WinnersInformationModal
          raffleId={raffleId}
          isOrganizer={isOrganizer}
        />
      ),
    });
  };
  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <RafflesCards
          raffles={raffles}
          onEditRaffle={onEditRaffle}
          onConfirmDeleteRaffle={onConfirmDeleteRaffle}
          user={user}
          onShowAwardsModal={onShowAwardsModal}
          onShowWinnersModal={onShowWinnersModal}
        />
      </Col>
    </Row>
  );
};
