import React from "react";
import { Col, DataEntryModal, Image, Row } from "../../../../../components";
import styled from "styled-components";
import { faFile, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { capitalize } from "lodash";

export const AuxiliaryExamsModalComponent = ({
  currentHistoryClinic,
  onSetClinicHistoryId,
  isVisibleModal,
  onSetIsVisibleModal,
}) => {
  const auxiliaryExams = currentHistoryClinic?.auxiliaryExams;

  return (
    <DataEntryModal
      title={`Examenes auxiliares "${capitalize(auxiliaryExams?.type)}"`}
      visible={isVisibleModal.auxiliaryExamsModal}
      onCancel={() => {
        onSetClinicHistoryId("");
        onSetIsVisibleModal();
      }}
    >
      <Container>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <div className="images">
              <div>
                <span>Imagenes</span>
              </div>
              <div className="body">
                {(auxiliaryExams?.images || []).map((image) => (
                  <Image key={image.uid} src={image.url} width={100} />
                ))}
              </div>
            </div>
          </Col>
          <Col span={24}>
            <div className="documents">
              <div>
                <span>Documentos</span>
              </div>
              <div className="body">
                {(auxiliaryExams?.documents || []).map((document) => {
                  const iconDocument = (icon) => {
                    if (icon === "pdf") {
                      return <FontAwesomeIcon icon={faFilePdf} size="2x" />;
                    } else {
                      return (
                        <FontAwesomeIcon icon={faFile} size="2x" color="#222" />
                      );
                    }
                  };

                  return (
                    <a
                      key={document.uid}
                      href={document.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {iconDocument(document.name.slice(-6).split(".")[1])}
                    </a>
                  );
                })}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </DataEntryModal>
  );
};

const Container = styled.div`
  width: 100%;

  .images,
  .documents {
    span {
      font-weight: 500;
    }
    .body {
      margin-top: 1em;
      display: flex;
      gap: 1em;
    }
  }
`;
