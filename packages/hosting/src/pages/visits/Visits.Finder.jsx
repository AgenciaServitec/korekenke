import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { mediaQuery } from "../../styles";
import { AutoComplete, Spin } from "../../components";
import { userFullName } from "../../utils/users/userFullName2";

export const VisitsFinder = ({
  searchFields,
  onSearch,
  users = [],
  loading = false,
  onSelectUser,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);

  useEffect(() => {
    setInputValue(searchFields.userInformation || "");
  }, [searchFields.userInformation]);

  const handleSearch = (value) => {
    onSearch({ ...searchFields, userInformation: value });
  };

  const handleSelect = (value, option) => {
    const user = users.find((u) => u.id === value);
    if (user && onSelectUser) {
      onSelectUser(user);
    }
    setInputValue(option.label);
  };

  const options = users.map((user) => {
    const searchableText = [
      user.dni,
      user.cip,
      user.email,
      user.firstName,
      user.paternalSurname,
      user.maternalSurname,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return {
      label: userFullName(user),
      value: user.id,
      searchableText,
    };
  });

  useEffect(() => {
    if (!inputValue) {
      setFilteredOptions(
        users.map((user) => ({
          label: userFullName(user),
          value: user.id,
        })),
      );
      return;
    }

    const search = inputValue.toLowerCase();

    const filtered = users
      .filter((user) => {
        const combined = [
          user.dni,
          user.cip,
          user.email,
          user.firstName,
          user.paternalSurname,
          user.maternalSurname,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return combined.includes(search);
      })
      .map((user) => ({
        label: userFullName(user),
        value: user.id,
      }));

    setFilteredOptions(filtered);
  }, [inputValue, users]);

  return (
    <Container>
      <FormContent>
        <AutoComplete
          options={filteredOptions}
          onSelect={handleSelect}
          onSearch={setInputValue}
          placeholder="Buscar por nombre, apellido, dni o cip"
          value={inputValue}
          notFoundContent={
            loading ? <Spin size="small" /> : "No se encontraron resultados"
          }
          style={{ width: "100%" }}
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
    grid-template-columns: 1fr;
  }
`;
