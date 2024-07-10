import React from "react";
import { Sheet } from "../../../../../../components";
import { isEmpty } from "lodash";
import styled from "styled-components";

export const ApplicantDocumentsSheet = ({ applicant = null }) => {
  const applicantDocuments = Object.entries(applicant.documents).map(
    ([key, values]) => ({
      nameField: key,
      documents: values?.numberCopies
        ? Array(values?.numberCopies).fill(values)
        : null,
    })
  );

  console.log(applicantDocuments);

  return (
    <>
      {applicantDocuments.map((applicantDocument, index) => {
        if (isEmpty(applicantDocument?.documents)) return null;

        return (
          <div key={index}>
            {applicantDocument.documents.map(
              (document, index) =>
                document?.url && (
                  <Sheet key={index}>
                    <Container>
                      <div className="sheet">
                        <img src={document.url} alt="" />
                      </div>
                    </Container>
                  </Sheet>
                )
            )}
          </div>
        );
      })}
    </>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 14px;
  padding: 2em;

  .sheet {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 3em;
  }

  img {
    width: 100%;
  }
`;
