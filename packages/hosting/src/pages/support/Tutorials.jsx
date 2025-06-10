import React, { useEffect } from "react";
import { Row, Col, Title, notification } from "../../components";
import styled from "styled-components";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import { getYouTubeId } from "../../utils";
import { tutorialsRef } from "../../firebase/collections";
import { useCollectionData } from "react-firebase-hooks/firestore";

export const Tutorials = () => {
  const [tutorials = [], tutorialsLoading, tutorialsError] = useCollectionData(
    tutorialsRef.where("isDeleted", "==", false),
  );

  useEffect(() => {
    if (tutorialsError) {
      notification({
        type: "error",
      });
    }
  }, [tutorialsError]);

  return (
    <Container>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Title level={1}>Tutoriales</Title>
        </Col>

        {tutorials.map((tutorial) => (
          <Col span={24} key={tutorial.id} className="tutorial-section">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Title level={3} margin={0}>
                  {tutorial.title}
                </Title>
              </Col>
              <div className="videos-wrapper">
                <div className="video-card">
                  <div className="video-content">
                    <LiteYouTubeEmbed
                      id={getYouTubeId(tutorial.videoUrl)}
                      adNetwork={true}
                      title={tutorial.title}
                      iframeClass="video-item"
                      poster="maxresdefault"
                      width="100%"
                      height="100%"
                    />
                  </div>
                  <div className="title">
                    <h5>{tutorial.description}</h5>
                  </div>
                </div>
              </div>
            </Row>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  min-height: 100svh;

  .tutorial-section {
    margin-bottom: 2em;
  }

  .videos-wrapper {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    gap: 1em;

    .video-card {
      background: #c5d1db;
      border-radius: 1em;
      overflow: hidden;
      display: grid;
      grid-template-rows: 1fr 5em;
      width: 100%;
      max-width: 30em;
      min-height: 20em;

      .video-content {
        position: relative;

        .video-item {
          width: 100%;
          height: 100%;
        }
      }

      .title {
        padding: 1em;
      }
    }
  }
`;
