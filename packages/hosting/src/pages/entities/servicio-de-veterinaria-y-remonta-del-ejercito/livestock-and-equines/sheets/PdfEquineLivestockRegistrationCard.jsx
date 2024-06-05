import React, { useEffect } from "react";
import { useParams } from "react-router";
import { firestore } from "../../../../../firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import styled from "styled-components";
import { notification, Spinner } from "../../../../../components";
import {
  ImgNoFound,
  LogoArmyPeru,
  LogoServicioVeterinarioRemontaEjercito,
} from "../../../../../images";
import moment from "moment";
import { DATE_FORMAT_TO_FIRESTORE } from "../../../../../firebase/firestore";

export const PdfEquineLivestockRegistrationCard = () => {
  const { livestockAndEquineId } = useParams();
  const [
    liveStockAndEquine,
    liveStockAndEquineLoading,
    liveStockAndEquineError,
  ] = useDocumentData(
    firestore.collection("livestock-and-equines").doc(livestockAndEquineId)
  );

  useEffect(() => {
    liveStockAndEquineError && notification({ type: "error" });
  }, [liveStockAndEquineError]);

  if (liveStockAndEquineLoading) return <Spinner height="80vh" />;

  return (
    <Container>
      <div className="sheet">
        <div className="header">
          <div className="header__item-left">
            <img src={LogoArmyPeru} alt="Ejercito del perú" />
          </div>
          <div className="header__item-center">
            <div>
              <h2>SERVICIO DE VETERINARIA Y REMONTA DEL EJÉRCITO</h2>
              <h3>TARJETA DE REGISTRO DE GANADO EQUINO</h3>
            </div>
          </div>
          <div className="header__item-right">
            <img
              src={LogoServicioVeterinarioRemontaEjercito}
              alt="Ejercito del perú"
            />
          </div>
        </div>
        <div className="main">
          <WrapperContent>
            <div className="section_images">
              <div className="section_images_wrapper">
                <div className="column_image">
                  <img
                    src={
                      liveStockAndEquine?.rightProfilePhoto?.url || ImgNoFound
                    }
                    alt="Perfil Izquierdo"
                  />
                </div>
                <div className="column_image">
                  <img
                    src={liveStockAndEquine?.frontPhoto?.url || ImgNoFound}
                    alt="Perfil Frontal"
                  />
                </div>
                <div className="column_image">
                  <img
                    src={
                      liveStockAndEquine?.leftProfilePhoto?.url || ImgNoFound
                    }
                    alt="Perfil Derecho"
                  />
                </div>
              </div>
            </div>
            <div className="section_information">
              <div className="section_information__column">
                <ul>
                  <li>UNIDAD</li>
                  <li>GRAN UNIDAD</li>
                  <li>NOMBRE</li>
                  <li>N° MATRICULA</li>
                  <li>N° CHIP</li>
                  <li>SEXO</li>
                  <li>COLOR</li>
                </ul>
              </div>
              <div className="section_information__column">
                <ul>
                  <li>: {liveStockAndEquine?.unit || ""}</li>
                  <li>: {liveStockAndEquine?.greatUnit || ""}</li>
                  <li>: {liveStockAndEquine?.name || ""}</li>
                  <li>: {liveStockAndEquine?.registrationNumber || ""}</li>
                  <li>: {liveStockAndEquine?.chipNumber || ""}</li>
                  <li>: {liveStockAndEquine?.gender || ""}</li>
                  <li>: {liveStockAndEquine?.color || ""}</li>
                </ul>
              </div>
              <div className="section_information__column">
                <ul>
                  <li>F. NACIMIENTO</li>
                  <li>TALLA</li>
                  <li>PADRE</li>
                  <li>MADRE</li>
                  <li>PROCEDENCIA</li>
                  <li>RAZA/LINEA</li>
                </ul>
              </div>
              <div className="section_information__column">
                <ul>
                  <li>
                    :{" "}
                    {liveStockAndEquine?.birthdate
                      ? moment(
                          liveStockAndEquine?.birthdate,
                          DATE_FORMAT_TO_FIRESTORE
                        ).format("DD/MM/YYYY")
                      : ""}
                  </li>
                  <li>: {liveStockAndEquine?.height || ""} Mts</li>
                  <li>: {liveStockAndEquine?.father || ""}</li>
                  <li>: {liveStockAndEquine?.mother || ""}</li>
                  <li>: {liveStockAndEquine?.origin || ""}</li>
                  <li>: {liveStockAndEquine?.raceOrLine || ""}</li>
                </ul>
              </div>
            </div>
            <div className="section_description">
              <strong> Reseña: </strong> <br />
              <p>{liveStockAndEquine?.description || ""}</p>
            </div>
            <div className="section_signature">
              <div className="signature_content">
                <div className="signature_tittle">
                  <strong> JEFE DEL SVETRE</strong>
                </div>
                <div className="signature_img">
                  <img
                    src="https://cdn.shopify.com/s/files/1/0594/4639/5086/files/Line_Through_Name.jpg"
                    alt="Perfil Izquierdo"
                  />
                </div>
                <div className="signature_info">
                  <p>
                    <strong>0-224163373</strong>
                  </p>
                  <p>
                    <strong>JUAN CARLOS HOLGUIN AVILA</strong>
                  </p>
                  <p>
                    <strong>CRL-EP</strong>
                  </p>
                  <p>
                    <strong>
                      JEFE DEL SERVICIO DE VETERINARIA Y REMONTA DEL EJERCITO
                    </strong>
                  </p>
                </div>
              </div>
              <div className="signature_content">
                <div className="signature_tittle">
                  <strong> JEFE DE UNIDAD</strong>
                </div>
                <div className="signature_img">
                  <img
                    src="https://cdn.shopify.com/s/files/1/0594/4639/5086/files/Line_Through_Name.jpg"
                    alt="Perfil Izquierdo"
                  />
                </div>
                <div className="signature_info">
                  <p>
                    <strong>O-226561074-O+</strong>
                  </p>
                  <p>
                    <strong>CARLOS OMAR RUIZ BARDALES</strong>
                  </p>
                  <p>
                    <strong>Coronel de Caballeria </strong>
                  </p>
                  <p>
                    <strong>Comandante del RC &quot;MDN&quot; EPR</strong>
                  </p>
                </div>
              </div>
              <div className="signature_content">
                <div className="signature_tittle">
                  <strong> OFICIAL VETERINARIO</strong>
                </div>
                <div className="signature_img">
                  <img
                    src="https://cdn.shopify.com/s/files/1/0594/4639/5086/files/Line_Through_Name.jpg"
                    alt="Perfil Izquierdo"
                  />
                </div>
                <div className="signature_info">
                  <p>
                    <strong>O-126259900 - O+</strong>
                  </p>
                  <p>
                    <strong>RODYNEL WALDIR GONZALES MAYTA</strong>
                  </p>
                  <p>
                    <strong>TTE S VET</strong>
                  </p>
                  <p>
                    <strong>JEFE PEL VET DEL RC &quot;MDN&quot;EPR</strong>
                  </p>
                </div>
              </div>
            </div>
          </WrapperContent>
        </div>
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
  border: 1px outset #000;
  font-size: 13px;
  padding: 1px;

  .sheet {
    width: 100%;
    height: 100%;
    padding: 1em;
    border: 4px inset #000;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    .header {
      display: grid;
      grid-template-columns: auto 1fr auto;
      margin-bottom: 0.5em;
      &__item-left {
        img {
          width: auto;
          height: 6em;
          object-fit: contain;
        }
      }
      &__item-center {
        display: grid;
        place-items: center;
        div {
          text-align: center;
          h2,
          h3 {
            margin: 0;
            font-weight: 600;
          }
          h2 {
            font-size: 2.1em;
            font-weight: 700;
          }
        }
      }
      &__item-right {
        img {
          width: auto;
          height: 6em;
          object-fit: contain;
        }
      }
    }
  }

  .section_images {
    display: grid;
    place-items: center;
    margin-bottom: 1em;

    .section_images_wrapper {
      display: grid;
      grid-template-columns: 1fr 13em 1fr;
      grid-template-rows: 18em;
      justify-content: center;
      margin: auto auto 1em auto;
      width: 100%;
      gap: 1em;
      position: relative;

      .column_image {
        width: 100%;
        height: 100%;
        margin: auto;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        &:first-child {
          display: flex;
          justify-content: end;
        }
        &:last-child {
          display: flex;
          justify-content: start;
        }
      }
    }
  }

  .section_information {
    width: 100%;
    display: flex;
    justify-content: space-between;

    margin-bottom: 1em;
    &__column {
      ul {
        list-style: none;
        padding: 0;
        margin: 0;
        font-weight: 600;
        font-size: 0.9em;
        text-transform: uppercase;
        display: grid;
        gap: 0.2em;
      }
    }
  }

  .section_description {
    font-size: 0.9em;
    text-transform: uppercase;
    margin-bottom: 1em;
    p {
      text-transform: uppercase;
    }
  }

  .section_signature {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: end;
    gap: 7em;

    .signature_content {
      text-align: center;

      .signature_tittle {
        font-size: 0.8em;
        margin-bottom: 0.3em;
      }

      .signature_img {
        img {
          width: auto;
          height: 5em;
        }
      }

      .signature_info {
        font-size: 0.7em;
        border-top: 1px solid #000;
        display: grid;
        gap: 0.2em;
        width: 19em;
        padding-top: 0.3em;
        p {
          margin: 0;
          letter-spacing: -1px;
        }
      }
    }
  }
`;

const WrapperContent = styled.div`
  width: 100%;
  height: 100%;
  padding: 0 2em;
  display: grid;
  grid-template-rows: auto auto auto 1fr;
`;
