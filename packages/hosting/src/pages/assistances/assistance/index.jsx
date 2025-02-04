import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  Col,
  Flex,
  Form,
  InputNumber,
  notification,
  Row,
} from "../../../components";
import { ModalProvider, useModal } from "../../../providers";
import {
  useDefaultFirestoreProps,
  useDevice,
  useUserLocation,
} from "../../../hooks";
import { GetAssistance } from "./GetAssistance";
import { Link } from "react-router-dom";
import styled from "styled-components";
import {
  addAssistance,
  fetchTodayAssistancesByUserId,
  getAssistancesId,
  updateAssistance,
} from "../../../firebase/collections/assistance";
import { GetFaceBiometrics } from "./GetFaceBiometrics";
import { ClockRealTime } from "../../../components/ui/ClockRealTime";
import dayjs from "dayjs";
import { isEmpty, omit } from "lodash";
import { fetchUsersByDni } from "../../../firebase/collections";
import { userFullName } from "../../../utils/users/userFullName2";
import { CardMessage } from "./CardMessage";
import { WorkPlaces } from "../../../data-list";
import { useForm } from "react-hook-form";

export const AssistanceIntegration = () => {
  const { assignCreateProps } = useDefaultFirestoreProps();

  const [entryButtonActive, setEntryButtonActive] = useState(false);
  const [outletButtonActive, setOutletButtonActive] = useState(false);
  const [isGeofenceValidate, setIsGeofenceValidate] = useState(false);
  const [assistanceSaved, setAssistanceSaved] = useState(false);
  const [dni, setDni] = useState(null);
  const [user, setUser] = useState(null);
  const [showCardMessage, setShowCardMessage] = useState(false);
  const [messageType, setMessageType] = useState("");

  const getAssistanceRef = useRef(null);

  const searchUserByDni = async () => {
    if (!dni) {
      notification({ type: "warning", description: "Digite su DNI" });
      return;
    }

    try {
      const detectedUserByDni = await fetchUsersByDni(dni.toString());
      if (detectedUserByDni.length > 0) return setUser(detectedUserByDni[0]);

      setUser(null);

      notification({ type: "warning", description: "usuario no encontrado" });
    } catch (error) {
      console.error("ErrorSearchUserByDni:", error);
      notification({
        type: "error",
      });
    }
  };

  useEffect(() => {
    setTimeout(() => {
      if (getAssistanceRef?.current) {
        getAssistanceRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 700);
  }, [user]);

  const onResetUserData = () => {
    setDni("");
    setUser(null);
  };

  const limitMarkedAssistance = async (type) => {
    const todayAssistancesUser =
      !isEmpty(user) && (await fetchTodayAssistancesByUserId(user?.id));

    return (todayAssistancesUser || []).some(
      (assistance) =>
        assistance?.[type] &&
        dayjs(
          dayjs(assistance?.[type]?.date, "DD-MM-YYYY HH:mm").toDate(),
        ).isToday(),
    );
  };

  const fetchTodayAssistance = async () => {
    const [isMarkedEntry, isMarkedOutlet] = await Promise.all([
      limitMarkedAssistance("entry"),
      limitMarkedAssistance("outlet"),
    ]);

    setEntryButtonActive(!isMarkedEntry && isGeofenceValidate && user);
    setOutletButtonActive(
      !isMarkedOutlet && isMarkedEntry && isGeofenceValidate && user,
    );
  };

  useEffect(() => {
    if (assistanceSaved || isGeofenceValidate) {
      (async () => {
        await fetchTodayAssistance();
      })();
    }
  }, [assistanceSaved, isGeofenceValidate, user]);

  const assistanceMap = (assistance = null, type, assistanceDate, user) => ({
    ...assistance,
    userId: user?.id,
    id: assistance?.id ? assistance?.id : getAssistancesId(),
    createAtString: assistance?.createAtString || assistanceDate,
    entry: assistance?.entry
      ? assistance?.entry
      : {
          date: assistanceDate,
        },
    outlet:
      type === "outlet" && assistance?.entry
        ? {
            date: assistanceDate,
          }
        : null,
    user: omit(user, "acls"),
    workPlace: user?.workPlace || null,
  });

  const onSaveAssistance = async (type) => {
    try {
      const assistanceDate = dayjs().format("DD-MM-YYYY HH:mm");

      const [isMarkedAssistant, assistances = []] = await Promise.all([
        limitMarkedAssistance(type),
        fetchTodayAssistancesByUserId(user.id),
      ]);

      const assistance = assistances.find((assistance) =>
        dayjs(
          dayjs(assistance?.createAtString, "DD-MM-YYYY HH:mm").toDate(),
        ).isToday(),
      );

      if (isMarkedAssistant) {
        notification({
          type: "warning",
          message: `Ya ha marcado su ${type === "entry" ? "ingreso" : "salida"} hoy`,
        });
        return;
      }

      if (!isGeofenceValidate) {
        notification({
          type: "warning",
          message: "No estás dentro de tu lugar de trabajo",
        });
        return;
      }

      type === "entry"
        ? await addAssistance(
            assignCreateProps(assistanceMap(null, type, assistanceDate, user)),
          )
        : await updateAssistance(
            assistance.id,
            assignCreateProps(
              assistanceMap(assistance, type, assistanceDate, user),
            ),
          );

      notification({
        type: "success",
        title: `Ha marcado su ${type === "entry" ? "entrada" : "salida"} correctamente`,
      });
      setMessageType(type === "entry" ? "entry" : "outlet");
      setShowCardMessage(true);
      setTimeout(() => setShowCardMessage(false), 4000);

      await fetchTodayAssistance();
    } catch (error) {
      console.error("AddAssistanceError:", error);
      notification({
        type: "error",
      });
    } finally {
      onResetUserData();
      setAssistanceSaved(true);
    }
  };

  return (
    <ModalProvider>
      <Assistance
        onSaveAssistance={onSaveAssistance}
        entryButtonActive={entryButtonActive}
        outletButtonActive={outletButtonActive}
        onSetIsGeofenceValidate={setIsGeofenceValidate}
        searchUserByDni={searchUserByDni}
        onResetUserData={onResetUserData}
        showCardMessage={showCardMessage}
        messageType={messageType}
        user={user}
        setDni={setDni}
        dni={dni}
        getAssistanceRef={getAssistanceRef}
      />
    </ModalProvider>
  );
};

const Assistance = ({
  user,
  onSaveAssistance,
  outletButtonActive,
  entryButtonActive,
  onSetIsGeofenceValidate,
  showCardMessage,
  messageType,
  searchUserByDni,
  onResetUserData,
  setDni,
  dni,
  getAssistanceRef,
}) => {
  const { userLocation } = useUserLocation({ user });
  const { isTablet } = useDevice();
  const { onShowModal, onCloseModal } = useModal();

  const showAlert = user && !user?.workPlace;
  const showAlert2 = user && !user?.biometricVectors;
  const existsUser = !!user;

  const onShowWebcam = (type) => {
    onShowModal({
      title: "Reconocimiento Facial",
      width: `${isTablet ? "100%" : "50%"}`,
      centered: false,
      top: 0,
      padding: 0,
      onRenderBody: () => (
        <GetFaceBiometrics
          type={type}
          onCloseModal={onCloseModal}
          userBiometrics={user?.biometricVectors?.[0]}
          onSaveAssistance={onSaveAssistance}
        />
      ),
    });
  };

  const {
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <Container>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <h1 className="title">Registro de asistencias</h1>
        </Col>
        <Col span={24}>
          <Flex justify="center">
            <ClockRealTime />
          </Flex>
        </Col>
        {!existsUser && (
          <div className="form-wrapper">
            <Form
              onSubmit={handleSubmit(searchUserByDni)}
              style={{ width: "100%" }}
            >
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <h3>Número DNI</h3>
                  <InputNumber
                    placeholder="Ingrese número de DNI"
                    value={dni}
                    onChange={(value) => setDni(value)}
                    style={{ width: "100%" }}
                  />
                </Col>
                <Col span={24}>
                  <Button
                    type="primary"
                    onClick={searchUserByDni}
                    size="large"
                    style={{ width: "100%" }}
                  >
                    Buscar
                  </Button>
                </Col>
                <Col span={24}>
                  <Button
                    type="default"
                    onClick={onResetUserData}
                    size="large"
                    style={{ width: "100%" }}
                  >
                    Limpiar
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>
        )}

        {existsUser && (
          <>
            <Col span={24}>
              <div
                className="user-name"
                ref={getAssistanceRef}
                style={{ padding: "1em 0" }}
              >
                <h2>
                  👋 Bienvenido/a, <span>{userFullName(user)}!</span>
                </h2>
                <p>¡Esperamos que tengas un buen día! 😊</p>
              </div>
            </Col>
            <Col span={24}>
              <div className="btn-cancel">
                <Button
                  type="primary"
                  danger
                  onClick={onResetUserData}
                  size="large"
                  block
                >
                  Cancelar
                </Button>
              </div>
            </Col>
            <Col span={24}>
              <div className="superior-section">
                <Flex
                  wrap
                  gap={6}
                  justify="space-between"
                  style={{ width: "100%" }}
                >
                  {user?.workPlace && (
                    <div className="workPlace">
                      <strong>
                        Lugar de trabajo:{" "}
                        {
                          WorkPlaces.find(
                            (workPlace) => workPlace.value === user.workPlace,
                          )?.label
                        }
                      </strong>
                    </div>
                  )}
                </Flex>
              </div>
            </Col>
            <Col span={24}>
              <Flex gap={5} vertical wrap>
                {showAlert && (
                  <Alert
                    showIcon
                    type="warning"
                    className="alert-component"
                    message={
                      <div className="alert-items">
                        <p>
                          <strong>Atención:</strong> No tienes un lugar de
                          trabajo configurado. Por favor, dirígete a tu perfil
                          para agregarlo. &nbsp;
                          <Link to="/profile" className="alert-link">
                            Click aqui!
                          </Link>
                        </p>
                      </div>
                    }
                  />
                )}
                {showAlert2 && (
                  <Alert
                    showIcon
                    type="warning"
                    className="alert-component"
                    message={
                      <div className="alert-items">
                        <p>
                          <strong>Atención:</strong> No tiene su rostro
                          registrado para el reconocimiento facial. Por favor,
                          dirígete a tu perfil para agregarlo. &nbsp;
                          <Link to="/profile?dataEdit=3" className="alert-link">
                            Click aqui!
                          </Link>
                        </p>
                      </div>
                    }
                  />
                )}
              </Flex>
            </Col>
            {!isEmpty(user?.biometricVectors) && (
              <Col span={24}>
                <GetAssistance
                  user={user}
                  userLocation={userLocation}
                  onShowWebcam={onShowWebcam}
                  entryButtonActive={entryButtonActive}
                  outletButtonActive={outletButtonActive}
                  onSetIsGeofenceValidate={onSetIsGeofenceValidate}
                />
              </Col>
            )}
          </>
        )}
      </Row>
      {showCardMessage && <CardMessage messageType={messageType} />}
    </Container>
  );
};

const Container = styled.div`
  .title {
    line-height: 1em;
    text-align: center;
  }
  .form-wrapper {
    max-width: 30em;
    margin: 2em auto auto auto;
  }
  .user-name {
    margin-top: 1.5em;
    text-align: center;
    color: #333;
    animation: fadeIn 0.8s ease-in-out;

    h2 {
      font-size: 1.8em;
      font-weight: bold;
      color: #4caf50;
      margin: 0;

      span {
        color: #2196f3;
        font-style: italic;
      }
    }

    p {
      font-size: 1.2em;
      color: #757575;
      margin-top: 0.5em;
    }
  }

  .btn-cancel {
    max-width: 30em;
    margin: auto;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .superior-section {
    justify-content: space-between;
    display: flex;
  }

  .alert-component {
    .anticon {
      font-size: 2em;
    }
  }

  .workPlace {
    font-size: 1.4em;
  }
`;
