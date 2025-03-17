import React from "react";
import { Row, Col, Title, Divider } from "../../components";
import styled from "styled-components";
import { TutorialsData } from "../../data-list";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import { getYouTubeId } from "../../utils";

export const Tutorials = () => {
  return (
    <Container>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Title level={1}>Tutoriales</Title>
        </Col>
        {TutorialsData.map((tutorial, index) => (
          <Col span={24} key={index} className="tutorial-section">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Title level={3} margin={0}>
                  {tutorial.title}
                </Title>
              </Col>
              <div className="videos-wrapper">
                {tutorial.videos.map((video, index) => (
                  <div className="video-card" key={index}>
                    <div className="video-content">
                      <LiteYouTubeEmbed
                        id={video?.src ? getYouTubeId(video.src) : ""}
                        adNetwork={true}
                        title="korekenke tutoriales"
                        iframeClass="video-item"
                        poster="maxresdefault"
                        width="100%"
                        height="100%"
                      />
                    </div>
                    <div className="title">
                      <h5>{video.title}</h5>
                    </div>
                  </div>
                ))}
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
