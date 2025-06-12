import React from "react";
import styled from "styled-components";
import { Input } from "../../components";
import { mediaQuery } from "../../styles";

export const VisitsListFinder = ({ searchFields, onSearch }) => {
  const onChangeSearchBy = (event) =>
    onSearch({
      ...searchFields,
      visitInformation: event.target.value,
    });

  return (
    <Container>
      <FormContent>
        <Input
          label=""
          placeholder="Buscar por nombres, apellidos, dni y telefono"
          value={searchFields.visitInformation}
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
