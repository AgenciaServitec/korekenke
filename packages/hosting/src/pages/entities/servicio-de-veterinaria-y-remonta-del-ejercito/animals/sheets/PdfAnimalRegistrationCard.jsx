import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import styled from "styled-components";
import { QRCode, Spinner } from "../../../../../components";
import {
  ImgNoFound,
  LogoArmyPeru,
  LogoServicioVeterinarioRemontaEjercito,
} from "../../../../../images";
import { useGlobalData } from "../../../../../providers";
import { userFullName } from "../../../../../utils/users/userFullName2";
import { findDegree, getAnimalEntitiesAndBosses } from "../../../../../utils";
import { AnimalsInformation } from "./AnimalsInformation";
import { AnimalsType } from "../../../../../data-list";
import { useQuery } from "../../../../../hooks";
import { fetchAnimal } from "../../../../../firebase/collections";

export const PdfAnimalRegistrationCard = () => {
  const { animalId } = useParams();
  const { animalType } = useQuery();
  const { users } = useGlobalData();

  const [loading, setLoading] = useState(true);
  const [animal, setAnimal] = useState(null);
  const [animalEntitiesAndBosses, setAnimalEntitiesAndBosses] = useState({});

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const _animal = await fetchAnimal(animalId);
        const result = await getAnimalEntitiesAndBosses(_animal);
        setAnimal(_animal);
        setAnimalEntitiesAndBosses(result);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Spinner height="80vh" />;

  const { entity, entityManage, unit, department, unitBoss, departmentBoss } =
    animalEntitiesAndBosses;

  return (
    <Container>
      <div className="sheet">
        <div className="header">
          <div className="header__item-left">
            <img src={LogoArmyPeru} alt="Ejercito del perú" />
          </div>
          <div className="header__item-center">
            <div>
              <h2>{AnimalsType[animalType].cardTitle}</h2>
              <h3>{AnimalsType[animalType].cardSubTitle}</h3>
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
                    src={animal?.rightProfilePhoto?.url || ImgNoFound}
                    alt="Perfil Izquierdo"
                  />
                </div>
                <div className="column_image">
                  <img
                    src={animal?.frontPhoto?.url || ImgNoFound}
                    alt="Perfil Frontal"
                  />
                </div>
                <div className="column_image">
                  <img
                    src={animal?.leftProfilePhoto?.url || ImgNoFound}
                    alt="Perfil Derecho"
                  />
                </div>
              </div>
            </div>
            <AnimalsInformation animal={animal} unit={unit} users={users} />
            <div className="section_description">
              {animal?.description && (
                <>
                  <strong> Reseña: </strong> <br />
                  <p>{animal.description || ""}</p>
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
                    {entityManage?.signaturePhoto && (
                      <img
                        src={entityManage?.signaturePhoto.url}
                        alt="Perfil Izquierdo"
                      />
                    )}
                  </div>
                  <div className="signature_info">
                    <p>
                      <strong>{entityManage?.cip}</strong>
                    </p>
                    <p>
                      <strong>{userFullName(entityManage)}</strong>
                    </p>
                    <p>
                      <strong>{findDegree(entityManage?.degree)?.label}</strong>
                    </p>
                    <p>
                      <strong>JEFE DEL {entity?.name}</strong>
                    </p>
                  </div>
                </div>
                <div className="signature_content">
                  <div className="signature_tittle">
                    <strong> JEFE DE UNIDAD</strong>
                  </div>
                  <div className="signature_img">
                    {unitBoss?.signaturePhoto && (
                      <img
                        src={unitBoss?.signaturePhoto.url}
                        alt="Perfil Izquierdo"
                      />
                    )}
                  </div>
                  <div className="signature_info">
                    <p>
                      <strong>{unitBoss?.cip}</strong>
                    </p>
                    <p>
                      <strong>{userFullName(unitBoss)}</strong>
                    </p>
                    <p>
                      <strong>{findDegree(unitBoss?.degree)?.label}</strong>
                    </p>
                    <p>
                      <strong>Jefe del {unit?.name}</strong>
                    </p>
                  </div>
                </div>
                <div className="signature_content">
                  <div className="signature_tittle">
                    <strong> OFICIAL VETERINARIO</strong>
                  </div>
                  <div className="signature_img">
                    {departmentBoss?.signaturePhoto && (
                      <img
                        src={departmentBoss?.signaturePhoto.url}
                        alt="Perfil Izquierdo"
                      />
                    )}
                  </div>
                  <div className="signature_info">
                    <p>
                      <strong>{departmentBoss?.cip}</strong>
                    </p>
                    <p>
                      <strong>{userFullName(departmentBoss)}</strong>
                    </p>
                    <p>
                      <strong>
                        {findDegree(departmentBoss?.degree)?.label}
                      </strong>
                    </p>
                    <p>
                      <strong>
                        JEFE {`${department?.name} DEL ${unit?.name}`}
                      </strong>
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
