import { firestore } from "../index";
import { fetchCollectionOnce, fetchDocumentOnce } from "../utils";
import { setDocument, updateDocument } from "../firestore";

export const electionsRef = firestore.collection("elections");

const getElectionCandidatesRef = (electionId) =>
  electionsRef.doc(electionId).collection("candidates");

const getElectionVotersRef = (electionId) =>
  electionsRef.doc(electionId).collection("voters");

const getElectionVotesRef = (electionId) =>
  electionsRef.doc(electionId).collection("voteValue");

export const getElectionId = () => electionsRef.doc().id;

export const fetchElection = async (electionId) =>
  fetchDocumentOnce(electionsRef.doc(electionId));

export const fetchElections = async () =>
  fetchCollectionOnce(electionsRef.where("isDeleted", "==", false));

export const addElection = async (election) =>
  setDocument(electionsRef.doc(election.id), election);

export const updateElection = async (electionId, election) =>
  updateDocument(electionsRef.doc(electionId), election);

export const addCandidate = async (electionId, candidate) =>
  setDocument(
    getElectionCandidatesRef(electionId).doc(candidate.id),
    candidate,
  );

export const fetchCandidates = async (electionId) =>
  fetchCollectionOnce(getElectionCandidatesRef(electionId));

export const checkVoterEligibility = async (electionId, userId) => {
  const election = await fetchElection(electionId);
  return election.allowedVoters.includes(userId);
};

export const getVoterStatus = async (electionId, userId) =>
  fetchDocumentOnce(getElectionVotersRef(electionId).doc(userId));

export const submitVote = async (electionId, voteData) => {
  const batch = firestore.batch();

  const voteRef = getElectionVotesRef(electionId).doc();
  batch.set(voteRef, {
    ...voteData,
    timestamp: new Date(),
  });

  const voterRef = getElectionVotersRef(electionId).doc(voteData.userId);
  batch.update(voterRef, {
    hasVoted: true,
    votedAt: new Date(),
  });

  await batch.commit();
};

export const fetchResults = async (electionId) =>
  fetchDocumentOnce(
    electionsRef.doc(electionId).collection("results").doc("results"),
  );

export const isBlankVote = (candidateId) => candidateId.endsWith("_blank"); // Asumiendo que el ID de voto en blanco termina con "_blank"

export const updateElectionStatus = async (electionId, status) => {
  return updateDocument(electionsRef.doc(electionId), { status });
};
