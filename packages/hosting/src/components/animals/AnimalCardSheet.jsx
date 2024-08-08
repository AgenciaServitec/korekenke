import React from "react";
import {
    ImgNoFound,
    LogoArmyPeru,
    LogoServicioVeterinarioRemontaEjercito,
} from "../../images";
import { userFullName } from "../../utils/users/userFullName2";
import { findDegree } from "../../utils";
import { QRCode } from "../index";
import styled from "styled-components";
import { AnimalsInformation } from "./AnimalsInformation";

export const AnimalCardSheet = ({ animal }) => {
    return (
        <Container>
            <div className="sheet">
                <div className="header">
                    <div className="header__item-left">
                        <img src={LogoArmyPeru} alt="Ejercito del perú" />
                    </div>
                    <div className="header__item-center">
                        <div>
                            <h2>{animal?.cardTitle}</h2>
                            <h3>{animal?.cardSubTitle}</h3>
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
                        <AnimalsInformation animal={animal} />
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
                                        <strong>JEFE DEL SVETRE</strong>
                                    </div>
                                    <div className="signature_img">
                                        {animal?.entityGUManage?.signaturePhoto && (
                                            <img
                                                src={animal?.entityGUManage?.signaturePhoto.url}
                                                alt="Perfil Izquierdo"
                                            />
                                        )}
                                    </div>
                                    <div className="signature_info">
                                        <p>
                                            <strong>{animal?.entityGUManage?.cip}</strong>
                                        </p>
                                        <p>
                                            <strong>{userFullName(animal?.entityGUManage)}</strong>
                                        </p>
                                        <p>
                                            <strong>
                                                {findDegree(animal?.entityGUManage?.degree)?.label}
                                            </strong>
                                        </p>
                                        <p>
                                            <strong>JEFE DEL {animal?.entityGU?.name}</strong>
                                        </p>
                                    </div>
                                </div>
                                <div className="signature_content">
                                    <div className="signature_tittle">
                                        <strong> JEFE DE UNIDAD</strong>
                                    </div>
                                    <div className="signature_img">
                                        {animal?.unitBoss?.signaturePhoto && (
                                            <img
                                                src={animal?.unitBoss?.signaturePhoto.url}
                                                alt="Perfil Izquierdo"
                                            />
                                        )}
                                    </div>
                                    <div className="signature_info">
                                        <p>
                                            <strong>{animal?.unitBoss?.cip}</strong>
                                        </p>
                                        <p>
                                            <strong>{userFullName(animal?.unitBoss)}</strong>
                                        </p>
                                        <p>
                                            <strong>
                                                {findDegree(animal?.unitBoss?.degree)?.label}
                                            </strong>
                                        </p>
                                        <p>
                                            <strong>Jefe del {animal?.unit?.name}</strong>
                                        </p>
                                    </div>
                                </div>
                                <div className="signature_content">
                                    <div className="signature_tittle">
                                        <strong>OFICIAL VETERINARIO</strong>
                                    </div>
                                    <div className="signature_img">
                                        {animal?.departmentBoss?.signaturePhoto && (
                                            <img
                                                src={animal?.departmentBoss?.signaturePhoto.url}
                                                alt="Perfil Izquierdo"
                                            />
                                        )}
                                    </div>
                                    <div className="signature_info">
                                        <p>
                                            <strong>{animal?.departmentBoss?.cip}</strong>
                                        </p>
                                        <p>
                                            <strong>{userFullName(animal?.departmentBoss)}</strong>
                                        </p>
                                        <p>
                                            <strong>
                                                {findDegree(animal?.departmentBoss?.degree)?.label}
                                            </strong>
                                        </p>
                                        <p>
                                            <strong>
                                                JEFE{" "}
                                                {`${animal?.department?.name || ""} DEL ${animal?.unit?.name || ""}`}
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
