import React from "react";
import styled from "styled-components";
import { Input } from "../../../../components";
import { mediaQuery } from "../../../../styles";

export const DasRequestsFinder = ({ searchFields, onSearch }) => {
  const onChangeSearchBy = (event) =>
    onSearch({
      ...searchFields,
      dasRequestInformation: event.target.value,
    });

  return (
    <Container>
      <FormContent>
        <Input
          label=""
          placeholder="Buscar por cip, nombres, apellidos, email y celular"
          value={searchFields.dasRequestInformation}
          onChange={onChangeSearchBy}
          allowClear
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
    grid-template-columns: 1fr;
  }
`;
