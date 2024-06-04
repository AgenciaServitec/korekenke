import React from "react";
import Col from "antd/lib/col";
import {
    Acl,
    Button,
    modalConfirm,
    notification,
} from "../../../../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Row } from "antd";
import { useNavigate } from "react-router";
import Title from "antd/es/typography/Title";
import { LiveStockAndEquinesTable } from "./LiveStockAndEquinesTable";
import { useGlobalData } from "../../../../providers";
import { assign, isEmpty } from "lodash";
import { apiErrorNotification, getApiErrorResponse } from "../../../../api";
import {
    updateEntity,
    updateLivestockAndEquine,
} from "../../../../firebase/collections";
import { useDefaultFirestoreProps } from "../../../../hooks";

export const LiveStockAndEquinesIntegration = () => {
    const navigate = useNavigate();
    const { livestockAndEquines } = useGlobalData();
    const { assignDeleteProps } = useDefaultFirestoreProps();

    const navigateTo = (pathname = "new") =>
        navigate(
            `/entities/servicio-de-veterinaria-y-remonta-del-ejercito/livestock-and-equines/${pathname}`
        );

    const onAddEquine = () => navigateTo("new");
    const onEditEquine = (livestockAndEquine) =>
        navigateTo(livestockAndEquine.id);
    const onDeleteEquine = async (livestockAndEquine) => {
        modalConfirm({
            title: "¿Estás seguro que quieres eliminar el ganado o equino",
            onOk: async () => {
                await updateLivestockAndEquine(
                    livestockAndEquine.id,
                    assignDeleteProps({ isDeleted: true })
                );
            },
        });
    };

    return (
        <LiveStockAndEquines
            onAddEquine={onAddEquine}
            onEditEquine={onEditEquine}
            onDeleteEquine={onDeleteEquine}
            livestockAndEquines={livestockAndEquines}
        />
    );
};

const LiveStockAndEquines = ({
                                 onAddEquine,
                                 onEditEquine,
                                 onDeleteEquine,
                                 livestockAndEquines,
                             }) => {
    return (
        <Acl
            category="servicio-de-veterinaria-y-remonta-del-ejercito"
            subCategory="livestockAndEquines"
            name="/livestock-and-equines"
            redirect
        >
            <Row gutter={[0, 24]}>
                <Col span={24}>
                    <Acl
                        category="servicio-de-veterinaria-y-remonta-del-ejercito"
                        subCategory="livestockAndEquines"
                        name="/livestock-and-equines/new"
                    >
                        <Button
                            onClick={onAddEquine}
                            type="primary"
                            size="large"
                            icon={<FontAwesomeIcon icon={faPlus} />}
                        >
                            &ensp; Agregar Equino
                        </Button>
                    </Acl>
                </Col>
                <Col span={24}>
                    <Title level={3}>Equinos</Title>
                </Col>

                <Col span={24}>
                    <LiveStockAndEquinesTable
                        livestockAndEquines={livestockAndEquines}
                        onEditLiveStockAndEquine={onEditEquine}
                        onConfirmRemoveLiveStockAndEquine={onDeleteEquine}
                    />
                </Col>
            </Row>
        </Acl>
    );
};
