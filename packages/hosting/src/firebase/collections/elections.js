import { firestore } from "../index";
import { fetchCollectionOnce, fetchDocumentOnce } from "../utils";
import { setDocument, updateDocument } from "../firestore";
import { increment, serverTimestamp } from "firebase/firestore";

export const electionsRef = firestore.collection("elections");

const getElectionCandidatesRef = (electionId) =>
  electionsRef.doc(electionId).collection("candidates");

const getElectionVotersRef = (electionId) =>
  electionsRef.doc(electionId).collection("voters");

const getElectionVoteValueRef = (electionId) =>
  electionsRef.doc(electionId).collection("voteValue");

const getElectionResultsRef = (electionId) =>
  electionsRef.doc(electionId).collection("results").doc("summary");

export const getElectionId = () => electionsRef.doc().id;

export const fetchElection = async (electionId) =>
  fetchDocumentOnce(electionsRef.doc(electionId));

export const fetchElections = async () =>
  fetchCollectionOnce(electionsRef.where("isDeleted", "==", false));

export const addElection = async (election) => {
  const batch = firestore.batch();
  const electionRef = electionsRef.doc(election.id);

  batch.set(electionRef, election);

  election.allowedVoters.forEach((userId) => {
    const voterRef = getElectionVotersRef(election.id).doc(userId);
    batch.set(voterRef, {
      userId,
      hasVoted: false,
      votedAt: null,
    });
  });

  const resultsRef = getElectionResultsRef(election.id);
  batch.set(resultsRef, {
    totalVotes: 0,
    blankVotes: 0,
    candidates: {},
  });
  await batch.commit();
  return election;
};

export const updateElection = async (electionId, election) => {
  const batch = firestore.batch();
  const electionRef = electionsRef.doc(electionId);

  batch.update(electionRef, election);

  if (election.allowedVoters) {
    await syncVoters(electionId, election.allowedVoters, batch);
  }

  await batch.commit();
  return election;
};

const syncVoters = async (electionId, newAllowedVoters, batch) => {
  const votersRef = getElectionVotersRef(electionId);
  const currentVoters = await votersRef.get();

  currentVoters.docs.forEach((doc) => {
    if (!newAllowedVoters.includes(doc.id) && !doc.data().hasVoted) {
      batch.delete(doc.ref);
    }
  });

  newAllowedVoters.forEach((userId) => {
    if (!currentVoters.docs.some((doc) => doc.id === userId)) {
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

  const voteRef = getElectionVoteValueRef(electionId).doc();
  batch.set(voteRef, {
    ...voteData,
    timestamp: serverTimestamp(),
  });

  const voterRef = getElectionVotersRef(electionId).doc(voteData.userId);
  batch.update(voterRef, {
    hasVoted: true,
    votedAt: serverTimestamp(),
  });

  const resultsRef = getElectionResultsRef(electionId);

  const updateData = {
    totalVotes: increment(1),
    lastUpdated: serverTimestamp(),
  };

  if (isBlankVote(voteData.candidateId)) {
    updateData.blankVotes = increment(1);
  } else {
    const candidateRef = getElectionCandidatesRef(electionId).doc(
      voteData.candidateId,
    );

    batch.update(candidateRef, {
      votes: increment(1),
      percentage: increment(1),
    });

    updateData[`candidates.${voteData.candidateId}.votes`] = increment(1);
  }

  batch.update(resultsRef, updateData);
  await batch.commit();

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
  return candidateWithData;
};

export const fetchCandidates = async (electionId) =>
  fetchCollectionOnce(getElectionCandidatesRef(electionId));

export const checkVoterEligibility = async (electionId, userId) => {
  const voterDoc = await getElectionVotersRef(electionId).doc(userId).get();
  return voterDoc.exists && !voterDoc.data().hasVoted;
};

export const getVoterStatus = async (electionId, userId) => {
  const voterDoc = await getElectionVotersRef(electionId).doc(userId).get();
  return voterDoc.exists ? voterDoc.data() : null;
};

export const fetchResults = async (electionId) => {
  const results = await fetchDocumentOnce(getElectionResultsRef(electionId));
  const candidates = await fetchCandidates(electionId);

  return {
    ...results,
    candidates: candidates.map((candidate) => ({
      ...candidate,
      percentage: (candidate.votes / results.totalVotes) * 100 || 0,
    })),
    blankPercentage: (results.blankVotes / results.totalVotes) * 100 || 0,
  };
};

export const isBlankVote = (candidateId) => candidateId === "blank";

export const updateElectionStatus = async (electionId, status) => {
  return updateDocument(electionsRef.doc(electionId), { status });
};
