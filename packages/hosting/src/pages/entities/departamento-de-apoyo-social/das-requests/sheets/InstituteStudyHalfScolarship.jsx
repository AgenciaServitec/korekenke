import React from "react";
import styled from "styled-components";
import { LogoPrimary, LogoArmyPeru } from "../../../../../images";

export const InstituteStudyHalfScolarshipSheet = () => {
  return (
    <Container>
      <div className="sheet">
        <div className="header">
          <img src={LogoArmyPeru} alt="" />
          <h2>Media Beca de estudios en instituto</h2>
          <img src={LogoPrimary} alt="" />
        </div>
        <div className="main">
          <div className="request">
            <span className="requests1">SOLICITA: </span>
            <span className="scolarship">
              MEDIA BECA DE ESTUDIO otorgada por el INSTITUTO ..........
            </span>
          </div>
          <div className="general">
            <h2>
              SEÑOR GENERAL DE BRIGADA CMDTE GRAL DEL COMANDO DE BIENESTAR DEL
              EJÉRCITO (DEPARTAMENTO DE APOYO SOCIAL)
            </h2>
          </div>
        </div>
        <div className="description">
          <p>S.G.</p>
          <span>
            ..........................................................................................................&nbsp;
            &nbsp; Grado ......................................&nbsp; con
            CIP.............................. en actual servicio
            ..............................................................................
            con teléf.&nbsp; .................. ante UD. con el debido respeto
            me presento y expongo:
          </span>
          <br />
          <br />
          <span>
            Que teniendo conocimiento que el INSTITUTO
            ..........................................................................
            por intermedio del COBIENE-DAS está otorgando BECA DE ESTUDIO por
            convenio al personal militar y civil del Ejército, solicito a Ud.,
            Mi General disponer a quien corresponda se me inscriba a fin de
            obtener este beneficio, para
            ....................................................................,
            en la especialidad o carrera de ...................................
            .
          </span>
        </div>
        <div className="end-description">
          <span>
            POR LO EXPUESTO:
            <br />A Ud.respuestuosamente solicito acceder a mi pedido.
          </span>
        </div>
        <div className="date">
          <span>Lima, ..... de .............. del 20.....</span>
        </div>
        <div className="firm">
          <strong>FIRMA</strong>
        </div>
        <div className="post-firm">
          <strong>
            Post FIRMA: ...........................................
          </strong>
          <br />
          <strong>
            CIP: .........................................................
          </strong>
        </div>
        <div className="footer">
          <span>
            <strong>PIEZAS ADJUNTAS:</strong>
          </span>

          <ul>
            <li>2 COPIAS DE CIP Y DNI (TITULAR)</li>
            <li>2 COPIAS DE CIF Y DNI (FAMILIAR)</li>
          </ul>
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 13px;
  padding: 2em;

  .sheet {
    width: 90%;
    margin: auto;

    .header {
      display: grid;
      grid-template-columns: auto 1fr auto;
      place-items: center;

      h2 {
        font-stretch: extra-condensed;
        font-size: 1.5em;
        font-family: Arial, Helvetica, sans-serif;
        text-align: center;
        text-transform: uppercase;
      }

      img {
        width: 4em;
        height: auto;
        object-fit: contain;
      }
    }

    .main {
      .request {
        gap: 1em;
        display: flex;
        width: 400px;
        margin-left: 220px;
        margin-top: 2em;
        margin-bottom: 2em;
        font-size: 16px;
      }
      .general {
        margin-bottom: 2em;
        h2 {
          font-size: 14px;
          text-align: center;
          line-height: 1em;
        }
      }
    }

    .description {
      font-size: 16px;
      font-family: Arial, Helvetica, sans-serif;
      text-align: justify;
      line-height: 1.6em;
    }

    .end-description {
      font-size: 16px;
      margin-top: 2em;
      width: 400px;
      margin-left: auto;
    }

    .date {
      margin-top: 2em;
      margin-left: auto;
      width: 200px;
      font-size: 16px;
    }

    .firm {
      border-top: 3px solid black;
      width: 200px;
      text-align: center;
      margin-left: auto;
      margin-top: 5em;
      padding-top: 0.8em;
    }

    .post-firm {
      margin-top: 4em;
      line-height: 2em;
      width: 230px;
      margin-left: auto;
    }

    .footer {
      margin-top: 2em;
      font-size: 16px;

      ul {
        list-style-type: none;
      }
    }
  }
`;
