import React from "react";
import { useNavigation } from "react-router";
import { useGlobalData } from "../../../providers";
import { useAcl } from "../../../hooks";

export const SectionIntegration = () => {
  const navigate = useNavigation();
  const { section } = useGlobalData();
  const { alCheck } = useAcl();

  const navigateTo = (sectionsId) => {
    const url = `/sections/${sectionsId}`;
    navigate(url);
  };

  const onAddEntity = () => navigateTo("new");

  const navigateToSection = (sectionId = undefined) => {
    const url = `/sections/${sectionId}`;
    navigate(url);
  };

  return <h1>Hola</h1>;
};
