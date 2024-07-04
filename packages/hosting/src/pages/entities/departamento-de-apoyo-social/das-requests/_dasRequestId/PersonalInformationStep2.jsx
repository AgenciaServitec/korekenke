import React, { useState } from "react";
import styled from "styled-components";
import { getLocalStorage, setLocalStorage } from "../../../../../utils";
import { mediaQuery } from "../../../../../styles";
import { PersonalInformation } from "./common/PersonalInformation";

export const PersonalInformationStep2 = ({ onSetCurrentStep }) => {
  const [loadingStep2, setLoadingStep2] = useState(false);

  const dasRequest = getLocalStorage("dasRequest");

  const onSavePersonalInformationStep2 = (formData) => {
    try {
      setLoadingStep2(true);
      setLocalStorage("dasRequest", {
        ...formData,
      });

      onSetCurrentStep();
    } catch (e) {
      console.error("onSavePersonalInformationStep2: ", e);
    } finally {
      setLoadingStep2(false);
    }
  };

  return (
    <Container>
      <div className="form-wrapper">
        <PersonalInformation
          dasRequest={dasRequest}
          loadingStep2={loadingStep2}
          onSavePersonalInformationStep2={onSavePersonalInformationStep2}
        />
      </div>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  .form-wrapper {
    width: 100%;
    margin: auto;
    ${mediaQuery.minDesktop} {
      width: 50%;
    }
  }
`;
