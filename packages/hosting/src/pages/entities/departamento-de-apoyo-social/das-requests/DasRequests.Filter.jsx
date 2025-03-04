import React from "react";
import styled from "styled-components";
import { mediaQuery } from "../../../../styles";
import { Select } from "../../../../components";
import { DasRequestStatus } from "../../../../data-list";
import { concat } from "lodash";

export const DasRequestsFilter = ({ dasRequests, filterFields, onFilter }) => {
  const onChangeType = (value) =>
    onFilter({
      ...filterFields,
      status: !value ? "all" : value,
    });

  return (
    <Container>
      <FormContent>
        <Select
          label="Estado"
          value={filterFields.status}
          onChange={(value) => onChangeType(value)}
          options={concat(
            [{ label: "Todos", value: "all" }],
            Object.entries(DasRequestStatus).map(([key, values]) => ({
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
