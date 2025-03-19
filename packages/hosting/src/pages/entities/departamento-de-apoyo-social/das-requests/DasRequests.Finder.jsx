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
          placeholder="Buscar por cip, nombres, correo y celular"
          value={searchFields.dasRequestInformation}
          onChange={onChangeSearchBy}
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
