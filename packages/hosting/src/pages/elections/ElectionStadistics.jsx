import React, { useEffect, useState } from "react";
import { Card, Progress, Spin, Tag } from "../../components";
import { fetchElection, fetchResults } from "../../firebase/collections";
import styled from "styled-components";

export const ElectionStatistics = ({ election }) => {
  const [_election, set_election] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  const electionId = election.id;

  useEffect(() => {
    const loadData = async () => {
      try {
        const [electionData, resultsData] = await Promise.all([
          fetchElection(electionId),
          fetchResults(electionId),
        ]);

        set_election(electionData);
        setResults(resultsData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [electionId]);

  if (loading) return <Spin size="large" />;

  return (
    <Container>
      <div className="progress-header">
        <h1>{_election?.title}</h1>
        <Tag color="#2f80ed">{_election?.status}</Tag>
      </div>
      <div className="stats-container">
        <Card className="total-votes">
          <h3>Total de votos</h3>
          <p>{results?.totalVotes}</p>
        </Card>

        <Card className="blank-votes">
          <h3>Votos en blanco</h3>
          <p>{results?.blankVotes}</p>
          <Progress percent={parseFloat(results?.blankPercentage.toFixed(3))} />
        </Card>
      </div>
      <div className="candidates-progress">
        <h2>Candidatos</h2>
        {results?.candidates?.map((candidate) => (
          <Card key={candidate.id} className="candidate-item">
            <div className="candidate-info">
              <h4>{candidate.name}</h4>
              <p>{candidate.slogan}</p>
            </div>
            <div className="vote-stats">
              <span>{candidate.votes} votos</span>
              <Progress
                percent={parseFloat(candidate.percentage.toFixed(2))}
                status="active"
              />
              <span>{candidate.percentage.toFixed(3)}%</span>
            </div>
          </Card>
        ))}
      </div>
    </Container>
  );
};

const Container = styled.div`
  .progress-header {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 30px;
  }

  .stats-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
  }

  .candidates-progress {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .candidate-item {
    display: flex;
    flex-direction: column;
    width: 100%;
    transition: 0.3s ease;
  }

  .candidate-item:hover {
    transform: translateX(5px);
  }

  .candidate-info,
  .vote-stats {
    width: 100%;
  }

  .vote-stats {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 5px;
  }

  .vote-stats > span {
    font-size: 0.9em;
    color: #666;
  }

  @media (max-width: 768px) {
    .candidate-item {
      align-items: stretch;
    }

    .vote-stats {
      margin-top: 10px;
    }
  }
`;
