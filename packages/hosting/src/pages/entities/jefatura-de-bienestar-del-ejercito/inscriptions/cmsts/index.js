import React, { useEffect, useState } from "react";
import { CmstsFamilyForm } from "./CmstsFamilyForm";
import { CmstsForm } from "./CmstsForm";
import {
  Acl,
  Button,
  Card,
  Col,
  modalConfirm,
  notification,
  Row,
  Space,
} from "../../../../../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressBook } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import { useAuthentication } from "../../../../../providers";
import {
  addCmstsEnrollment,
  cmstsEnrollmentsRef,
  getCmstsEnrollmentId,
  updateCmstsEnrollment,
} from "../../../../../firebase/collections";
import { fetchCollectionOnce } from "../../../../../firebase/firestore";
import { useDefaultFirestoreProps } from "../../../../../hooks";
import { isEmpty } from "lodash";

export const CmstsIntegration = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthentication();
  const { assignCreateProps } = useDefaultFirestoreProps();

  const [showSignUpCmsts, setShowSignUpCmsts] = useState(false);
  const [savingFamilyMembers, setSavingFamilyMembers] = useState(false);
  const [savingCmstsEnrollment, setSavingCmstsEnrollment] = useState(false);
  const [cmstsEnrollment, setCmstsEnrollment] = useState(null);
  const [familyMembers, setFamilyMembers] = useState(
    cmstsEnrollment?.familyMembers || [],
  );

  useEffect(() => {
    (async () => {
      const _cmstsEnrollments = await fetchCollectionOnce(
        cmstsEnrollmentsRef.where("userId", "==", authUser?.id),
      );

      setCmstsEnrollment(_cmstsEnrollments[0]);
    })();
  }, []);

  useEffect(() => {
    setFamilyMembers(cmstsEnrollment?.familyMembers || []);
  }, [cmstsEnrollment]);

  const signUpInCmsts = () =>
    modalConfirm({
      title: "¿Estás seguro de que quieres Inscribirte a Circulo militar?",
      onOk: async () => {
        try {
          setSavingCmstsEnrollment(true);
          await addCmstsEnrollment(
            assignCreateProps({
              id: getCmstsEnrollmentId(),
              userId: authUser.id,
              familyMembers,
              status: "pending",
            }),
          );

          notification({
            type: "success",
            title:
              "Felicidades te inscribiste de manera exitosa a Circulo militar",
          });
        } catch (e) {
          console.error(e);
          notification({ type: "error" });
        } finally {
          setSavingCmstsEnrollment(false);
        }
      },
    });

  const onUpdateCmstsEnrollment = async () => {
    try {
      setSavingFamilyMembers(true);
      await updateCmstsEnrollment(cmstsEnrollment.id, {
        familyMembers,
      });

      notification({ type: "success" });
    } catch (e) {
      console.error(e);
      notification({ type: "error" });
    } finally {
      setSavingFamilyMembers(false);
    }
  };

  return (
    <Acl
      category="jefatura-de-bienestar-del-ejercito"
      subCategory="inscriptions"
      name="/inscriptions/cmsts"
      redirect
    >
      <div>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <h2>Circulo Militar de Superiores tecnicos y sub oficiales</h2>
          </Col>
          <Col span={24}>
            <Space
              style={{
                display: "flex",
                justifyContent: "start",
                alignItems: "center",
              }}
            >
              <Acl
                category="jefatura-de-bienestar-del-ejercito"
                subCategory="inscriptions"
                name="/inscriptions/cmsts/all"
              >
                <Button type="link" onClick={() => navigate("all")}>
                  <FontAwesomeIcon icon={faAddressBook} size="lg" /> &nbsp; Ver
                  todos los inscritos
                </Button>
              </Acl>
            </Space>
          </Col>

          <>
            {!showSignUpCmsts && !cmstsEnrollment ? (
              <Acl
                category="jefatura-de-bienestar-del-ejercito"
                subCategory="inscriptions"
                name="/inscriptions/cmsts#btn-cmsts-enrollment"
              >
                <Col
                  span={24}
                  style={{ display: "grid", placeItems: "center" }}
                >
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => setShowSignUpCmsts(true)}
                  >
                    Inscribirme en circulo militar
                  </Button>
                </Col>
              </Acl>
            ) : (
              <>
                <Col span={24}>
                  <Card
                    title={
                      <span style={{ fontSize: "1.5em" }}>
                        Información personal
                      </span>
                    }
                    bordered={false}
                    type="inner"
                  >
                    <CmstsForm cmstsEnrollment={cmstsEnrollment} />
                  </Card>
                </Col>
                <Col span={24}>
                  <Card
                    title={
                      <span style={{ fontSize: "1.5em" }}>
                        Composición Familiar
                      </span>
                    }
                    bordered={false}
                    type="inner"
                  >
                    <CmstsFamilyForm
                      familyMembers={familyMembers}
                      onSetFamilyMembers={setFamilyMembers}
                    />
                  </Card>
                </Col>
                {!cmstsEnrollment && (
                  <Col span={24}>
                    <Button
                      danger
                      type="primary"
                      size="large"
                      block
                      loading={savingCmstsEnrollment}
                      onClick={() => {
                        if (isEmpty(authUser?.emergencyCellPhone))
                          return notification({
                            type: "warning",
                            title:
                              "Por favor, complete toda su información personal y composición familiar para inscribirse en círculo militar",
                          });

                        return signUpInCmsts();
                      }}
                    >
                      Enviar inscripción a Circulo militar
                    </Button>
                  </Col>
                )}
              </>
            )}
          </>
        </Row>
        <br />
        {cmstsEnrollment && (
          <Row justify="end" gutter={[16, 16]}>
            <Col xs={24} sm={24} md={10} lg={6}>
              <Button
                type="primary"
                size="large"
                block
                onClick={() => onUpdateCmstsEnrollment()}
                loading={savingFamilyMembers}
              >
                Guardar mi composición Familiar
              </Button>
            </Col>
          </Row>
        )}
      </div>
    </Acl>
  );
};
