import React, { useState } from "react";
import styled from "styled-components";
import { getLocalStorage, setLocalStorage } from "../../../../../../utils";
import { mediaQuery } from "../../../../../../styles";
import { InstitutionInformationForm } from "./components";

export const Step3InstitutionInformation = ({ onNextStep, onPrevStep }) => {
  const dasRequest = getLocalStorage("dasRequest");

  const [loadingStep3, setLoadingStep3] = useState(false);

  const onSaveInstitutionInformationStep3 = (formData) => {
    try {
      setLoadingStep3(true);
      setLocalStorage("dasRequest", {
        ...dasRequest,
        ...formData,
      });

      onNextStep();
    } catch (e) {
      console.error("onSaveInstitutionInformationStep3: ", e);
    } finally {
      setLoadingStep3(false);
    }
  };

  return (
    <Container>
      <div className="form-wrapper">
        <InstitutionInformationForm
          onPrevStep={onPrevStep}
          dasRequest={dasRequest}
          loadingStep3={loadingStep3}
          onSaveInstitutionInformationStep3={onSaveInstitutionInformationStep3}
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
