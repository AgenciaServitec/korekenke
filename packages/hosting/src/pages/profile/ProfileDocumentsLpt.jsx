import React from "react";
import { useNavigate } from "react-router";
import { Button } from "../../components/ui";

export const ProfileDocumentsLpt = () => {
  const navigate = useNavigate();
  return (
    <>
      <div>Acá se coloca los enlaces que nos van a dirigir a los PDFs</div>
      <Button type="link" onClick={() => navigate("/profile/documents/lpt")}>
        LPT
      </Button>
    </>
  );
};
