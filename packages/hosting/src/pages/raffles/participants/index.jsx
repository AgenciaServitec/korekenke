import React from "react";
import { modalConfirm } from "../../../components";
import { updateRaffle } from "../../../firebase/collections/raffles";
import { useNavigate } from "react-router";
import { useDefaultFirestoreProps } from "../../../hooks";
import { ModalProvider } from "../../../providers";
import { ParticipantsTable } from "./ParticipantsTable";

export const RafflesParticipants = () => {
  const navigate = useNavigate();
  const { assignCreateProps, assignUpdateProps, assignDeleteProps } =
    useDefaultFirestoreProps();

  const onEditParticipant = (raffleId) => navigate(raffleId);

  const onConfirmDeleteParticipant = async (raffleId) =>
    modalConfirm({
      title: "¿Estás seguro de eliminar este sorteo?",
      onOk: async () => {
        await updateRaffle(raffleId, assignDeleteProps({ isDeleted: true }));
      },
    });

  return (
    <ModalProvider>
      <ParticipantsTable
        onConfirmDeleteParticipant={onConfirmDeleteParticipant}
      />
    </ModalProvider>
  );
};
