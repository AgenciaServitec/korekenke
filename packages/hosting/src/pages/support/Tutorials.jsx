import React, { useEffect } from "react";
import styled from "styled-components";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import { getYouTubeId } from "../../utils";
import { tutorialsRef } from "../../firebase/collections";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Title, notification } from "../../components";

export const Tutorials = () => {
  const [tutorials = [], tutorialsLoading, tutorialsError] = useCollectionData(
    tutorialsRef.where("isDeleted", "==", false),
  );

  useEffect(() => {
    if (tutorialsError) {
      notification({ type: "error" });
    }
  }, [tutorialsError]);

  return (
    <Container>
      <Title level={1}>Tutoriales</Title>

      <TutorialGrid>
        {tutorials.map((tutorial) => (
          <TutorialCard key={tutorial.id}>
            <Title level={3} margin={0}>
              {tutorial.title}
            </Title>
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
            <p className="description">{tutorial.description}</p>
          </TutorialCard>
        ))}
      </TutorialGrid>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  min-height: 100svh;
`;

const TutorialGrid = styled.div`
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
`;

const TutorialCard = styled.div`
  background: #c5d1db;
  border-radius: 1em;
  overflow: hidden;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .video-content {
    position: relative;
    aspect-ratio: 16 / 9;
    margin-top: 1rem;

    .video-item {
      width: 100%;
      height: 100%;
    }
  }

  .description {
    padding-top: 1rem;
    font-size: 0.95rem;
  }
`;
