import React from "react";
import { DatePicker } from "../../components";
import dayjs from "dayjs";
import styled from "styled-components";
import { mediaQuery } from "../../styles";

export const VisitsFilterByDate = ({ searchFields, onSearch }) => {
  const onChangeFromDate = (value) =>
    onSearch({
      ...searchFields,
      fromDate: value ? value.format("DD-MM-YYYY HH:mm") : undefined,
    });

  const onChangeToDate = (value) =>
    onSearch({
      ...searchFields,
      toDate: value ? value.format("DD-MM-YYYY HH:mm") : undefined,
    });

  return (
    <Container>
      <FormContent>
        <DatePicker
          label="Desde"
          value={
            searchFields.fromDate
              ? dayjs(searchFields.fromDate, "DD-MM-YYYY HH:mm")
              : null
          }
          onChange={onChangeFromDate}
        />
        <DatePicker
          label="Hasta"
          value={
            searchFields.toDate
              ? dayjs(searchFields.toDate, "DD-MM-YYYY HH:mm")
              : null
          }
          onChange={onChangeToDate}
        />
      </FormContent>
    </Container>
  );
};
const Container = styled.section`
  width: 100%;
`;

const FormContent = styled.div`
  display: grid;
  align-items: center;
  grid-gap: 1rem;
  width: 100%;

  ${mediaQuery.minDesktop} {
    display: flex;
  }
`;
