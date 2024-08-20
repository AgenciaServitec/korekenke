import React from "react";
import styled from "styled-components";

export const FamilyTreeSheet = ({ animal, familyTreeView }) => {
  return (
    <Container>
      <div className="sheet">
        <div className="title">
          <h2>{animal?.cardTitle}</h2>
          <h3>Árbol genealógico</h3>
        </div>
        <div className="subTitle">
          <h2>{animal?.name}</h2>
          <h3>{animal?.registrationNumber}</h3>
        </div>
        <div className="family-tree-section">{familyTreeView(animal)}</div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 13px;
  padding: 2em;
  text-transform: uppercase;

  .sheet {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    border: 5px solid #000;
    outline: 1px solid #000;
    outline-offset: 2px;
    margin: auto;

    .title,
    .subTitle {
      padding: 0.5rem;
      border-bottom: 1.5px solid #000;
      text-align: center;

      h2 {
        font-size: 2em;
        font-weight: 500;
        margin: 0;
      }
      h3 {
        font-weight: 500;
        margin: 0;
      }
    }
  }

  .family-tree-section {
    text-align: center;

    .item {
      display: flex;
      font-size: 0.5rem;

      .item-information {
        min-width: 15.52rem;
        display: flex;
        flex-wrap: wrap;
        flex-direction: column;
        justify-content: center;
        padding: 0.1rem;
        border-bottom: 1.5px solid #000;
      }

      .family-tree-branch {
        display: flex;
        flex-direction: column;
      }
    }
  }
`;
