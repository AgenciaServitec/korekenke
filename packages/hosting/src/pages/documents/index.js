import React from "react";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import List from "antd/lib/list";
import Image from "antd/lib/image";
import Divider from "antd/lib/divider";
import Typography from "antd/lib/typography";
import {faEdit, faTrash} from "@fortawesome/free-solid-svg-icons";
import {Button, IconAction, modalConfirm} from "../../components";
import {useDefaultFirestoreProps, useDevice} from "../../hooks";
import {useGlobalData} from "../../providers";
import {useNavigate} from "react-router";
import {capitalize} from "lodash";
import {Link} from "react-router-dom";
import {firestore} from "../../firebase";
import {AvatarNoFound} from "../../images";
import Tag from "antd/lib/tag";

const {Title} = Typography;

export const DocumentsIntegration = () => {
    const {isMobile} = useDevice();
    const navigate = useNavigate();
    const {assignDeleteProps} = useDefaultFirestoreProps();

    const {documents} = useGlobalData();

    const navigateTo = (documentId) => {
        const url = `/documents/${documentId}`;

        navigate(url);
    };

    const onAddDocument = () => navigateTo("new");

    const onEditDocument = (document) => navigateTo(document.id);

    const onRemoveDocument = async (document) => {
        await firestore
            .collection("documents")
            .doc(document.id)
            .update(assignDeleteProps(document));
    };

    const onConfirmRemoveDocument = (document) =>
        modalConfirm({
            content: "El documento se eliminara",
            onOk: () => onRemoveDocument(document),
        });

    return (
        <Documents
            isMobile={isMobile}
            documents={documents}
            onAddDocument={onAddDocument}
            onEditDocument={onEditDocument}
            onConfirmRemoveDocument={onConfirmRemoveDocument}
        />
    );
};

const Documents = ({
                       isMobile,
                       documents,
                       onAddDocument,
                       onEditDocument,
                       onConfirmRemoveDocument,
                   }) => {
    return (
        <Row gutter={[16, 16]}>
            <Col span={24}>
                <Button type="primary" onClick={() => onAddDocument()}>
                    Agregar documento
                </Button>
            </Col>
            <Divider/>
            <Col span={24}>
                <Title level={3}>Documentos</Title>
            </Col>
            <Col span={24}>
                <List
                    className="demo-loadmore-list"
                    itemLayout={isMobile ? "vertical" : "horizontal"}
                    dataSource={documents}
                    renderItem={(document) => (
                        <List.Item
                            actions={[
                                <IconAction
                                    key={document.id}
                                    tooltipTitle="Editar"
                                    icon={faEdit}
                                    onClick={() => onEditDocument(document)}
                                />,
                                <IconAction
                                    key={document.id}
                                    tooltipTitle="Eliminar"
                                    styled={{color: (theme) => theme.colors.error}}
                                    icon={faTrash}
                                    onClick={() => onConfirmRemoveDocument(document)}
                                />,
                            ]}
                        >
                            <List.Item.Meta
                                avatar={
                                    <Image
                                        src={
                                            document?.documento1Photo?.url ||
                                            document?.documento1Photo?.thumbUrl ||
                                            AvatarNoFound
                                        }
                                        width={90}
                                        height={60}
                                        style={{objectFit: "contain"}}
                                        alt="icon category"
                                    />
                                }
                                title={
                                    <div>

                                        <Link to={`/documents/${document.id}`}>
                                            <h4 className="link-color">{capitalize(document.name)}</h4>
                                        </Link>
                                        <Tag
                                            color={document.active ? "green" : "red"}>{capitalize(document.active ? "Procesado" : "En espera")}</Tag>
                                    </div>
                                }
                            />
                        </List.Item>
                    )}
                />
            </Col>
        </Row>
    );
};
