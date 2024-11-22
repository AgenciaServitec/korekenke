import React from "react";
import styled from "styled-components";

export const Holiday1Sheet = ({ user }) => {
  console.log("user: ", user);

  return (
    <Container>
      <div className="sheet">
        <div className="title">
          <h2>Hoja 1</h2>
        </div>
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

    .title,
    .subTitle {
      padding: 0.5rem;
      text-align: center;

      h2 {
        font-size: 2em;
        font-weight: 500;
        margin: 0;
      }
    }
  }
`;
