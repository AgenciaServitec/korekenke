import { firestore } from "../index";
import { fetchCollectionOnce, fetchDocumentOnce } from "../utils";
import { setDocument, updateDocument } from "../firestore";

export const rafflesRef = firestore.collection("raffles");

export const raffleParticipantsRef = (raffleId) =>
  rafflesRef.doc(raffleId).collection("participants");

export const getRaffleId = () => rafflesRef.doc().id;

export const fetchRaffle = async (raffleId) =>
  fetchDocumentOnce(rafflesRef.doc(raffleId));

export const fetchRaffles = async () =>
  fetchCollectionOnce(rafflesRef.where("isDeleted", "==", false));

export const addRaffle = async (raffle) =>
  setDocument(rafflesRef.doc(raffle.id), raffle);

export const updateRaffle = async (raffleId, raffle) =>
  updateDocument(rafflesRef.doc(raffleId), raffle);

export const addParticipant = async (raffleId, participant) =>
  await setDocument(
    raffleParticipantsRef(raffleId).doc(participant.id),
    participant,
  );

export const fetchParticipants = async (raffleId) =>
  fetchCollectionOnce(
    raffleParticipantsRef(raffleId).where("isDeleted", "==", false),
  );
