import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getLocalStorage, setLocalStorage } from "../../../../../utils";
import { mediaQuery } from "../../../../../styles";
import { PersonalInformation } from "./components";
import { WindowScroller } from "react-virtualized";

export const Step2PersonalInformation = ({ user, onNextStep, onPrevStep }) => {
  const dasRequest = getLocalStorage("dasRequest");

  const [loadingStep2, setLoadingStep2] = useState(false);

  const onSavePersonalInformationStep2 = (formData) => {
    try {
      setLoadingStep2(true);
      setLocalStorage("dasRequest", {
        ...dasRequest,
        ...formData,
      });

      onNextStep();
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
          user={user}
          onPrevStep={onPrevStep}
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
      width: 70%;
    }
  }
`;
