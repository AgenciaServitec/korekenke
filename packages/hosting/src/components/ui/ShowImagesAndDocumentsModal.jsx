import React from "react";
import { Col, DataEntryModal, Image, Row } from "../../components";
import styled from "styled-components";
import { faFile, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isEmpty } from "lodash";

export const ShowImagesAndDocumentsModal = ({
  title = "",
  images = [],
  documents = [],
  isVisibleModal,
  onSetIsVisibleModal,
}) => {
  return (
    <DataEntryModal
      title={title}
      visible={isVisibleModal}
      onCancel={() => onSetIsVisibleModal()}
    >
      <Container>
        <Row gutter={[16, 16]}>
          {!isEmpty(images) && (
            <Col span={24}>
              <div className="images">
                <div>
                  <span>Imagenes</span>
                </div>
                <div className="body">
                  {images.map((image) => (
                    <Image key={image.uid} src={image.url} width={100} />
                  ))}
                </div>
              </div>
            </Col>
          )}
          {!isEmpty(documents) && (
            <Col span={24}>
              <div className="documents">
                <div>
                  <span>Documentos</span>
                </div>
                <div className="body">
                  {documents.map((document) => {
                    const iconDocument = (icon) => {
                      if (icon === "pdf") {
                        return <FontAwesomeIcon icon={faFilePdf} size="2x" />;
                      } else {
                        return (
                          <FontAwesomeIcon
                            icon={faFile}
                            size="2x"
                            color="#222"
                          />
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
          )}
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
