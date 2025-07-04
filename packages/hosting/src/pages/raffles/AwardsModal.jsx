import React from "react";
import styled from "styled-components";

export const AwardsModal = ({ raffle }) => {
  const awards = raffle?.awardsPhoto || [];
  const isSingle = awards.length === 1;

  return (
    <Container>
      <h2 className="title">🎁 Premios del sorteo</h2>
      <div className={`grid ${isSingle ? "single" : ""}`}>
        {awards.map((photo, index) => (
          <div key={photo.uid || index} className="card">
            <img src={photo.url} alt={photo.name} className="image" />
          </div>
        ))}
      </div>
    </Container>
  );
};

const Container = styled.div`
  padding: 24px;
  max-height: 70vh;
  overflow-y: auto;

  .title {
    font-size: 26px;
    font-weight: 700;
    margin-bottom: 24px;
    text-align: center;
    color: #222;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .grid {
    display: grid;
    gap: 20px;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  }

  .grid.single {
    display: flex;
    justify-content: center;
    align-items: center;

    .card {
      max-width: 280px;
      width: 100%;
    }
  }

  .card {
    background-color: #fff;
    border: 2px solid #eaeaea;
    border-radius: 12px;
    padding: 12px;
    transition:
      transform 0.25s ease,
      box-shadow 0.25s ease;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.06);
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      transform: scale(1.03);
      box-shadow: 0 6px 14px rgba(0, 0, 0, 0.12);
      border-color: #ccc;
    }
  }

  .image {
    width: 100%;
    height: auto;
    border-radius: 10px;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
`;
