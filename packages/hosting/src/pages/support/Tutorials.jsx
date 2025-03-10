import React from "react";
import { Row, Col, Title, Divider } from "../../components";
import styled from "styled-components";
import { TutorialsData } from "../../data-list";

export const Tutorials = () => {
  return (
    <Container>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Title level={1}>Tutoriales</Title>
        </Col>

        <h1>pablo</h1>
        {TutorialsData.map((tutorial, index) => (
          <Col span={24} key={index}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Title level={3} margin={0}>
                  {tutorial.title}
                </Title>
              </Col>
              <Divider style={{ marginBottom: 0 }} />
              <Col span={24}>
                <div className="videos-wrapper">
                  {tutorial.videos.map((video, index) => (
                    <div className="video-card" key={index}>
                      <div className="video-content">
                        <iframe
                          key={index}
                          width="100%"
                          height="100%"
                          src={video.src}
                          frameBorder="0"
                          allow="autoplay; encrypted-media"
                          allowFullScreen={true}
                          title="video"
                        ></iframe>
                      </div>
                      <div className="title">
                        <h5>{video.title}</h5>
                      </div>
                    </div>
                  ))}
                </div>
              </Col>
            </Row>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

const Container = styled.div`
  width: 100vw;

  .videos-wrapper {
    display: flex;
    flex-wrap: wrap;
    justify-content: start;
    gap: 1em;

    .video-card {
      background: #c5d1db;
      border-radius: 1em;
      overflow: hidden;
      display: grid;
      grid-template-rows: 1fr 5em;
      width: 100%;
      max-width: 35em;
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
