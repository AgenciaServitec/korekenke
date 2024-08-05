import React from "react";
import { Sheet } from "../../../../../../components";
import { isEmpty, orderBy } from "lodash";
import styled from "styled-components";
import { ApplicantDocumentsOrdered } from "../../../../../../data-list";

export const ApplicantDocumentsSheet = ({ applicant = null }) => {
  const applicantDocumentsView = Object.entries(applicant.documents)
    .map(([key, values]) => ({
      nameField: key,
      order: ApplicantDocumentsOrdered[key],
      documents: values?.numberCopies ? Array(1).fill(values) : null,
    }))
    .filter((document) => document.nameField !== "signaturePhoto");

  const applicantDocumentsOrdered = orderBy(
    applicantDocumentsView,
    ["order"],
    ["asc"],
  );

  return (
    <>
      {applicantDocumentsOrdered.map((applicantDocument, index) => {
        if (isEmpty(applicantDocument?.documents)) return null;
        return (
          <div key={index}>
            {applicantDocument.documents.map(
              (document, index) =>
                document?.url && (
                  <Sheet key={index}>
                    <Container>
                      <div className="sheet">
                        <h2>{document.label}</h2>
                        <img src={document.url} alt="user document" />
                      </div>
                    </Container>
                  </Sheet>
                ),
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
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    justify-items: center;
    align-items: center;
    gap: 3em;
  }

  h2 {
    font-size: 1.2em;
    font-family: Arial, Helvetica, sans-serif;
    text-align: center;
    text-transform: uppercase;
  }

  img {
    width: 100%;
  }
`;
