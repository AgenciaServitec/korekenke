import React from "react";
import {
  AddButton,
  AlignmentWrapper,
  Col,
  modalConfirm,
  notification,
  Row,
  Spin,
} from "../../components/ui";
import CorrespondencesTable from "./Correspondences.Table";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { correspondencesRef } from "../../firebase/collections";
import { firestoreTimestamp } from "../../firebase/firestore";
import { searchify } from "../../utils";
import styled from "styled-components";
import { useNavigate } from "react-router";
import { useDebounce, useQueriesState } from "../../hooks";
import moment from "moment";

export const CorrespondencesIntegration = () => {
  const navigate = useNavigate();

  const [searchFields, setSearchFields] = useQueriesState({
    createAt: moment().format("YYYY-MM-DD"),
    searchTerm: undefined,
  });

  const debouncedSearchFields = useDebounce(searchFields, 750);

  const [correspondences = [], correspondencesLoading, correspondencesError] =
    useCollectionData(correspondencesQuery(debouncedSearchFields));

  const onDeleteCorrespondence = async (correspondenceId) => {
    console.log("delete", correspondenceId);

    notification({ type: "success" });
  };

  const onNavigateTo = (pathname) => navigate(pathname);

  return (
    <Spin size="large" spinning={correspondencesLoading}>
      <Correspondence
        onNavigateTo={onNavigateTo}
        correspondences={correspondences}
        onDeleteCorrespondence={onDeleteCorrespondence}
      />
    </Spin>
  );
};

const Correspondence = ({
  onNavigateTo,
  correspondences,
  onDeleteCorrespondence,
}) => {
  const onClickCorrespondenceAdd = () => navigateToCorrespondencePage("new");

  const onConfirmDeleteCorrespondence = (correspondenceId) =>
    modalConfirm({
      title: "¿Estás seguro de que quieres eliminar la correspondencia?",
      onOk: () => onDeleteCorrespondence(correspondenceId),
    });

  const onClickDeleteCorrespondence = (correspondenceId) =>
    onConfirmDeleteCorrespondence(correspondenceId);

  const navigateToCorrespondencePage = (correspondenceId) => {
    const url = `/correspondences/${correspondenceId}`;
    onNavigateTo(url);
  };

  const filterCorrespondencesView = correspondences.filter(
    (reception) => reception
  );

  return (
    <Container>
      <div>
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col sm={24} md={12}>
            <AlignmentWrapper align="start">
              <AddButton
                onClick={onClickCorrespondenceAdd}
                title="correspondencia"
                margin="0"
              />
            </AlignmentWrapper>
          </Col>
        </Row>
      </div>
      <div>
        <CorrespondencesTable
          correspondences={filterCorrespondencesView}
          onClickDeleteCorrespondence={onClickDeleteCorrespondence}
        />
      </div>
    </Container>
  );
};

const correspondencesQuery = ({ searchTerm, createAt }) => {
  let query = correspondencesRef
    .where("isDeleted", "==", false)
    .orderBy("createAt", "desc");

  if (searchTerm) {
    query = query.where(
      "_search",
      "array-contains-any",
      searchify(searchTerm.split(" "))
    );
  }

  if (createAt) {
    const [startDate, endDate] = dateRange(createAt);

    query = query
      .startAt(firestoreTimestamp.fromDate(endDate))
      .endAt(firestoreTimestamp.fromDate(startDate));
  }

  return query.limit(3000);
};

const dateRange = (date) => {
  const startDate = moment(date, "YYYY-MM-DD").startOf("day").toDate();
  const endDate = moment(date, "YYYY-MM-DD").endOf("day").toDate();

  return [startDate, endDate];
};

const Container = styled.div`
  display: flex;
  gap: 1rem;
  flex-direction: column;
`;
