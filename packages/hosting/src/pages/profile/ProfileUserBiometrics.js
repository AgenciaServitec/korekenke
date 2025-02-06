import React from "react";
import { FacialBiometrics } from "./BiometricDataComponents/FacialBiometrics";
import { FingerPrintIntegration } from "./BiometricDataComponents/FingerPrintIntegration";
import { Tabs } from "../../components";

export const ProfileUserBiometrics = () => {
  const items = [
    {
      key: "1",
      label: "Biometricos Faciales",
      children: <FacialBiometrics />,
    },
    {
      key: "2",
      label: "Huella Digital",
      children: <FingerPrintIntegration />,
    },
  ];

  return (
    <div>
      <Tabs items={items} defaultActiveKey="1" />
    </div>
  );
};
