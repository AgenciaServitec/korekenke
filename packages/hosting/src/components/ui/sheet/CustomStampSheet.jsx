import React from "react";
import styled from "styled-components";
import { PeruShield } from "../../../images";

export const CustomStampSheet = ({
  supervisorName,
  supervisorCip,
  supervisorDegree,
  topText,
  bottomText,
}) => {
  return (
    <Container>
      <svg viewBox="60 100 280 200" width="180" height="180">
        <defs>
          <clipPath id="circleClipPath">
            <circle cx="200" cy="200" r="60" />
          </clipPath>
        </defs>

        <circle
          cx="200"
          cy="200"
          r="125"
          fill="none"
          stroke="black"
          strokeWidth="2"
        />

        <path
          id="circlePathTop"
          d="M 80 200 A 120 120 0 0 1 320 200"
          fill="none"
          stroke="black"
          strokeWidth="4"
        />
        <path
          id="textPathTop"
          d="M 85 200 A 115 115 0 0 1 315 200"
          fill="none"
        />
        <text textAnchor="middle" style={{ fontSize: "14px" }}>
          <textPath
            href="#textPathTop"
            startOffset="50%"
            dominantBaseline="hanging"
          >
            {topText}
          </textPath>
        </text>

        <path
          id="circlePathBottomTop"
          d="M 105 200 A 95 95 0 0 1 295 200"
          fill="none"
          stroke="black"
          strokeWidth="2"
        />

        <path
          id="circlePathBottom"
          d="M 80 200 A 120 120 0 0 0 320 200"
          fill="none"
          stroke="black"
          strokeWidth="4"
        />

        <path
          id="textPathBottom"
          d="M 85 200 A 115 115 0 0 0 315 200"
          fill="none"
        />
        <text textAnchor="middle" style={{ fontSize: "14px" }}>
          <textPath href="#textPathBottom" startOffset="50%">
            {bottomText}
          </textPath>
        </text>
        <path
          id="circlePathBottomBottom"
          d="M 105 200 A 95 95 0 0 0 295 200"
          fill="none"
          stroke="black"
          strokeWidth="2"
        />
        <image
          href={PeruShield}
          x="140"
          y="140"
          width="120"
          height="120"
          clipPath="url(#circleClipPath)"
        />
      </svg>
      <div className="signature">
        <p>{supervisorName || "-"}</p>
        <p>CIP: {supervisorCip || "-"}</p>
        <p>{supervisorDegree || "-"}</p>
      </div>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  justify-content: center;
  text-transform: uppercase;
  font-weight: bold;
  gap: 4em;

  .signature {
    text-transform: capitalize;
    text-align: center;
    padding: 0.5em 1.5em;
    border-top: 3px dotted black;
    line-height: 1.3em;

    * {
      margin: 0;
    }
  }
`;
