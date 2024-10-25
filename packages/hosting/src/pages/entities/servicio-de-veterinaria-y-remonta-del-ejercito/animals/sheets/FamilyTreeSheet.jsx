import React from "react";
import styled from "styled-components";
import { isEmpty } from "lodash";

export const FamilyTreeSheet = ({ animal }) => {
  let count = 0;

  const familyTreeView = (animal) => {
    return (animal?.parents || []).map((_animal) => {
      count = count + 1;

      return (
        <ItemParent
          key={_animal.id}
          className="item"
          existsInformation={!isEmpty(_animal?.fullName)}
        >
          <div className="item-information">
            <span className="full-name">{_animal?.fullName}</span>
            <span>{_animal?.registrationNumber}</span>
            <span>{_animal?.raceOrLine}</span>
          </div>
          {count === 4 ? (
            ""
          ) : (
            <div className="family-tree-branch">{familyTreeView(_animal)}</div>
          )}
        </ItemParent>
      );
    });
  };

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
    grid-template-rows: auto auto 1fr;
    border: 5px solid #000;
    outline: 1px solid #000;
    outline-offset: 2px;
    margin: auto;

    .title,
    .subTitle {
      padding: 0.5rem;
      border-bottom: 1px solid #000;
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
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
`;

const ItemParent = styled.div`
  display: flex;
  font-size: 0.46rem;

  .item-information {
    min-width: 15.52rem;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    justify-content: center;
    padding: ${({ existsInformation }) =>
      existsInformation ? " 0.1rem 0.2em" : " .9rem 0.2em"};

    border-bottom: 1px solid #000;
    gap: 0.2em;
    .full-name {
      font-weight: 700;
    }
  }

  .family-tree-branch {
    display: flex;
    flex-direction: column;
  }
`;
