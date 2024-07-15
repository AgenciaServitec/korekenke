import React from "react";

export const SignatureSheet = ({ signaturethumbUrl, signatureUrl, name }) => {
  return (
    <div className="signature__item">
      <div>
        <img src={signaturethumbUrl || signatureUrl} alt="signature photo" />
      </div>
      <p>{name}</p>
    </div>
  );
};
