import React, { useEffect } from "react";
import { Col, Image, Row } from "../../components";
import { isEmpty } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { useAuthentication } from "../../providers";
import { updateCorrespondence } from "../../firebase/collections";
import { useBosses } from "../../hooks";

export const CorrespondenceFilesModal = ({
  correspondence,
  entityGuDASNameId,
}) => {
  const { authUser } = useAuthentication();
  const { fetchEntityManager } = useBosses();
  const { photos = [], documents = [] } = correspondence;

  useEffect(() => {
    (async () => {
      if (!correspondence) return;

      const entityGuManager = await fetchEntityManager(entityGuDASNameId);

      if (
        correspondence?.status === "pending" &&
        entityGuManager?.id === authUser?.id
      ) {
        await updateCorrespondence(correspondence.id, {
          status: "inProgress",
          wasRead: true,
        });
      }
    })();
  }, [correspondence]);

  return (
    <Container>
      <Row gutter={[16, 16]}>
        {!isEmpty(photos) && (
          <Col span={24}>
            <div className="images">
              <div>
                <span>Imagenes</span>
              </div>
              <div className="body">
                {photos.map((image) => (
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
        )}
      </Row>
    </Container>
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
