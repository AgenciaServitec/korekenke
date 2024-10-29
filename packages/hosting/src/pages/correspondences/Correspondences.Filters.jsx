import React, { memo } from "react";
import styled from "styled-components";
import { Select, SelectOption } from "../../components";

const CorrespondencesFilters = ({
  companies = [],
  districts = [],
  filter,
  onFilter,
}) => {
  const onChangeStatus = (status) =>
    onFilter({
      ...filter,
      status: !status ? "all" : status,
    });

  const onChangeDistrict = (districtId) =>
    onFilter({
      ...filter,
      districtId: !districtId ? "all" : districtId,
    });

  const onChangeCompany = (companyId) =>
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
          onChange={(value) => onChangeStatus(value)}
        >
          <SelectOption value="all">Todos</SelectOption>
          <SelectOption value="accepted">Aceptado</SelectOption>
          <SelectOption value="pending">Pendiente</SelectOption>
        </Select>
        <Select
          label="Distrito"
          value={filter.districtId}
          onChange={(value) => onChangeDistrict(value)}
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
          onChange={(value) => onChangeCompany(value)}
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

export default memo(CorrespondencesFilters);

const Container = styled.section``;

const FormContent = styled.div`
  display: grid;
  align-items: center;
  grid-gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
`;
