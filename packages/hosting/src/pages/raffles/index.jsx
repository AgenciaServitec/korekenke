import React from "react";
import { Col, modalConfirm, Row, Spinner } from "../../components";
import { RafflesCards } from "./RafflesCards";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { rafflesRef, updateRaffle } from "../../firebase/collections/raffles";
import { useNavigate } from "react-router";
import { useDefaultFirestoreProps } from "../../hooks";

export const RafflesIntegration = () => {
  const navigate = useNavigate();
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
    <Raffles
      raffles={raffles}
      onEditRaffle={onEditRaffle}
      onConfirmDeleteRaffle={onConfirmDeleteRaffle}
    />
  );
};

const Raffles = ({ raffles, onEditRaffle, onConfirmDeleteRaffle }) => {
  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <RafflesCards
          raffles={raffles}
          onEditRaffle={onEditRaffle}
          onConfirmDeleteRaffle={onConfirmDeleteRaffle}
        />
      </Col>
    </Row>
  );
};
