import React, { memo } from "react";
import styled from "styled-components";
import { Select, SelectOption } from "../../components/ui";

export interface ReservationsFiltersProps {
  companies: Company[];
  districts: District[];
  filter: Filter;
  onFilter: (filter: Filter) => void;
}

export interface Filter {
  status: "all" | ReservationStatus;
  districtId: "all" | string;
  companyId: "all" | string;
}

const ReservationsFilters = ({
  companies,
  districts,
  filter,
  onFilter,
}: ReservationsFiltersProps): JSX.Element => {
  const onChangeStatus = (status: Filter["status"]) =>
    onFilter({
      ...filter,
      status: !status ? "all" : status,
    });

  const onChangeDistrict = (districtId: Filter["districtId"]) =>
    onFilter({
      ...filter,
      districtId: !districtId ? "all" : districtId,
    });

  const onChangeCompany = (companyId: Filter["companyId"]) =>
    onFilter({
      ...filter,
      companyId: !companyId ? "all" : companyId,
    });

  return (
    <Container>
      <FormContent>
        <Select
          label="Estado"
          value={filter.status}
          onChange={(value) => onChangeStatus(value as Filter["status"])}
        >
          <SelectOption value="all">Todos</SelectOption>
          <SelectOption value="accepted">Aceptado</SelectOption>
          <SelectOption value="pending">Pendiente</SelectOption>
        </Select>
        <Select
          label="Distrito"
          value={filter.districtId}
          onChange={(value) => onChangeDistrict(value as Filter["districtId"])}
        >
          <SelectOption value="all">Todos</SelectOption>
          {districts.map((district) => (
            <SelectOption key={district.id} value={district.id}>
              {district.name}
            </SelectOption>
          ))}
        </Select>
        <Select
          label="Compañia"
          value={filter.companyId}
          onChange={(value) => onChangeCompany(value as Filter["companyId"])}
        >
          <SelectOption value="all">Todos</SelectOption>
          {companies.map((company) => (
            <SelectOption key={company.id} value={company.id}>
              {company.name}
            </SelectOption>
          ))}
        </Select>
      </FormContent>
    </Container>
  );
};

export default memo(ReservationsFilters);

const Container = styled.section``;

const FormContent = styled.div`
  display: grid;
  align-items: center;
  grid-gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
`;
