import React from "react";
import { Col, Modal, Row, Tag, Image } from "../../../../components";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { isEmpty } from "lodash";

export const ReplyDasRequestInformationModal = ({
  visibleModal,
  onSetVisibleModal,
  response,
}) => {
  return (
    <Modal
      open={visibleModal}
      onCancel={() => onSetVisibleModal(false)}
      title="Detalle de respuesta"
      closable
      width="50%"
      centered={false}
      destroyOnClose
    >
      <Container>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <div className="wrapper-item">
              <span className="label">Mensaje:</span>
              <div className="message" style={{ whiteSpace: "pre-line" }}>
                {response?.message}
              </div>
            </div>
          </Col>
          <Col span={24}>
            <div className="wrapper-item">
              <span className="label">Tipo de respuesta:</span>
              <div>
                <Tag color={response?.type === "positive" ? "green" : "red"}>
                  {response?.type === "positive" ? "Positivo" : "Negativo"}
                </Tag>
              </div>
            </div>
          </Col>
          {!isEmpty(response?.images) && (
            <Col span={24}>
              <div className="wrapper-item">
                <span className="label">Imagenes adjuntos:</span>
                <div className="images-wrapper">
                  {(response?.images || []).map((image, index) => {
                    return (
                      <div key={index} className="item-card">
                        <div className="body">
                          <Image src={image.url} width={70} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Col>
          )}
          {!isEmpty(response?.documents) && (
            <Col span={24}>
              <div className="wrapper-item">
                <span className="label">Documentos adjuntos:</span>
                <div className="images-wrapper">
                  {(response?.documents || []).map((document, index) => {
                    return (
                      <div key={index} className="item-card">
                        <div className="body">
                          <a
                            href={document.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FontAwesomeIcon icon={faFilePdf} size="2x" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Col>
          )}
        </Row>
      </Container>
    </Modal>
  );
};

const Container = styled.div`
  width: 100%;

  .wrapper-item {
    .message {
      background: #eff9fd;
      padding: 0.2em 0.7em;
      border-radius: 0.7em;
    }
  }

  .images-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 1em;

    .item-card {
      border: 1px solid #a1a0a0;
      border-radius: 0.7em;
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
