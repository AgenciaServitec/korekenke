import { firestore } from "../index";
import { fetchCollectionOnce, fetchDocumentOnce } from "../utils";
import { setDocument, updateDocument } from "../firestore";
import { clinicHistoriesRef } from "./clinicHistories";

export const rafflesRef = firestore.collection("raffles");

export const raffleParticipantsRef = (raffleId) =>
  rafflesRef.doc(raffleId).collection("participants");

export const raffleRequestsRef = (raffleId) =>
  rafflesRef.doc(raffleId).collection("requests");

export const getRaffleId = () => rafflesRef.doc().id;

export const fetchRaffle = async (raffleId) =>
  fetchDocumentOnce(rafflesRef.doc(raffleId));

export const fetchRaffles = async () =>
  fetchCollectionOnce(rafflesRef.where("isDeleted", "==", false));

export const addRaffle = async (raffle) =>
  setDocument(rafflesRef.doc(raffle.id), raffle);

export const updateRaffle = async (raffleId, raffle) =>
  updateDocument(rafflesRef.doc(raffleId), raffle);

export const getRaffleParticipantId = () => raffleParticipantsRef().doc().id;

export const addRaffleParticipant = async (raffleId, participant) =>
  await setDocument(
    raffleParticipantsRef(raffleId).doc(participant.id),
    participant,
  );

export const updateRaffleParticipant = async (
  raffleId,
  participantId,
  participant,
) =>
  await updateDocument(
    raffleParticipantsRef(raffleId).doc(participantId),
    participant,
  );

export const fetchRaffleParticipants = async (raffleId) =>
  fetchCollectionOnce(
    raffleParticipantsRef(raffleId).where("isDeleted", "==", false),
  );

export const getRaffleRequestId = () => raffleRequestsRef().doc().id;

export const addRaffleRequest = async (raffleId, request) =>
  await setDocument(raffleRequestsRef(raffleId).doc(request.id), request);

export const updateRaffleRequest = async (raffleId, requestId, request) =>
  await updateDocument(raffleRequestsRef(raffleId).doc(requestId), request);

export const fetchRaffleRequestByUserId = async (raffleId, userId) =>
  fetchCollectionOnce(
    raffleRequestsRef(raffleId)
      .where("userId", "==", userId)
      .where("isDeleted", "==", false)
      .limit(1),
  );
