import React from "react";

export const SignatureSheet2 = ({
  signaturethumbUrl,
  signatureUrl,
  name,
  cip,
  degree,
  position,
}) => {
  return (
    <div className="signature">
      <div className="signature__item">
        <div className="img">
          {signaturethumbUrl && (
            <img
              src={signaturethumbUrl || signatureUrl}
              alt="signature photo"
            />
          )}
        </div>
        <p>{name}</p>
      </div>
      <div className="cip">
        <p>
          CIP: <span>{cip || ""}</span>
        </p>
      </div>

      {position ? (
        <div className="cip">
          <p>{position}</p>
        </div>
      ) : (
        <div className="cip">
          <p>
            Grado: <span>{degree || ""}</span>
          </p>
        </div>
      )}
    </div>
  );
};
