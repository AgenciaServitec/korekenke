import React from "react";

export const SignatureSheet = ({ signatureUrl, name, cip, degree }) => {
  return (
    <div className="signature">
      <div className="signature__item">
        <div>
          {signatureUrl && <img src={signatureUrl} alt="signature photo" />}
        </div>
        <p>{name}</p>
      </div>
      <div className="cip">
        <p>
          CIP: <span>{cip || ""}</span>
        </p>
      </div>
      <div className="cip">
        <p>
          Grado: <span>{degree || ""}</span>
        </p>
      </div>
    </div>
  );
};
