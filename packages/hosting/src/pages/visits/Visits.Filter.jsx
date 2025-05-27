import React from "react";
import { Select } from "../../components";
import { concat } from "lodash";
import { VisitsStatus } from "../../data-list";
import styled from "styled-components";
import { mediaQuery } from "../../styles";

export const VisitsFilter = ({ visits, filterFields, onFilter }) => {
  const onChangeType = (value) => {
    onFilter({
      ...filterFields,
      status: value,
    });
  };

  return (
    <Container>
      <FormContent>
        <Select
          label="Estado"
          value={filterFields.status}
          onChange={onChangeType}
          options={concat(
            [{ label: "Todos", value: "all" }],
            Object.entries(VisitsStatus).map(([key, values]) => ({
              label: values.name,
              value: key,
            })),
          )}
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
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
`;
