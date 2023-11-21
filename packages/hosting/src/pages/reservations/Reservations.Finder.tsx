import React, { memo } from "react";
import moment from "moment";
import styled from "styled-components";
import {
  DatePicker,
  DatePickerProps,
  Input,
  InputProps,
} from "../../components/ui";
import { mediaQuery } from "../../styles";

export interface ReservationsFinderProps {
  searchFields: SearchFields;
  onSearch: (searchFields: SearchFields) => void;
}

export interface SearchFields {
  createAt?: string;
  searchTerm?: string;
}

const ReservationsFinder = ({
  searchFields,
  onSearch,
}: ReservationsFinderProps): JSX.Element => {
  const onChangeTourDate: DatePickerProps["onChange"] = (value) =>
    onSearch({
      ...searchFields,
      createAt: momentToDateString(value),
    });

  const onChangeSearchTerm: InputProps["onChange"] = (event) =>
    onSearch({
      ...searchFields,
      searchTerm: event.target.value,
    });

  return (
    <Container>
      <FormContent>
        <DatePicker
          label="Fecha de reserva"
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

export default memo(ReservationsFinder);

const dateStringToMoment = (
  dateString: string | undefined
): moment.Moment | undefined =>
  moment(dateString, "YYYY-MM-DD", true).isValid()
    ? moment(dateString, "YYYY-MM-DD")
    : undefined;

const momentToDateString = (date: moment.Moment | null): string | undefined =>
  date?.format("YYYY-MM-DD") || undefined;

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
