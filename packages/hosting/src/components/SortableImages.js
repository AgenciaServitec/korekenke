import React from "react";
import { SortableItems } from "./SortableItems";
import styled, { css } from "styled-components";
import { isString } from "lodash";

// export interface SortableImagesProps
//   extends Pick<CSSProperties, "width" | "height"> {
//   images: Image[];
//   onChange: (images: Image[]) => void;
//   overlayItem?: (image: Image) => JSX.Element;
//   onRenderLastElement?: () => JSX.Element;
// }

export const SortableImages = ({
  images,
  onChange,
  height,
  overlayItem,
  width = "200px",
  onRenderLastElement,
}) => {
  const dataSource = [...images, onRenderLastElement ? "last" : ""].filter(
    (image) => image
  );

  return (
    <Container height={height} width={width}>
      <SortableItems
        dataSource={dataSource}
        fieldAsId={["uid"]}
        className="sortable-images"
        itemClassName="sortable-image"
        isDisabledLastElement={!!onRenderLastElement}
        renderItem={(image, index, options) =>
          isString(image) ? (
            <div {...options.disableDragProps} data-last="true">
              {onRenderLastElement && onRenderLastElement()}
            </div>
          ) : (
            <ImageContainer>
              <img src={image.thumbUrl} alt={image.name} />
              {overlayItem && (
                <div {...options.disableDragProps} className="image-overlay">
                  {overlayItem(image)}
                </div>
              )}
            </ImageContainer>
          )
        }
        onChange={(items) =>
          onChange(
            items.reduce((images, image) => {
              !isString(image) && images.push(image);

              return images;
            }, [])
          )
        }
      />
    </Container>
  );
};

// type ContainerProps = Pick<CSSProperties, "width" | "height">;

const Container = styled.div`
  ${({ theme, width, height }) => css`
    .sortable-images {
      display: grid;
      grid-gap: ${theme.paddings.large};
      grid-template-columns: repeat(auto-fill, ${width});
      justify-content: space-around;
    }

    .sortable-image {
      width: 100%;
      height: ${height};
    }
  `}
`;

const ImageContainer = styled.div`
  ${({ theme }) => css`
    width: 100%;
    height: 100%;

    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: ${theme.border_radius.large};
    }

    .image-overlay {
      display: inline-flex;
      justify-content: flex-end;
      position: absolute;
      bottom: 0;
      background: rgba(0, 0, 0, 0.4);
      width: 100%;
      transition: 0.5s ease;
      opacity: 0;
      color: white;
      font-size: ${theme.font_sizes.small};
      padding: ${theme.border_radius.x_small};
      text-align: center;
      border-bottom-left-radius: ${theme.border_radius.large};
      border-bottom-right-radius: ${theme.border_radius.large};
    }

    &:hover .image-overlay {
      opacity: 1;
    }
  `}
`;
