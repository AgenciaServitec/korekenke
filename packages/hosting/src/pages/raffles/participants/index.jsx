import React from "react";
import { modalConfirm, notification } from "../../../components";
import {
  raffleParticipantsRef,
  updateRaffleParticipant,
} from "../../../firebase/collections/raffles";
import { useDefaultFirestoreProps } from "../../../hooks";
import { ModalProvider } from "../../../providers";
import { ParticipantsTable } from "./ParticipantsTable";
import { useParams } from "react-router";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { isEmpty } from "lodash";

export const RafflesParticipants = () => {
  const { raffleId } = useParams();
  const { assignDeleteProps } = useDefaultFirestoreProps();

  const [participants = [], participantsLoading, participantsError] =
    useCollectionData(
      raffleParticipantsRef(raffleId).where("isDeleted", "==", false),
    );

  const onDeletedParticipants = async (
    removeParticipants,
    setRemoveParticipants,
  ) => {
    if (isEmpty(removeParticipants)) {
      setRemoveParticipants();
    }

    try {
      for (const participantId of participants) {
        await updateRaffleParticipant(
          raffleId,
          participantId,
          assignDeleteProps({ isDeleted: true }),
        );
      }

      setRemoveParticipants([]);

      notification({
        type: "success",
        message: "Se elimino todo los participantes",
      });
    } catch (e) {
      console.error(e);
      notification({
        type: "error",
        message: "No se elimino todo los participantes",
      });
    }
  };

  const onConfirmDeleteParticipant = async (participant) =>
    modalConfirm({
      title: "¿Estás seguro de eliminar este participante?",
      onOk: async () => {
        await updateRaffleParticipant(
          raffleId,
          participant.id,
          assignDeleteProps({ isDeleted: true }),
        );
      },
    });

  const onConfirmDeleteParticipants = async (
    removeParticipants,
    setRemoveParticipants,
  ) =>
    modalConfirm({
      title: "¿Estás seguro de eliminar todos los participantes?",
      onOk: async () =>
        onDeletedParticipants(removeParticipants, setRemoveParticipants),
    });

  return (
    <ModalProvider>
      <ParticipantsTable
        participants={participants}
        participantsLoading={participantsLoading}
        onConfirmDeleteParticipant={onConfirmDeleteParticipant}
        onConfirmDeleteParticipants={onConfirmDeleteParticipants}
      />
    </ModalProvider>
  );
};
