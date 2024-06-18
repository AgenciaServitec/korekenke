import React, { useEffect } from "react";
import { useParams } from "react-router";
import { firestore } from "../../../../../firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import styled from "styled-components";
import { notification, QRCode, Spinner } from "../../../../../components";
import {
  ImgNoFound,
  LogoArmyPeru,
  LogoServicioVeterinarioRemontaEjercito,
} from "../../../../../images";
import dayjs from "dayjs";
import { DATE_FORMAT_TO_FIRESTORE } from "../../../../../firebase/firestore";
import { useGlobalData } from "../../../../../providers";
import { userFullName } from "../../../../../utils/users/userFullName2";

export const PdfEquineLivestockRegistrationCard = () => {
  const { livestockAndEquineId } = useParams();
  const { departments, users, entities } = useGlobalData();
  const [
    livestockAndEquine,
    livestockAndEquineLoading,
    livestockAndEquineError,
  ] = useDocumentData(
    firestore.collection("livestock-and-equines").doc(livestockAndEquineId)
  );

  useEffect(() => {
    livestockAndEquineError && notification({ type: "error" });
  }, [livestockAndEquineError]);

  if (livestockAndEquineLoading) return <Spinner height="80vh" />;

  const genericSearch = (group, id) => {
    return group.find((_group) => _group.id === id);
  };

  const unitPELVETRCMDNEPR = genericSearch(
    departments,
    livestockAndEquine?.unit
  );

  const unitBossPELVETRCMDNEPR = genericSearch(
    users,
    unitPELVETRCMDNEPR?.bossId
  );

  const entitySVRE = genericSearch(entities, "lCBsn4NbEjt0lBtkBHeO");

  const entityBossSVRE = genericSearch(users, entitySVRE?.entityManageId);

  const entityRCMDNEPR = genericSearch(entities, "7zw9UxYVomBeXVyUayt6");

  const entityBossRCMDNEPR = genericSearch(
    users,
    entityRCMDNEPR?.entityManageId
  );

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
                      livestockAndEquine?.rightProfilePhoto?.url || ImgNoFound
                    }
                    alt="Perfil Izquierdo"
                  />
                </div>
                <div className="column_image">
                  <img
                    src={livestockAndEquine?.frontPhoto?.url || ImgNoFound}
                    alt="Perfil Frontal"
                  />
                </div>
                <div className="column_image">
                  <img
                    src={
                      livestockAndEquine?.leftProfilePhoto?.url || ImgNoFound
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
                  <li>: {unitPELVETRCMDNEPR?.name || ""}</li>
                  <li>: {livestockAndEquine?.greatUnit || ""}</li>
                  <li>: {livestockAndEquine?.name || ""}</li>
                  <li>: {livestockAndEquine?.registrationNumber || ""}</li>
                  <li>: {livestockAndEquine?.chipNumber || ""}</li>
                  <li>
                    :{" "}
                    {livestockAndEquine.gender === "male" ? "Macho" : "Hembra"}
                  </li>
                  <li>: {livestockAndEquine?.color || ""}</li>
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
                    {livestockAndEquine?.birthdate
                      ? dayjs(
                          livestockAndEquine?.birthdate,
                          DATE_FORMAT_TO_FIRESTORE
                        ).format("DD/MM/YYYY")
                      : ""}
                  </li>
                  <li>: {livestockAndEquine?.height || ""} Mts</li>
                  <li>: {livestockAndEquine?.father || ""}</li>
                  <li>: {livestockAndEquine?.mother || ""}</li>
                  <li>: {livestockAndEquine?.origin || ""}</li>
                  <li>: {livestockAndEquine?.raceOrLine || ""}</li>
                </ul>
              </div>
            </div>
            <div className="section_description">
              {livestockAndEquine?.description && (
                <>
                  <strong> Reseña: </strong> <br />
                  <p>{livestockAndEquine.description || ""}</p>
                </>
              )}
            </div>
            <div className="section_bottom">
              <div className="section_signature">
                <div className="signature_content">
                  <div className="signature_tittle">
                    <strong> JEFE DEL SVETRE</strong>
                  </div>
                  <div className="signature_img">
                    {entityBossSVRE?.signaturePhoto && (
                      <img
                        src={entityBossSVRE?.signaturePhoto.url}
                        alt="Perfil Izquierdo"
                      />
                    )}
                  </div>
                  <div className="signature_info">
                    <p>
                      <strong>0-{entityBossSVRE?.cip}</strong>
                    </p>
                    <p>
                      <strong>{userFullName(entityBossSVRE)}</strong>
                    </p>
                    <p>
                      <strong>CRL-EP</strong>
                    </p>
                    <p>
                      <strong>JEFE DEL {entitySVRE?.name}</strong>
                    </p>
                  </div>
                </div>
                <div className="signature_content">
                  <div className="signature_tittle">
                    <strong> JEFE DE UNIDAD</strong>
                  </div>
                  <div className="signature_img">
                    {entityBossRCMDNEPR?.signaturePhoto && (
                      <img
                        src={entityBossRCMDNEPR?.signaturePhoto.url}
                        alt="Perfil Izquierdo"
                      />
                    )}
                  </div>
                  <div className="signature_info">
                    <p>
                      <strong>O-{entityBossRCMDNEPR?.cip}-O+</strong>
                    </p>
                    <p>
                      <strong>{userFullName(entityBossRCMDNEPR)}</strong>
                    </p>
                    <p>
                      <strong>Coronel de Caballeria</strong>
                    </p>
                    <p>
                      <strong>Comandante del {entityRCMDNEPR?.name}</strong>
                    </p>
                  </div>
                </div>
                <div className="signature_content">
                  <div className="signature_tittle">
                    <strong> OFICIAL VETERINARIO</strong>
                  </div>
                  <div className="signature_img">
                    {unitBossPELVETRCMDNEPR?.signaturePhoto && (
                      <img
                        src={unitBossPELVETRCMDNEPR?.signaturePhoto.url}
                        alt="Perfil Izquierdo"
                      />
                    )}
                  </div>
                  <div className="signature_info">
                    <p>
                      <strong>O-{unitBossPELVETRCMDNEPR?.cip}-O+</strong>
                    </p>
                    <p>
                      <strong>{userFullName(unitBossPELVETRCMDNEPR)}</strong>
                    </p>
                    <p>
                      <strong>TTE S VET</strong>
                    </p>
                    <p>
                      <strong>JEFE {unitPELVETRCMDNEPR?.name}</strong>
                    </p>
                  </div>
                </div>
              </div>
              <div className="section_qr">
                <QRCode
                  value={window.location.href}
                  icon={LogoServicioVeterinarioRemontaEjercito}
                  iconSize={20}
                  type="svg"
                  size={100}
                  bordered={false}
                />
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
  font-size: 13px;
  padding: 2em;

  .sheet {
    width: 100%;
    height: 100%;
    padding: 1em;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    border: 5px solid #000;
    outline: 1px solid #000;
    outline-offset: 2px;
    margin: auto;

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
            font-weight: 500;
          }
          h2 {
            font-size: 2em;
            font-weight: 600;
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
      grid-template-rows: 17em;
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
        font-size: 0.8em;
        text-transform: uppercase;
        display: grid;
        gap: 0.1em;
      }
    }
  }

  .section_description {
    text-transform: uppercase;
    margin-bottom: 1em;
    font-size: 0.75em;
    p {
      text-transform: uppercase;
    }
  }

  .section_bottom {
    display: flex;

    .section_qr {
      display: flex;
      align-items: center;
    }
  }

  .section_signature {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: start;
    gap: 7em;

    .signature_content {
      text-align: center;

      .signature_tittle {
        font-size: 0.8em;
        margin-bottom: 0.3em;
      }

      .signature_img {
        height: 5em;
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
        text-transform: uppercase;
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
