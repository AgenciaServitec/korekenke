import React, { useEffect, useState } from "react";
import { Col, Row } from "antd";
import {
  Button,
  Card,
  Form,
  InputNumber,
  notification,
  TextArea,
  Title,
} from "../../../../../../components";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  useDefaultFirestoreProps,
  useFormUtils,
} from "../../../../../../hooks";
import { useNavigate } from "react-router-dom";
import { EquipeMagazineProfileInformation } from "./EquipeMagazineProfileInformation";
import styled from "styled-components";
import { HorseCondition } from "../../../../../../images";
import { useParams } from "react-router";
import { EquineMagazineProfiles } from "../../../../../../data-list";
import {
  addEquineMagazineProfile,
  fetchEquineMagazineProfile,
  getClinicHistoryId,
  updateEquineMagazineProfile,
} from "../../../../../../firebase/collections";

export const EquineMagazineProfileIntegration = () => {
  const navigate = useNavigate();
  const { equineMagazineProfileId, livestockOrEquineId } = useParams();
  const { assignCreateProps, assignUpdateProps } = useDefaultFirestoreProps();

  const [equineMagazineProfile, setEquineMagazineProfile] = useState({});
  const [loading, setLoading] = useState(false);

  const onGoBack = () => navigate(-1);

  const isNew = equineMagazineProfileId === "new";

  useEffect(() => {
    const _equineMagazineProfile = isNew
      ? { id: getClinicHistoryId() }
      : (async () => {
          fetchEquineMagazineProfile(
            livestockOrEquineId,
            equineMagazineProfileId
          ).then((_response) => {
            if (!_response) return onGoBack();
            setEquineMagazineProfile(_response);
            return;
          });
        })();
    setEquineMagazineProfile(_equineMagazineProfile);
  }, []);

  const mapForm = (formData) => ({
    id: equineMagazineProfile.id,
    bodyCondition: {
      ...EquineMagazineProfiles.bodyCondition.find(
        (_bodyCondition) => _bodyCondition.id === formData.bodyCondition
      ),
      observation: formData.bodyConditionObservation,
      qualification: formData.bodyCondition,
    },
    toillete: {
      ...EquineMagazineProfiles.toillete.find(
        (_toillete) => _toillete.id === formData.toillete
      ),
    },
    horseshoe: {
      ...EquineMagazineProfiles.horseshoe.find(
        (_horseshoe) => _horseshoe.id === formData.horseshoe
      ),
    },
    bodyWeightEstimation: {
      chestCircumference: {
        typeMeasure: "cm",
        value: formData.chestCircumference,
      },
      bodyLength: {
        typeMeasure: "cm",
        value: formData.bodyLength,
      },
      heightOfTheCross: {
        typeMeasure: "cm",
        value: formData.heightOfTheCross,
      },
      horseWeight: {
        typeMeasure: "cm",
        value: formData.horseWeight,
      },
      observation: {
        value: formData.observation,
      },
    },
  });

  const onSaveEquineMagazineProfile = async (formData) => {
    try {
      setLoading(true);

      isNew
        ? await addEquineMagazineProfile(
            livestockOrEquineId,
            assignCreateProps(mapForm(formData))
          )
        : await updateEquineMagazineProfile(
            assignUpdateProps(mapForm(formData))
          );

      notification({ type: "success" });
      onGoBack();
    } catch (e) {
      console.error(e);
      notification({ type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Card
          title={
            <Title level={4} style={{ marginBottom: 0 }}>
              Datos del Equino
            </Title>
          }
          bordered={false}
          type="inner"
        >
          <EquipeMagazineProfileInformation />
        </Card>
      </Col>
      <Col span={24}>
        <EquineMagazineProfile
          onGoBack={onGoBack}
          equineMagazineProfile={equineMagazineProfile}
          equineMagazineProfiles={EquineMagazineProfiles}
          onSaveEquineMagazineProfile={onSaveEquineMagazineProfile}
          loading={loading}
        />
      </Col>
    </Row>
  );
};

const EquineMagazineProfile = ({
  onGoBack,
  equineMagazineProfile,
  equineMagazineProfiles,
  onSaveEquineMagazineProfile,
  loading,
}) => {
  const [bodyCondition, setBodyCondition] = useState(null);
  const [bodyConditionObservation, setBodyConditionObservation] =
    useState(null);
  const [toillete, setToillete] = useState(null);
  const [horseshoe, setHorseshoe] = useState(null);

  const schema = yup.object({
    chestCircumference: yup.number().required(),
    bodyLength: yup.number().required(),
    heightOfTheCross: yup.number().required(),
    horseWeight: yup.number().required(),
    observation: yup.string(),
  });

  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { required, error } = useFormUtils({ errors, schema });

  useEffect(() => {
    resetForm();
    setBodyCondition(equineMagazineProfile?.bodyCondition?.id || null);
    setBodyConditionObservation(
      equineMagazineProfile?.bodyCondition?.observation || null
    );
    setToillete(equineMagazineProfile?.toillete?.id || null);
    setHorseshoe(equineMagazineProfile?.horseshoe?.id || null);
  }, [equineMagazineProfile]);

  const resetForm = () => {
    reset({
      chestCircumference:
        equineMagazineProfile?.bodyWeightEstimation?.chestCircumference
          ?.value || "",
      bodyLength:
        equineMagazineProfile?.bodyWeightEstimation?.bodyLength?.value || "",
      heightOfTheCross:
        equineMagazineProfile?.bodyWeightEstimation?.heightOfTheCross?.value ||
        "",
      horseWeight:
        equineMagazineProfile?.bodyWeightEstimation?.horseWeight?.value || "",
      observation:
        equineMagazineProfile?.bodyWeightEstimation?.observation?.value || "",
    });
  };

  const onSubmit = (formData) => {
    if (!bodyCondition)
      return notification({
        type: "warning",
        title: "La condición corporal del ganado o equino es requerido.",
      });

    if (!toillete)
      return notification({
        type: "warning",
        title: "Toillete del ganado o equino es requerido.",
      });

    if (!horseshoe)
      return notification({
        type: "warning",
        title: "Herrado del ganado o equino es requerido.",
      });

    onSaveEquineMagazineProfile({
      ...formData,
      bodyCondition,
      bodyConditionObservation,
      toillete,
      horseshoe,
    });
  };

  return (
    <Container>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card
            title={
              <Title level={4} style={{ marginBottom: 0 }}>
                Condición Corporal
              </Title>
            }
            bordered={false}
            type="inner"
          >
            <div className="wrapper-condition-corporal">
              <ul>
                {equineMagazineProfiles.bodyCondition.map((_bodyCondition) => (
                  <li
                    key={_bodyCondition.id}
                    className={`item-condition ${
                      bodyCondition === _bodyCondition.id && "active"
                    }`}
                    onClick={() => setBodyCondition(_bodyCondition.id)}
                  >
                    <div className="item-image">
                      <img src={_bodyCondition.img} alt={_bodyCondition.name} />
                    </div>
                    <div className="item-text">
                      <h4>{_bodyCondition.name}</h4>
                    </div>
                  </li>
                ))}
              </ul>
              <br />
              <TextArea
                label="Observaciones"
                value={bodyConditionObservation}
                rows={5}
                onChange={(e) => setBodyConditionObservation(e.target.value)}
              />
            </div>
          </Card>
        </Col>
        <Col span={24} md={12}>
          <Card
            title={
              <Title level={4} style={{ marginBottom: 0 }}>
                Toillete
              </Title>
            }
            bordered={false}
            type="inner"
          >
            <div className="wrapper-condition-toillete">
              <div className="wrapper-condition-toillete__image">
                <img src={HorseCondition} alt="" />
              </div>
              <ul>
                {equineMagazineProfiles.toillete.map((_toillete) => (
                  <li
                    key={_toillete.id}
                    onClick={() => setToillete(_toillete.id)}
                    className={toillete === _toillete.id && "active"}
                  >
                    <h4>{_toillete.name}</h4>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </Col>
        <Col span={24} md={12}>
          <Card
            title={
              <Title level={4} style={{ marginBottom: 0 }}>
                Herrado
              </Title>
            }
            bordered={false}
            type="inner"
          >
            <div className="wrapper-condition-herrado">
              <div className="wrapper-condition-herrado__image">
                <img src={HorseCondition} alt="" />
              </div>
              <ul>
                {equineMagazineProfiles.horseshoe.map((_horseshoe) => (
                  <li
                    key={_horseshoe.id}
                    onClick={() => setHorseshoe(_horseshoe.id)}
                    className={horseshoe === _horseshoe.id && "active"}
                  >
                    <h4>{_horseshoe.name}</h4>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </Col>
        <Col span={24}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Card
              title={
                <Title level={4} style={{ marginBottom: 0 }}>
                  Estimación del peso corporal
                </Title>
              }
              bordered={false}
              type="inner"
            >
              <Row gutter={[16, 16]}>
                <Col span={24} md={6}>
                  <Controller
                    name="chestCircumference"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value, name } }) => (
                      <InputNumber
                        label="PT: Perimetro toraxico (CM)"
                        name={name}
                        value={value}
                        onChange={onChange}
                        error={error(name)}
                        required={required(name)}
                      />
                    )}
                  />
                </Col>
                <Col span={24} md={6}>
                  <Controller
                    name="bodyLength"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value, name } }) => (
                      <InputNumber
                        label="LG: Longitud corporal (CM)"
                        name={name}
                        value={value}
                        onChange={onChange}
                        error={error(name)}
                        required={required(name)}
                      />
                    )}
                  />
                </Col>
                <Col span={24} md={6}>
                  <Controller
                    name="heightOfTheCross"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value, name } }) => (
                      <InputNumber
                        label="AC: Altura de la cruz (CM)"
                        name={name}
                        value={value}
                        onChange={onChange}
                        error={error(name)}
                        required={required(name)}
                      />
                    )}
                  />
                </Col>
                <Col span={24} md={6}>
                  <Controller
                    name="horseWeight"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value, name } }) => (
                      <InputNumber
                        label="Peso del caballo (Kg)"
                        name={name}
                        value={value}
                        onChange={onChange}
                        error={error(name)}
                        required={required(name)}
                      />
                    )}
                  />
                </Col>
                <Col span={24}>
                  <Controller
                    name="observation"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value, name } }) => (
                      <TextArea
                        label="Observaciones"
                        rows={5}
                        name={name}
                        value={value}
                        onChange={onChange}
                        error={error(name)}
                        required={required(name)}
                      />
                    )}
                  />
                </Col>
              </Row>
            </Card>
            <Row justify="end" gutter={[16, 16]}>
              <Col xs={24} sm={6} md={4}>
                <Button
                  type="default"
                  size="large"
                  block
                  onClick={() => onGoBack()}
                  disabled={loading}
                >
                  Cancelar
                </Button>
              </Col>
              <Col xs={24} sm={6} md={4}>
                <Button
                  type="primary"
                  size="large"
                  block
                  htmlType="submit"
                  loading={loading}
                >
                  Guardar
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

const Container = styled.div`
  .item-sheet {
    width: 100%;
    background: #f1f0f0;
    padding: 1em;
    border-radius: 1em;
  }

  .wrapper-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2em;
  }

  .active {
    background-color: rgb(135, 224, 135);
  }

  .wrapper-condition-corporal {
    width: 100%;

    ul {
      width: 100%;
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(370px, 1fr));
      gap: 0.5em;

      .item-condition {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 2fr;
        border-radius: 1em;
        overflow: hidden;
        cursor: pointer;
        box-shadow: 0 0 2px rgba(0, 0, 0, 0.4);

        .item-image {
          width: auto;
          height: auto;
          padding: 1em;

          img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
        }

        .item-text {
          align-self: center;
          text-align: center;
        }
      }
    }
  }

  .wrapper-condition-toillete {
    display: flex;
    flex-direction: column;
    gap: 1em;

    &__image {
      flex: 1 1 0;

      img {
        width: 100%;
        height: 100%;
      }
    }

    ul {
      flex: 1 1 0;
      width: 100%;
      height: 100%;
      padding: 0;
      margin: 0;
      list-style: none;
      display: flex;
      gap: 0.5em;

      li {
        display: grid;
        place-items: center;
        flex: 1 1 0;
        padding: 1em;
        border-radius: 1em;
        cursor: pointer;
        box-shadow: 0 0 2px rgba(0, 0, 0, 0.4);
      }
    }
  }

  .wrapper-condition-herrado {
    display: flex;
    flex-direction: column;
    gap: 1em;

    &__image {
      flex: 1 1 0;

      img {
        width: 100%;
        height: 100%;
      }
    }

    ul {
      flex: 1 1 0;
      width: 100%;
      height: 100%;
      padding: 0;
      margin: 0;
      list-style: none;
      display: flex;
      gap: 0.5em;

      li {
        display: grid;
        place-items: center;
        flex: 1 1 0;
        padding: 1em;
        border-radius: 1em;
        cursor: pointer;
        box-shadow: 0 0 2px rgba(0, 0, 0, 0.4);
      }
    }
  }
`;
