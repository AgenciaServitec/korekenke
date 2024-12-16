import React, { useState } from "react";
import { useParams } from "react-router";
import { Flex, Row, Col, Button, notification } from "../../components";
import {
  addAssistance,
  getAssistancesId,
} from "../../firebase/collections/assistance";
import dayjs from "dayjs";
import { userFullName } from "../../utils/users/userFullName2";
import { DATE_FORMAT_TO_FIRESTORE } from "../../firebase/firestore";

export const GetAssistance = ({ user }) => {
  const { assistanceId } = useParams();

  const [isEntry, setIsEntry] = useState(false);

  const handleMarkAssistance = async (type) => {
    const currentDate = dayjs();

    const assistanceData = {
      id: assistanceId || getAssistancesId(),
      userName: userFullName(user),
      type: type,
      date: dayjs(currentDate).format(DATE_FORMAT_TO_FIRESTORE),
    };

    try {
      await addAssistance(assistanceData);
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
        <Flex>
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
