import React, { useState } from "react";
import { buckets } from "../firebase/storage";
import styled, { css } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  deleteFileAndFileThumbFromStorage,
  keepTryingGetThumbURL,
} from "./utils/upload/functions";
import { isString } from "lodash";
import { v1 as uuidv1 } from "uuid";
import { SortableImages } from "./SortableImages";
import { IconAction, modalConfirm, Spin } from "./ui";
import { faTrash, faUpload } from "@fortawesome/free-solid-svg-icons";
import { darken } from "polished";

// export interface UploadImagesProps {
//   onUploading?: (uploading: boolean) => void;
//   bucketType?: BucketType;
//   path: string;
//   images: Image[];
//   onChange: (images: Image[]) => Promise<void>;
//   imageResize?: ImageResize;
// }

export const UploadImages = ({
  images,
  onChange,
  bucketType = "default",
  imageResize = "1000x1000",
  path,
  onUploading,
}) => {
  const firebaseStorage = buckets[bucketType];

  const [uploading, setUploading] = useState(false);

  const onDragOver = (event) => event.preventDefault();

  const onDrop = async (event) => {
    event.preventDefault();

    await uploadFiles(event.dataTransfer.files);
  };

  const onInputChange = async (event) => {
    event.target.files && (await uploadFiles(event.target.files));
  };

  const uploadFiles = async (fileList) => {
    try {
      setUploading(true);
      onUploading && onUploading(true);

      const filesResult = await Promise.allSettled(
        Object.values(fileList).map(async (file) => uploadFile(file)),
      );

      await onChange([...images, ...getImages(filesResult)]);
    } catch (e) {
      console.error("filesResult", e);
    } finally {
      console.warn("FINISH");
      setUploading(false);
      onUploading && onUploading(false);
    }
  };

  const uploadFile = async (file) =>
    new Promise((resolve, reject) => {
      const uid = uuidv1();

      // const [name] = file.name.split(".");
      const name = uid;

      const filename = `${name}`;
      const filenameThumb = `${name}_${imageResize}`;

      const storageFileRef = firebaseStorage.ref(path).child(filename);
      const storageFileThumbRef = firebaseStorage
        .ref(path + "/thumbs")
        .child(filenameThumb);

      storageFileRef.put(file).on(
        "state_changed",
        ({ bytesTransferred, totalBytes }) =>
          console.log((bytesTransferred / totalBytes) * 95),
        (error) => reject(error),
        async () => {
          try {
            const url = await storageFileRef.getDownloadURL();

            const thumbUrl = await keepTryingGetThumbURL(storageFileThumbRef);

            if (!isString(thumbUrl))
              return new Error(`ThumbUrl is not string: ${thumbUrl}`);

            resolve({ url, thumbUrl, uid, name });
          } catch (e) {
            await deleteFileAndFileThumbFromStorage(
              firebaseStorage,
              path,
              filename,
            );
            reject(e);
          }
        },
      );
    });

  const deleteImage = async (image) => {
    modalConfirm({
      content: "The image will be removed.",
      onOk: async () => {
        await deleteFileAndFileThumbFromStorage(
          firebaseStorage,
          path,
          image.name,
        );

        await onChange(images.filter((_image) => _image.uid !== image.uid));
      },
    });
  };

  return (
    <div>
      <SortableImages
        images={images}
        onChange={onChange}
        height="200px"
        width="200px"
        onRenderLastElement={() => (
          <Spin spinning={uploading}>
            <DragAndDrop onDragOver={onDragOver} onDrop={onDrop}>
              <input
                type="file"
                multiple
                id="upload-input-file"
                onChange={onInputChange}
              />
              <label className="upload-body" htmlFor="upload-input-file">
                <FontAwesomeIcon icon={faUpload} size="2x" />
                <span className="upload-body-title">
                  Haga clic o arrastre el archivo a esta área para cargarlo
                </span>
                <span className="upload-body-description">
                  Soporte para una carga única o masiva
                </span>
              </label>
            </DragAndDrop>
          </Spin>
        )}
        overlayItem={(image) => (
          <>
            <IconAction
              onClick={() => deleteImage(image)}
              size={25}
              icon={faTrash}
              styled={{
                color: () => "rgb(241, 13, 13)",
              }}
            />
          </>
        )}
      />
    </div>
  );
};

const getImages = (filesResult) =>
  filesResult.reduce((images, fileResult) => {
    if (fileResult.status === "fulfilled") {
      images.push(fileResult.value);
    }

    return images;
  }, []);

const DragAndDrop = styled.div`
  ${({ theme }) => css`
    width: 200px;
    height: 200px;
    background: ${darken(0.01, theme.colors.white)};
    border-radius: ${theme.border_radius.medium};
    position: relative;
    text-align: center;
    border: 1px dashed #d9d9d9;
    transition: border-color 0.3s;
    padding: ${theme.paddings.large};
    margin-bottom: ${theme.paddings.medium};

    &:hover {
      border: 1px dashed ${theme.colors.font2};
    }

    #upload-input-file {
      display: none;
    }

    .upload-body {
      display: flex;
      gap: ${theme.paddings.small};
      flex-direction: column;
      justify-content: center;
      cursor: pointer;
      width: 100%;
      height: 100%;

      .upload-body-title {
        font-size: ${theme.font_sizes.medium};
        font-weight: ${theme.font_weight.medium};
        white-space: pre-wrap;
        line-height: 1.2em;
      }

      .upload-body-description {
        font-size: ${theme.font_sizes.small};
        white-space: pre-wrap;
        line-height: 1.2em;
      }
    }
  `}
`;
