import React from "react";
import styled from "styled-components";
import { LogoPrimary, LogoArmyPeru } from "../../../../../../../images";

export const PdfDiscountAgreementGrantedUniversitySheet = () => {
  return (
    <Container>
      <div className="sheet">
        <div className="header">
          <img src={LogoArmyPeru} alt="" />
          <h2>Modelo de solicitud - Descuento por convenio en universidad</h2>
          <img src={LogoPrimary} alt="" />
        </div>
        <div className="main">
          <div className="">
            <p>SOLICITA:</p>
            <p>Descuento por convenio otorgado por la Universidad</p>
          </div>
          <div>
            <h2>
              SEÑOR GENERAL DE BRIGADA CMDTE GRAL DEL COMANDO DE BIENESTAR DEL
              EJÉRCITO (DEPARTAMENTO DE APOYO SOCIAL)
            </h2>
          </div>
        </div>
        <div className="footer"></div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 13px;
  padding: 2em;

  .sheet {
    width: 100%;

    .header {
      display: grid;
      grid-template-columns: auto 1fr auto;
      place-items: center;

      h2 {
        font-size: 1.5em;
        font-family: Arial, Helvetica, sans-serif;
        text-align: center;
        text-transform: uppercase;
        -webkit-text-stroke-width: 1px;
        -webkit-text-stroke-color: #000;
        color: red;
      }

      img {
        width: 4em;
        height: auto;
        object-fit: contain;
      }
    }
  }
`;
