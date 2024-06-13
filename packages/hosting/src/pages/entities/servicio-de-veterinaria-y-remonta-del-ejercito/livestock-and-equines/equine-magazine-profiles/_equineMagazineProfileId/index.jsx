import React, { useEffect, useState } from "react";
import {
  Acl,
  Button,
  Card,
  Col,
  Form,
  InputNumber,
  notification,
  Row,
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
import styled from "styled-components";
import { HerradoImg, ToilleteImg } from "../../../../../../images";
import { useParams } from "react-router";
import { EquineMagazineProfiles } from "../../../../../../data-list";
import {
  addEquineMagazineProfile,
  fetchEquineMagazineProfile,
  getClinicHistoryId,
  updateEquineMagazineProfile,
} from "../../../../../../firebase/collections";
import { useGlobalData } from "../../../../../../providers";
import { mediaQuery } from "../../../../../../styles";
import { LivestockAndEquineInformation } from "../../../../../../components/ui/entities";

export const EquineMagazineProfileIntegration = () => {
  const navigate = useNavigate();
  const { livestockAndEquines } = useGlobalData();
  const { equineMagazineProfileId, livestockAndEquineId } = useParams();
  const { assignCreateProps, assignUpdateProps } = useDefaultFirestoreProps();

  const [livestockAndEquine, setLivestockAndEquine] = useState({});
  const [equineMagazineProfile, setEquineMagazineProfile] = useState({});
  const [loading, setLoading] = useState(false);

  const onGoBack = () => navigate(-1);

  const isNew = equineMagazineProfileId === "new";

  useEffect(() => {
    const _equineMagazineProfile = isNew
      ? { id: getClinicHistoryId() }
      : (async () => {
          fetchEquineMagazineProfile(
            livestockAndEquineId,
            equineMagazineProfileId
          ).then((_response) => {
            if (!_response) return onGoBack();
            setEquineMagazineProfile(_response);
            return;
          });
        })();

    setLivestockAndEquine(
      livestockAndEquines.find(
        (_livestockAndEquine) => _livestockAndEquine.id === livestockAndEquineId
      ) || {}
    );
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
        typeMeasure: "kg",
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
            livestockAndEquineId,
            assignCreateProps(mapForm(formData))
          )
        : await updateEquineMagazineProfile(
            livestockAndEquineId,
            equineMagazineProfile.id,
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
          title={<span style={{ fontSize: "1.5em" }}>Datos del Equino</span>}
          bordered={false}
          type="inner"
        >
          <LivestockAndEquineInformation
            livestockAndEquine={livestockAndEquine}
          />
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
    <Acl
      category="servicio-de-veterinaria-y-remonta-del-ejercito"
      subCategory="equineMagazineProfiles"
      name="/livestock-and-equines/:livestockAndEquineId/equine-magazine-profiles/:equineMagazineProfileId"
      redirect
    >
      <Container>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <div className="wrapper-grid">
              <Card
                title={
                  <span style={{ fontSize: "1.5em" }}>Condición Corporal</span>
                }
                bordered={false}
                type="inner"
              >
                <div className="wrapper-condition-corporal">
                  <ul>
                    {equineMagazineProfiles.bodyCondition.map(
                      (_bodyCondition) => (
                        <li
                          key={_bodyCondition.id}
                          className={`item-condition ${
                            bodyCondition === _bodyCondition.id && "active"
                          }`}
                          onClick={() => setBodyCondition(_bodyCondition.id)}
                        >
                          <div className="item-image">
                            <img
                              src={_bodyCondition.img}
                              alt={_bodyCondition.name}
                            />
                          </div>
                          <div className="item-text">
                            <div>{_bodyCondition.id}</div>
                            <div>
                              <h5>{_bodyCondition.name}</h5>
                            </div>
                          </div>
                        </li>
                      )
                    )}
                  </ul>
                  <br />
                  <TextArea
                    label="Observaciones"
                    value={bodyConditionObservation}
                    rows={2}
                    onChange={(e) =>
                      setBodyConditionObservation(e.target.value)
                    }
                  />
                </div>
              </Card>
              <Card
                title={<span style={{ fontSize: "1.5em" }}>Toillete</span>}
                bordered={false}
                type="inner"
              >
                <div className="wrapper-toillete-and-herrado">
                  <div className="wrapper-toillete-and-herrado__image">
                    <img src={ToilleteImg} alt="toillete" />
                  </div>
                  <ul>
                    {equineMagazineProfiles.toillete.map((_toillete) => (
                      <li
                        key={_toillete.id}
                        onClick={() => setToillete(_toillete.id)}
                        className={toillete === _toillete.id && "active"}
                      >
                        <h5>{_toillete.name}</h5>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
              <Card
                title={<span style={{ fontSize: "1.5em" }}>Herrado</span>}
                bordered={false}
                type="inner"
              >
                <div className="wrapper-toillete-and-herrado">
                  <div className="wrapper-toillete-and-herrado__image">
                    <img src={HerradoImg} alt="Herrado" />
                  </div>
                  <ul>
                    {equineMagazineProfiles.horseshoe.map((_horseshoe) => (
                      <li
                        key={_horseshoe.id}
                        onClick={() => setHorseshoe(_horseshoe.id)}
                        className={horseshoe === _horseshoe.id && "active"}
                      >
                        <h5>{_horseshoe.name}</h5>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </div>
          </Col>
          <Col span={24}>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Card
                title={
                  <span style={{ fontSize: "1.5em" }}>
                    Estimación del peso corporal
                  </span>
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
    </Acl>
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
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
    gap: 2em;
    ${mediaQuery.minDesktop} {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: auto auto;
    }

    .ant-card:first-child {
      ${mediaQuery.minDesktop} {
        grid-row: span 2;
      }
    }
  }

  .active {
    background-color: rgb(135, 224, 135);
    pointer-events: none;
  }

  .wrapper-condition-corporal {
    width: 100%;
    font-size: 13px;

    ul {
      width: 100%;
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(370px, 1fr));
      gap: 0.7em;

      .item-condition {
        width: 100%;
        display: grid;
        grid-template-columns: auto 1fr;
        border-radius: 0.7em;
        overflow: hidden;
        cursor: pointer;
        box-shadow: 0 0 2px rgba(0, 0, 0, 0.4);

        .item-image {
          width: 10em;
          height: auto;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        .item-text {
          align-self: center;
          text-align: center;
          display: grid;
          grid-template-columns: auto 1fr;
          width: 100%;
          height: 100%;

          div {
            display: grid;
            place-items: center;

            h5 {
              margin: 0;
            }
          }

          div:first-child {
            font-size: 2em;
            font-weight: 700;
            padding: 0 0.5em;
            color: red;
            background: #f3f3f3;
          }
        }
      }
    }
  }

  .wrapper-toillete-and-herrado {
    display: flex;
    flex-direction: column;
    gap: 1em;

    &__image {
      width: 100%;
      height: 12em;
      img {
        width: 100%;
        height: 100%;
        object-fit: scale-down;
      }
    }

    ul {
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
        border-radius: 0.7em;
        cursor: pointer;
        box-shadow: 0 0 2px rgba(0, 0, 0, 0.4);
        text-align: center;

        h5 {
          margin: 0;
        }
      }
    }
  }
`;
