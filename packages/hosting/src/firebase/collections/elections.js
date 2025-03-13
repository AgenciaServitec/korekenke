import { firestore } from "../index";
import { fetchCollectionOnce, fetchDocumentOnce } from "../utils";
import {
  querySnapshotToArray,
  setDocument,
  updateDocument,
} from "../firestore";
import { increment, serverTimestamp } from "firebase/firestore";
import { isBlankVote } from "../../pages/elections/_utils";

export const electionsRef = firestore.collection("elections");

const getElectionCandidatesRef = (electionId) =>
  electionsRef.doc(electionId).collection("candidates");

const getElectionVotersRef = (electionId) =>
  electionsRef.doc(electionId).collection("voters");

const getElectionVotesRef = (electionId) =>
  electionsRef.doc(electionId).collection("votes");

export const getElectionId = () => electionsRef.doc().id;

const recordVote = (batch, electionId, voteData) => {
  const voteRef = getElectionVotesRef(electionId).doc();
  batch.set(voteRef, {
    ...voteData,
    timestamp: serverTimestamp(),
  });
};

const updateVoterStatus = (batch, electionId, userId) => {
  const voterRef = getElectionVotersRef(electionId).doc(userId);
  batch.update(voterRef, {
    hasVoted: true,
    votedAt: serverTimestamp(),
  });
};

const updateResults = (batch, electionId, voteData) => {
  const electionRef = electionsRef.doc(electionId);
  const updateData = {
    "results.totalVotes": increment(1),
    "results.lastUpdated": serverTimestamp(),
  };

  if (isBlankVote(voteData.candidateId)) {
    updateData["results.blankVotes"] = increment(1);
  } else {
    updateData[`results.candidates.${voteData.candidateId}.votes`] =
      increment(1);
  }

  batch.update(electionRef, updateData);
};

const updateCandidateVotes = (batch, electionId, candidateId) => {
  if (!isBlankVote(candidateId)) {
    const candidateRef = getElectionCandidatesRef(electionId).doc(candidateId);
    batch.update(candidateRef, {
      votes: increment(1),
      percentage: increment(1),
    });
  }
};

const recalculatePercentages = async (electionId) => {
  const updatedResults = await fetchResults(electionId);
  const candidates = await fetchCandidates(electionId);

  const updatePercentageBatch = firestore.batch();

  candidates.forEach((candidate) => {
    const candidateRef = getElectionCandidatesRef(electionId).doc(candidate.id);
    const percentage = (candidate.votes / updatedResults.totalVotes) * 100;

    updatePercentageBatch.update(candidateRef, {
      percentage: percentage || 0,
    });
  });

  await updatePercentageBatch.commit();
};

export const fetchElection = async (electionId) =>
  fetchDocumentOnce(electionsRef.doc(electionId));

export const fetchElections = async () =>
  fetchCollectionOnce(electionsRef.where("isDeleted", "==", false));

export const addElection = async (election) => {
  const batch = firestore.batch();
  const electionRef = electionsRef.doc(election.id);

  const electionWithResults = {
    ...election,
    results: {
      totalVotes: 0,
      blankVotes: 0,
      candidates: {},
      lastUpdated: null,
    },
  };

  batch.set(electionRef, electionWithResults);

  election.allowedVoters.forEach((userId) => {
    const voterRef = getElectionVotersRef(election.id).doc(userId);
    batch.set(voterRef, {
      userId,
      hasVoted: false,
      votedAt: null,
    });
  });

  await batch.commit();
};

export const updateElection = async (electionId, election) => {
  const batch = firestore.batch();
  const electionRef = electionsRef.doc(electionId);

  batch.update(electionRef, election);

  if (election.allowedVoters) {
    await syncVoters(electionId, election.allowedVoters, batch);
  }

  await batch.commit();
};

const syncVoters = async (electionId, newAllowedVoters, batch) => {
  const votersRef = getElectionVotersRef(electionId);
  const queryVoters = await votersRef.get();

  const voters = querySnapshotToArray(queryVoters);

  voters.forEach((voter) => {
    if (!newAllowedVoters.includes(voter.id) && !voter.hasVoted) {
      batch.delete();
    }
  });

  newAllowedVoters.forEach((userId) => {
    const isUserAVoter = voters.some((voter) => voter.id === userId);

    if (!isUserAVoter) {
      const voterRef = votersRef.doc(userId);
      batch.set(voterRef, {
        userId,
        hasVoted: false,
        votedAt: null,
      });
    }
  });
};

export const submitVote = async (electionId, voteData) => {
  const batch = firestore.batch();

  recordVote(batch, electionId, voteData);
  updateVoterStatus(batch, electionId, voteData.userId);
  updateResults(batch, electionId, voteData);
  updateCandidateVotes(batch, electionId, voteData.candidateId);

  await batch.commit();
  await recalculatePercentages(electionId);
};

export const addCandidate = async (electionId, userId, candidate) => {
  const candidateRef = electionsRef
    .doc(electionId)
    .collection("candidates")
    .doc(userId);

  const candidateWithData = {
    ...candidate,
    id: userId,
    votes: 0,
    percentage: 0,
  };

  await setDocument(candidateRef, candidateWithData);
};

export const fetchCandidates = async (electionId) =>
  fetchCollectionOnce(getElectionCandidatesRef(electionId));

export const checkVoterEligibility = async (electionId, userId) => {
  const voterDoc = await getElectionVotersRef(electionId).doc(userId).get();
  return voterDoc.exists && !voterDoc.data().hasVoted;
};

export const fetchResults = async (electionId) => {
  const electionDoc = await fetchDocumentOnce(electionsRef.doc(electionId));
  const candidates = await fetchCandidates(electionId);

  return {
    ...electionDoc.results,
    candidates: candidates.map((candidate) => ({
      ...candidate,
      percentage: (candidate.votes / electionDoc.results.totalVotes) * 100 || 0,
    })),
    blankPercentage:
      (electionDoc.results.blankVotes / electionDoc.results.totalVotes) * 100 ||
      0,
  };
};

export const updateElectionStatus = async (electionId, status) => {
  return updateDocument(electionsRef.doc(electionId), { status });
};
