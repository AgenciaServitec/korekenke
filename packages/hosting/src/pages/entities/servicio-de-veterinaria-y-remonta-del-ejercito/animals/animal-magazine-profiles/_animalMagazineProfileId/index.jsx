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
import { useParams } from "react-router";
import { AnimalMagazineProfiles } from "../../../../../../data-list";
import {
  addAnimalMagazineProfile,
  fetchAnimalMagazineProfile,
  getClinicHistoryId,
  updateAnimalMagazineProfile,
} from "../../../../../../firebase/collections";
import { useGlobalData } from "../../../../../../providers";
import { mediaQuery } from "../../../../../../styles";
import { AnimalInformation } from "../../../../../../components/ui/entities";

export const AnimalMagazineProfileIntegration = () => {
  const navigate = useNavigate();
  const { animals } = useGlobalData();
  const { animalMagazineProfileId, animalId } = useParams();
  const { assignCreateProps, assignUpdateProps } = useDefaultFirestoreProps();

  const [animal, setAnimal] = useState({});
  const [animalMagazineProfile, setAnimalMagazineProfile] = useState({});
  const [loading, setLoading] = useState(false);

  const onGoBack = () => navigate(-1);

  const isNew = animalMagazineProfileId === "new";

  const isEquine = animal?.type === "equine";
  const isCattle = animal?.type === "cattle";
  const isCanine = animal?.type === "canine";

  useEffect(() => {
    const _animalMagazineProfile = isNew
      ? { id: getClinicHistoryId() }
      : (async () => {
          fetchAnimalMagazineProfile(animalId, animalMagazineProfileId).then(
            (_response) => {
              if (!_response) return onGoBack();
              setAnimalMagazineProfile(_response);
              return;
            },
          );
        })();

    setAnimal(animals.find((_animal) => _animal.id === animalId) || {});
    setAnimalMagazineProfile(_animalMagazineProfile);
  }, []);

  const mapForm = (formData) => ({
    id: animalMagazineProfile.id,
    bodyCondition: {
      ...AnimalMagazineProfiles?.[animal.type]?.bodyCondition.find(
        (_bodyCondition) => _bodyCondition.id === formData.bodyCondition,
      ),
      observation: formData.bodyConditionObservation,
      qualification: formData.bodyCondition,
    },
    toillete: {
      ...AnimalMagazineProfiles?.[animal.type]?.toillete.items.find(
        (_toillete) => _toillete.id === formData.toillete,
      ),
    },
    ...(isEquine && {
      horseshoe: {
        ...AnimalMagazineProfiles?.[animal.type]?.horseshoe.items.find(
          (_horseshoe) => _horseshoe.id === formData.horseshoe,
        ),
      },
    }),
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
      weight: {
        typeMeasure: "kg",
        value: formData.weight,
      },
      observation: {
        value: formData.observation,
      },
    },
  });

  const onSaveAnimalMagazineProfile = async (formData) => {
    try {
      setLoading(true);

      isNew
        ? await addAnimalMagazineProfile(
            animalId,
            assignCreateProps(mapForm(formData)),
          )
        : await updateAnimalMagazineProfile(
            animalId,
            animalMagazineProfile.id,
            assignUpdateProps(mapForm(formData)),
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
          title={<span style={{ fontSize: "1.5em" }}>Datos del Animal</span>}
          bordered={false}
          type="inner"
        >
          <AnimalInformation animal={animal} />
        </Card>
      </Col>
      <Col span={24}>
        <AnimalMagazineProfile
          animal={animal}
          isEquine={isEquine}
          animalMagazineProfile={animalMagazineProfile}
          animalMagazineProfiles={AnimalMagazineProfiles}
          onSaveAnimalMagazineProfile={onSaveAnimalMagazineProfile}
          onGoBack={onGoBack}
          loading={loading}
        />
      </Col>
    </Row>
  );
};

const AnimalMagazineProfile = ({
  animal,
  isEquine,
  animalMagazineProfile,
  animalMagazineProfiles,
  onSaveAnimalMagazineProfile,
  loading,
  onGoBack,
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
    weight: yup.number().required(),
    observation: yup.string(),
  });

  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { required, error } = useFormUtils({ errors, schema });

  useEffect(() => {
    resetForm();
    setBodyCondition(animalMagazineProfile?.bodyCondition?.id || null);
    setBodyConditionObservation(
      animalMagazineProfile?.bodyCondition?.observation || null,
    );
    setToillete(animalMagazineProfile?.toillete?.id || null);
    setHorseshoe(animalMagazineProfile?.horseshoe?.id || null);
  }, [animalMagazineProfile]);

  const resetForm = () => {
    reset({
      chestCircumference:
        animalMagazineProfile?.bodyWeightEstimation?.chestCircumference
          ?.value || "",
      bodyLength:
        animalMagazineProfile?.bodyWeightEstimation?.bodyLength?.value || "",
      heightOfTheCross:
        animalMagazineProfile?.bodyWeightEstimation?.heightOfTheCross?.value ||
        "",
      weight: animalMagazineProfile?.bodyWeightEstimation?.weight?.value || "",
      observation:
        animalMagazineProfile?.bodyWeightEstimation?.observation?.value || "",
    });
  };

  const onSubmit = (formData) => {
    if (!bodyCondition)
      return notification({
        type: "warning",
        title: "La condición corporal del animal es requerido.",
      });

    if (!toillete)
      return notification({
        type: "warning",
        title: "Toillete del animal es requerido.",
      });

    if (!horseshoe && isEquine)
      return notification({
        type: "warning",
        title: "Herrado del equino es requerido.",
      });

    onSaveAnimalMagazineProfile({
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
      subCategory="animalMagazineProfiles"
      name="/animals/:animalId/animal-magazine-profiles/:animalMagazineProfileId"
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
                    {animalMagazineProfiles?.[animal.type]?.bodyCondition.map(
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
                      ),
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
                    <img
                      src={
                        animalMagazineProfiles?.[animal.type]?.toillete.image
                      }
                      alt="toillete"
                    />
                  </div>
                  <ul>
                    {animalMagazineProfiles?.[animal.type]?.toillete.items.map(
                      (_toillete) => (
                        <li
                          key={_toillete.id}
                          onClick={() => setToillete(_toillete.id)}
                          className={toillete === _toillete.id && "active"}
                        >
                          <h5>{_toillete.name}</h5>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              </Card>
              {isEquine && (
                <Card
                  title={<span style={{ fontSize: "1.5em" }}>Herrado</span>}
                  bordered={false}
                  type="inner"
                >
                  <div className="wrapper-toillete-and-herrado">
                    <div className="wrapper-toillete-and-herrado__image">
                      <img
                        src={
                          animalMagazineProfiles?.[animal.type]?.horseshoe.image
                        }
                        alt="Herrado"
                      />
                    </div>
                    <ul>
                      {animalMagazineProfiles?.[
                        animal.type
                      ]?.horseshoe.items.map((_horseshoe) => (
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
              )}
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
                      name="weight"
                      control={control}
                      defaultValue=""
                      render={({ field: { onChange, value, name } }) => (
                        <InputNumber
                          label="Peso del animal (Kg)"
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
