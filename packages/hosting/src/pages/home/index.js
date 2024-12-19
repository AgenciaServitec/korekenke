import React from "react";
import styled from "styled-components";
import {
  faCalendarCheck,
  faClipboardList,
  faHorseHead,
  faPoll,
  faShield,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { mediaQuery } from "../../styles";
import { useAuthentication, useCommand } from "../../providers";
import { userFullName } from "../../utils/users/userFullName2";

export const HomeIntegration = () => {
  const { authUser } = useAuthentication();
  const { currentCommand } = useCommand();

  const onNavigateGoTo = (pathname) => pathname;

  const showAlert = !authUser?.workPlace;

  return (
    <Container>
      {showAlert && (
        <div className="alert-wrapper">
          <p>
            <strong>Atención:</strong> No tienes un lugar de trabajo
            configurado. Por favor, dirígete a tu perfil para agregarlo.
          </p>
          <Link to="/profile" className="alert-link">
            Ir a mi perfil
          </Link>
        </div>
      )}
      <h1 className="title">
        ({currentCommand?.code}) {currentCommand?.name}
      </h1>
      <div className="items">
        <div>
          <div className="items-icon">
            <FontAwesomeIcon icon={faUser} size="5x" />
          </div>
          <div>
            <h2>{userFullName(authUser)}</h2>
            <ul>
              <li>
                <Link to={onNavigateGoTo("/profile")}>1. Perfil</Link>
              </li>
              <li>
                <Link to={onNavigateGoTo("/my-agenda")}>2. Mi agenda</Link>
              </li>
              <li>
                <Link to={onNavigateGoTo("/assistances")}>3. Asistencia</Link>
              </li>
            </ul>
          </div>
        </div>
        <div>
          <div className="items-icon">
            <FontAwesomeIcon icon={faShield} size="5x" />
          </div>
          <div>
            <h2>DEPARTAMENTO DE APOYO SOCIAL</h2>
            <ul>
              <li>
                <Link
                  to={onNavigateGoTo(
                    "/entities/departamento-de-apoyo-social/das-requests/new",
                  )}
                >
                  1. Realizar una solicitud convenio descuento
                </Link>
              </li>
              <li>
                <Link
                  to={onNavigateGoTo(
                    "/entities/departamento-de-apoyo-social/das-requests",
                  )}
                >
                  2. Tu lista de solicitudes
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div>
          <div className="items-icon">
            <FontAwesomeIcon icon={faCalendarCheck} size="5x" />
          </div>
          <div>
            <h2>SOLICITUD DE VACACIONES</h2>
            <ul>
              <li>
                <Link to={onNavigateGoTo("/holidays-request/new")}>
                  1. Realizar solicitud
                </Link>
              </li>
              <li>
                <Link to={onNavigateGoTo("/holidays-request")}>
                  2. Tu lista de solicitudes
                </Link>
              </li>
            </ul>
          </div>
        </div>
        {currentCommand?.id === "copere" && (
          <div>
            <div className="items-icon">
              <FontAwesomeIcon icon={faShield} size="5x" />
            </div>
            <div>
              <h2>JEFATURA DE BIENESTAR DEL EJÉRCITO (COBIENE)</h2>
              <ul>
                <li>
                  <Link to={onNavigateGoTo("/correspondences")}>
                    1. Correspondencias
                  </Link>
                </li>
                <li>
                  <Link to={onNavigateGoTo("/inscriptions/cmsts")}>
                    2. Inscripción Circulo Militar
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        )}
        {currentCommand?.id === "cologe" && (
          <div>
            <div className="items-icon">
              <FontAwesomeIcon icon={faHorseHead} size="5x" />
            </div>
            <div>
              <h2>SERVICIO DE VETERINARIA Y REMONTA DEL EJÉRCITO</h2>
              <ul>
                <li>
                  <Link
                    to={onNavigateGoTo(
                      "/entities/servicio-de-veterinaria-y-remonta-del-ejercito/animals?animalType=equine",
                    )}
                  >
                    1. Equinos
                  </Link>
                </li>
                <li>
                  <Link
                    to={onNavigateGoTo(
                      "/entities/servicio-de-veterinaria-y-remonta-del-ejercito/animals?animalType=cattle",
                    )}
                  >
                    2. Vacunos
                  </Link>
                </li>
                <li>
                  <Link
                    to={onNavigateGoTo(
                      "/entities/servicio-de-veterinaria-y-remonta-del-ejercito/animals?animalType=canine",
                    )}
                  >
                    3. Caninos
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        )}
        <div>
          <div className="items-icon">
            <FontAwesomeIcon icon={faClipboardList} size="5x" />
          </div>
          <div>
            <h2>Correspondencias</h2>
            <ul>
              <li>
                <Link to="/correspondences/new">
                  1. Realizar correspondencia
                </Link>
              </li>
              <li>
                <Link to="/correspondences">2. Lista de correspondencias</Link>
              </li>
            </ul>
          </div>
        </div>
        <div>
          <div className="items-icon">
            <FontAwesomeIcon icon={faPoll} size="5x" />
          </div>
          <div>
            <h2>Encuesta</h2>
            <ul>
              <li>
                <Link to="/surveys/organizational-climate-studies/new">
                  1. Realizar encuesta de estudio del clima organizacional
                </Link>
              </li>
              <li>
                <Link to="/surveys/organizational-climate-studies">
                  2. Lista de estudio del clima organizacional
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Container>
  );
};

const Container = styled.section`
  .title {
    text-align: center;
    font-size: 1.8em;
    font-weight: 500;
    text-transform: uppercase;
  }

  .items {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1em;
    color: #000;

    ${mediaQuery.minTablet} {
      grid-template-columns: 1fr 1fr;
    }

    & > div {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 2em;
      background-color: rgba(212, 246, 46, 0.23);
      border-radius: 1em;
      padding: 3em;
      position: relative;
      box-shadow:
        0px 4px 8px rgba(0, 0, 0, 0.2),
        inset 0px 2px 4px rgba(255, 255, 255, 0.1);

      ${mediaQuery.minDesktop} {
        flex-direction: row;
      }

      div:first-child {
        align-self: center;
      }

      h2 {
        text-align: center;
        font-weight: 700;
        font-size: 1.2em;
        margin-bottom: 1em;
        text-transform: uppercase;

        ${mediaQuery.minDesktop} {
          font-size: 1.5em;
          text-align: left;
        }
      }

      ul {
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 1em;

        ${mediaQuery.minDesktop} {
          font-size: 1.1rem;
        }
      }
    }
  }

  .alert-wrapper {
    background-color: #f8d7da;
    color: #842029;
    padding: 1.5em;
    margin-bottom: 1em;
    border: 1px solid #f5c2c7;
    border-radius: 8px;

    p {
      margin: 0 0 1em 0;
    }

    .alert-link {
      display: inline-block;
      padding: 0.5em 1em;
      background-color: #842029;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
    }

    .alert-link:hover {
      background-color: #6d1a22;
    }
  }
`;
