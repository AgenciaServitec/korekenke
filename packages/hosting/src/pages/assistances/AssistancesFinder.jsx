import React from "react";
import styled from "styled-components";
import { DatePicker, Input } from "../../components";
import { mediaQuery } from "../../styles";
import dayjs from "dayjs";

export const AssistancesFinder = ({ searchFields, onSearch }) => {
  const onChangeFromDate = (value) =>
    onSearch({
      ...searchFields,
      fromDate: value?.format("DD-MM-YYYY") || searchFields.fromDate,
      toDate: value?.format("DD-MM-YYYY") || searchFields.fromDate,
    });

  const onChangeToDate = (value) =>
    onSearch({
      ...searchFields,
      toDate: value?.format("DD-MM-YYYY") || searchFields.toDate,
    });

  const onChangeSearchBy = (event) =>
    onSearch({
      ...searchFields,
      cip: event.target.value,
    });

  return (
    <Container>
      <FormContent>
        <Input
          label=""
          placeholder="Buscar por cip"
          value={searchFields.cip}
          onChange={onChangeSearchBy}
          allowClear
        />
        <DatePicker
          label="Desde"
          value={dayjs(searchFields.fromDate, "DD-MM-YYYY")}
          onChange={onChangeFromDate}
        />
        <DatePicker
          label="Hasta"
          value={dayjs(searchFields.toDate, "DD-MM-YYYY")}
          onChange={onChangeToDate}
        />
      </FormContent>
    </Container>
  );
};

const Container = styled.section``;

const FormContent = styled.div`
  display: grid;
  align-items: center;
  grid-gap: 1rem;
  grid-template-columns: 1fr;

  ${mediaQuery.minDesktop} {
    grid-template-columns: 1fr 1fr 1fr;
  }
`;
