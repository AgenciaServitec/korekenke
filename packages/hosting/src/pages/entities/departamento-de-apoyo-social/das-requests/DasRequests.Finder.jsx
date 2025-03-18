import React from "react";
import styled from "styled-components";
import { Input } from "../../../../components";
import { mediaQuery } from "../../../../styles";

export const DasRequestsFinder = ({ searchFields, onSearch }) => {
  const onChangeSearchBy = (event) =>
    onSearch({
      ...searchFields,
      cip: event.target.value,
    });

  const onChangeSearchName = (event) =>
    onSearch({
      ...searchFields,
      firstName: event.target.value,
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
        <Input
          label=""
          placeholder="Buscar por nombre"
          value={searchFields.firstName}
          onChange={onChangeSearchName}
          allowClear
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
