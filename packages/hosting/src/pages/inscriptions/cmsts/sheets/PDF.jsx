import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import {
  faArrowLeft,
  faCompress,
  faExpand,
  faFileExport,
  faMagnifyingGlassMinus,
  faMagnifyingGlassPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDevice } from "../../../../hooks";
import { floor, max } from "lodash";
import { useNavigate } from "react-router";

export const PDF = ({ children }) => {
  const navigate = useNavigate();
  const { currentScreenWidth, isMobile, isDevice } = useDevice();
  const [zoom, setZoom] = useState(100);
  const [zoomExpand, setZoomExpand] = useState(100);

  useEffect(() => {
    const maxSheetWidth = getMaxSheetWidth();

    if (maxSheetWidth) {
      const newZoom = floor((currentScreenWidth * 100) / maxSheetWidth) - 1;

      setZoom(newZoom);
      setZoomExpand(newZoom);
    }
  }, [currentScreenWidth]);

  useEffect(() => {
    document
      .getElementById("pdf-children")
      ?.style.setProperty("zoom", `${zoom}%`);
  }, [zoom]);

  const onGoBack = () => navigate(-1);

  const onZoomPlus = () => setZoom((zoom) => zoom + 5);

  const onZoomMinus = () => setZoom((zoom) => zoom - 5);

  const onCompress = () => setZoom(100);

  const onExpand = () => setZoom(zoomExpand);

  const onPrint = () => window.print();

  const hasStyleZoom = "zoom" in window.document.body.style;

  return (
    <Container>
      {!isMobile && (
        <Fixed left={0} top={0}>
          <Circle onClick={onGoBack}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </Circle>
        </Fixed>
      )}
      {isMobile && (
        <Fixed left={0} top={0}>
          <Circle onClick={() => onPrint()}>
            <FontAwesomeIcon icon={faFileExport} />
          </Circle>
        </Fixed>
      )}
      <Children id="pdf-children">{children}</Children>
      {!isDevice.mobile && (
        <Fixed left={0} bottom={0}>
          <Circle onClick={() => onPrint()}>
            <FontAwesomeIcon icon={faFileExport} />
          </Circle>
          <Circle
            onClick={() => (zoom > 100 ? onCompress() : onExpand())}
            aria-disabled={!hasStyleZoom}
          >
            <FontAwesomeIcon icon={zoom > 100 ? faCompress : faExpand} />
          </Circle>
          <Circle onClick={onZoomPlus} aria-disabled={!hasStyleZoom}>
            <FontAwesomeIcon icon={faMagnifyingGlassPlus} />
          </Circle>
          <Circle
            onClick={onZoomMinus}
            aria-disabled={!hasStyleZoom || zoom <= 100}
          >
            <FontAwesomeIcon icon={faMagnifyingGlassMinus} />
          </Circle>
        </Fixed>
      )}
    </Container>
  );
};

const getMaxSheetWidth = () => {
  const element = document.getElementById("pdf-children");

  const sheetsWidth = [];

  if (element) {
    for (let i = 0; element.children.length > i; i++) {
      sheetsWidth.push(element?.children[i]?.clientWidth);
    }

    return max(sheetsWidth);
  }
};

const Container = styled.section`
  margin: 0;
  padding: 0;
  background: rgb(81 86 89);
  display: block;
  width: 100%;
  height: auto;
  min-height: 100vh;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  overflow: auto;

  @media print {
    background: none;
    overflow: initial;
  }
`;

const Fixed = styled.div`
  ${({ top, bottom, left, right }) => css`
    top: ${top};
    bottom: ${bottom};
    left: ${left};
    right ${right};
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    position: fixed;
    z-index: 10000;

    @media print {
      display: none;
    }
  `}
`;

const Circle = styled.div`
  cursor: pointer;
  background: rgb(32, 33, 35);
  border-radius: 50%;
  padding: 0.4rem;
  margin: 0.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgb(219, 221, 224);
  font-size: 1rem;
  z-index: 10000;

  &[aria-disabled="true"] {
    opacity: 0.3;
    pointer-events: none;
  }
`;

const Children = styled.div`
  @media print {
    zoom: 100% !important;
  }
`;
