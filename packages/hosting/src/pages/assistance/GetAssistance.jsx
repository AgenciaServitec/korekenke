import React, { useState } from "react";
import { useParams } from "react-router";
import { Flex, Row, Col, Button, notification } from "../../components";
import {
  addAssistance,
  getAssistancesId,
} from "../../firebase/collections/assistance";
import dayjs from "dayjs";
import { DATE_FORMAT_TO_FIRESTORE } from "../../firebase/firestore";
import { useDefaultFirestoreProps } from "../../hooks";

export const GetAssistance = ({ user }) => {
  const { assistanceId } = useParams();
  const { assignCreateProps } = useDefaultFirestoreProps();

  const [isEntry, setIsEntry] = useState(false);

  const handleMarkAssistance = async (type) => {
    const currentDate = dayjs();

    const assistanceData = {
      id: assistanceId || getAssistancesId(),
      type: type,
      date: dayjs(currentDate).format(DATE_FORMAT_TO_FIRESTORE),
    };

    try {
      await addAssistance(assignCreateProps(assistanceData));
      notification({ type: "success" });

      if (type === "entry") {
        setIsEntry(true);
      } else if (type === "outlet") {
        setIsEntry(false);
      }
    } catch (error) {
      notification({ type: "error" });
    }
  };

  return (
    <AssistanceButtons
      handleMarkAssistance={handleMarkAssistance}
      isEntry={isEntry}
    />
  );
};

const AssistanceButtons = ({ handleMarkAssistance, isEntry }) => {
  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Flex gap={5}>
          <Button
            onClick={() => handleMarkAssistance("entry")}
            disabled={isEntry}
          >
            Marcar Entrada
          </Button>
          <Button
            onClick={() => handleMarkAssistance("outlet")}
            disabled={!isEntry}
          >
            Marcar Salida
          </Button>
        </Flex>
      </Col>
    </Row>
  );
};
