import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useAuthentication } from "../../../providers";
import { useDefaultFirestoreProps, useFormUtils } from "../../../hooks";
import {
  Acl,
  Button,
  Col,
  Form,
  Input,
  notification,
  Row,
  Title,
} from "../../../components";
import * as yup from "yup";

import {
  addTutorial,
  fetchTutorial,
  getTutorialsId,
  updateTutorial,
} from "../../../firebase/collections";
import { assign } from "lodash";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

export const TutorialIntegration = () => {
  const navigate = useNavigate();

  const { authUser } = useAuthentication();

  const { tutorialId } = useParams();

  const { assignCreateProps, assignUpdateProps } = useDefaultFirestoreProps();

  const [tutorial, setTutorial] = useState({});
  const [savingTutorial, setSavingTutorial] = useState(false);

  const isNew = tutorialId === "new";

  const onGoBack = () => navigate(-1);
  // const onGoToTutorials = () => navigate("/tutorials");

  useEffect(() => {
    (async () => {
      const tutorial_ = isNew
        ? { id: getTutorialsId() }
        : await fetchTutorial(tutorialId);

      if (!tutorial_) return onGoBack();

      setTutorial(tutorial_);
    })();
  }, []);

  const onSaveTutorial = async (formData) => {
    try {
      setSavingTutorial(true);
      isNew
        ? await addTutorial(assignCreateProps(mapTutorial(tutorial, formData)))
        : await updateTutorial(
            tutorial.id,
            assignUpdateProps(mapTutorial(tutorial, formData)),
          );
      notification({ type: "success" });
      onGoBack();
    } catch (error) {
      console.error(error);
      notification({ type: "error" });
    }
  };

  const mapTutorial = (tutorial, formData) =>
    assign(
      {},
      {
        id: tutorial.id,
        title: formData.title,
        description: formData.description,
        videoUrl: formData.videoUrl,
      },
    );

  return (
    <TutorialForm
      isNew={isNew}
      tutorial={tutorial}
      onGoBack={onGoBack}
      savingTutorial={savingTutorial}
      onSaveTutorial={onSaveTutorial}
    />
  );
};

const TutorialForm = ({
  tutorial,
  onSaveTutorial,
  savingTutorial,
  isNew,
  onGoBack,
}) => {
  const schema = yup.object({
    title: yup.string().required(),
    description: yup.string().required(),
    videoUrl: yup.string().required(),
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
  }, [tutorial]);

  const resetForm = () => {
    reset({
      title: tutorial?.title || "",
      description: tutorial?.description || "",
      videoUrl: tutorial?.videoUrl || "",
    });
  };

  return (
    <Acl
      category="public"
      subCategory="tutorials"
      name={isNew ? "/tutorials/new" : "tutorials/:tutorialId"}
      redirect
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Title level={2}>
            {isNew ? "Nuevo Tutorial" : "Editar Tutorial"}
          </Title>
        </Col>
        <Col span={24}>
          <Form onSubmit={handleSubmit(onSaveTutorial)}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Controller
                  name="title"
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <Input
                      label="Titulo del Tutorial"
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
                  name="description"
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <Input
                      label="Descripcion del Tutorial"
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
                  name="videoUrl"
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <Input
                      label="Aqui la URL del video"
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
                <Row
                  justify="end"
                  gutter={[16, 16]}
                  style={{
                    marginTop: 24,
                    borderTop: "1px solid #f0f0f0",
                    paddingTop: 24,
                  }}
                >
                  <Col xs={24} sm={6} md={4}>
                    <Button
                      type="default"
                      size="large"
                      block
                      onClick={onGoBack}
                      disabled={savingTutorial}
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
                      loading={savingTutorial}
                    >
                      {isNew ? "Crear Tutorial" : "Guardar Cambios"}
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Acl>
  );
};
