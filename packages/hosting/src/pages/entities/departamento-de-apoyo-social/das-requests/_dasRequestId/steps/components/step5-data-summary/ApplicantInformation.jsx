import React from "react";
import { Col, Row, Image } from "../../../../../../../../components";
import styled from "styled-components";

export const ApplicantInformation = ({ applicant }) => {
  if (!applicant) return null;

  const { documents } = applicant;

  return (
    <Container>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <div className="images-wrapper">
            {Object.entries(documents || {}).map(([key, values]) => {
              return (
                values?.label &&
                values?.url && (
                  <div key={key} className="item-card">
                    <div className="header">
                      <span>{values?.label}</span>
                    </div>
                    <div className="body">
                      <Image src={values?.url} width={200} />
                    </div>
                  </div>
                )
              );
            })}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;

  .images-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 1em;

    .item-card {
      border: 1px solid #a1a0a0;
      border-radius: 1em;
      display: grid;
      grid-template-rows: auto 1fr;
      overflow: hidden;

      .header {
        padding: 0.5em;
        background: #eef3f9;
        font-size: 0.9em;
        font-weight: 500;
      }

      .body {
        padding: 0.5em;
        display: grid;
        place-items: center;
      }
    }
  }
`;
