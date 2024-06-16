import React from "react";
import styled from "styled-components";
import { faLock, faShield, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { mediaQuery } from "../../styles";
import { useAuthentication, useCommand } from "../../providers";
import { userFullName } from "../../utils/users/userFullName2";
import { pathnameWithCommand } from "../../utils";
import { useParams } from "react-router";

export const HomeIntegration = () => {
  const { authUser } = useAuthentication();
  const { commandId } = useParams();
  const { currentCommand } = useCommand();

  const onNavigateGoTo = (pathname) => pathnameWithCommand(commandId, pathname);

  return (
    <Container>
      <h1 className="title">
        ({currentCommand.code}) {currentCommand.name}
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
            </ul>
          </div>
        </div>
        <div>
          <div className="items-icon">
            <FontAwesomeIcon icon={faLock} size="5x" />
          </div>
          <div>
            <h2>SEGURIDAD</h2>
            <ul>
              <li>Tu información 100% segura en nuestra base de datos</li>
            </ul>
          </div>
        </div>
        {currentCommand.id === "copere" && (
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
        {currentCommand.id === "coede" && (
          <div>
            <div className="items-icon">
              <FontAwesomeIcon icon={faShield} size="5x" />
            </div>
            <div>
              <h2>SERVICIO DE VETERINARIA Y REMONTA DEL EJÉRCTIO</h2>
              <ul>
                <li>
                  <Link
                    to={onNavigateGoTo(
                      "/entities/servicio-de-veterinaria-y-remonta-del-ejercito/livestock-and-equines"
                    )}
                  >
                    1. Ganado y Equinos
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        )}
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

    > div {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 2em;
      background-color: rgb(186, 243, 186);
      border-radius: 1em;
      padding: 3em;

      ${mediaQuery.minDesktop} {
        flex-direction: row;
      }

      div:first-child {
        align-self: center;
      }

      h2 {
        text-align: center;
        font-weight: 500;
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
      }
    }
  }
`;
