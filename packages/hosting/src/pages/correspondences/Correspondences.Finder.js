import React, { memo } from "react";
import moment from "moment";
import styled from "styled-components";
import { DatePicker, Input } from "../../components";
import { mediaQuery } from "../../styles";

const CorrespondencesFinder = ({ searchFields, onSearch }) => {
  const onChangeTourDate = (value) =>
    onSearch({
      ...searchFields,
      createAt: momentToDateString(value),
    });

  const onChangeSearchTerm = (event) =>
    onSearch({
      ...searchFields,
      searchTerm: event.target.value,
    });

  return (
    <Container>
      <FormContent>
        <DatePicker
          label="Fecha de correspondencia"
          value={dateStringToMoment(searchFields.createAt)}
          onChange={onChangeTourDate}
          allowClear
        />
        <Input
          label=""
          placeholder="Buscar por"
          value={searchFields.searchTerm}
          onChange={onChangeSearchTerm}
        />
      </FormContent>
    </Container>
  );
};

export default memo(CorrespondencesFinder);

const dateStringToMoment = (dateString) =>
  moment(dateString, "YYYY-MM-DD", true).isValid()
    ? moment(dateString, "YYYY-MM-DD")
    : undefined;

const momentToDateString = (date) => date?.format("YYYY-MM-DD") || undefined;

const Container = styled.section``;

const FormContent = styled.div`
  display: grid;
  align-items: center;
  grid-gap: 1rem;
  grid-template-columns: 1fr;

  ${mediaQuery.minDesktop} {
    grid-template-columns: 160px 1fr;
  }
`;
