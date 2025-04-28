import React from "react";
import { useNavigate } from "react-router";
import { Button } from "../../components/ui";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";

export const ProfileDocumentsLpt = () => {
  const navigate = useNavigate();
  return (
    <Container>
      <div className="card">
        <h2 className="title">Documentos disponibles</h2>
        <p className="description">
          Haz clic en el siguiente botón para ver o descargar el documento LPT
          en formato PDF.
        </p>
        <Button
          type="primary"
          className="download-button"
          onClick={() => navigate("/profile/documents/lpt")}
        >
          <FontAwesomeIcon icon={faFilePdf} className="icon" />
          Ver LPT
        </Button>
      </div>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  padding: 2rem;

  .card {
    background-color: #fdfdfd;
    border: 1px solid #ddd;
    border-radius: 12px;
    padding: 2rem;
    width: 100%;
    max-width: 500px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    text-align: center;
  }

  .title {
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }

  .description {
    margin-bottom: 1.5rem;
    color: #555;
  }

  .download-button {
    padding: 0.6em 1.2em;
    font-weight: bold;
    font-size: 1rem;
    border-radius: 8px;
    text-transform: uppercase;
    display: inline-flex;
    align-items: center;
    gap: 0.5em;
  }

  .icon {
    font-size: 1.1rem;
  }
`;
