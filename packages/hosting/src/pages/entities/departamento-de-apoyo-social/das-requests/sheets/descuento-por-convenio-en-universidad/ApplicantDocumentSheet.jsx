import React from "react";
import styled from "styled-components";

export const ApplicantDocumentSheet = ({ applicant = null }) => {
  const documents = Object.entries(applicant.documents).map(
    ([key, values]) => ({
      nameField: key,
      documents: Array(values?.numberCopies).fill(values),
    })
  );

  console.log(documents);

  return (
    <Container>
      <div className="sheet">
        <img src="" alt="" />
      </div>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
`;
