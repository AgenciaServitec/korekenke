import React, { useEffect, useState } from "react";
import { buckets } from "../firebase/storage";
import { ComponentContainer } from "./ui";
import AntdUpload from "antd/lib/upload";
import styled from "styled-components";
import { modalConfirm, notification } from "./ui";
import {
  deleteFileAndFileThumbFromStorage,
  uploadFile,
} from "./utils/upload/functions";
import {
  PreviewFile,
  UploadBody,
  UploadDraggerBody,
} from "./utils/upload/components";
import { isEmpty } from "lodash";
import { useLoadings } from "../hooks";

// type UploadValue = File[];
//
// interface File {
//   uid: string;
//   name: string;
//   url: string;
//   thumbUrl?: string;
// }
//
// interface Props {
//   accept?: string;
//   bucket?: BucketType;
//   buttonText?: string;
//   dragger?: boolean;
//   error?: FormError;
//   filePath: string;
//   fileName?: string;
//   isImage?: boolean;
//   label: string;
//   limit?: number;
//   required?: boolean;
//   resize?: ImageResize;
//   value?: UploadValue;
//   onUploading?: (uploading: boolean) => void;
//   onChange: (files?: UploadValue) => void;
//   keepFilesAfterUpload?: boolean;
// }

export const UploadMultiple = ({
  accept,
  bucket = "default",
  buttonText = "Subir imagen",
  dragger = true,
  error,
  filePath,
  fileName,
  isImage = true,
  label,
  required = false,
  resize = "300x400",
  value,
  onChange,
  onUploading,
  limit,
  keepFilesAfterUpload = true,
}) => {
  const storage = buckets[bucket];

  const [files, setFiles] = useState([]);
  const [uploadings, setUploadings] = useLoadings();
  const [currentFile, setCurrentFile] = useState(null);
  const [preventFirstEffect, setPreventFirstEffect] = useState(false);

  useEffect(() => {
    if (!value) return;

    setFiles(value.map((file) => ({ ...file, status: "done" })));
  }, [JSON.stringify(value)]);

  useEffect(() => {
    onUploading && onUploading(uploadings);
  }, [uploadings]);

  useEffect(() => {
    if (!preventFirstEffect) return setPreventFirstEffect(true);

    if (!keepFilesAfterUpload && isEmpty(files)) return;

    const uploadedFiles = files
      .filter((file) => file.status !== "done")
      .every((file) => file.status === "success");

    uploadedFiles && afterUpload();
  }, [JSON.stringify(files)]);

  const afterUpload = async () => {
    const newFiles = !isEmpty(files)
      ? files.map((file) => uploadFileToFile(file))
      : [];

    await onChange(newFiles);

    !keepFilesAfterUpload && setFiles([]);
  };

  const uploadFileToFile = ({ uid, name, url, thumbUrl }) => {
    if (!url) throw new Error("Missing url");

    return {
      uid,
      name,
      url,
      thumbUrl,
    };
  };

  const customRequest = async (requestOption) => {
    if (!(requestOption.file instanceof File))
      throw new Error("RequestOption.file not is File");

    try {
      setUploadings({ [requestOption.file.uid]: true });

      const { newFile, status } = await uploadFile({
        filePath,
        fileName,
        resize,
        storage,
        isImage,
        options: {
          file: requestOption.file,
          onError: (error) =>
            requestOption.onError && requestOption.onError(error),
          onProgress: (percent) =>
            requestOption.onProgress &&
            requestOption.onProgress({
              ...new ProgressEvent("load"),
              percent: percent,
            }),
          onSuccess: (message) =>
            requestOption.onSuccess &&
            requestOption.onSuccess(message, new XMLHttpRequest()),
        },
      });

      if (status) return addFileToFiles(newFile);

      await deleteFile(newFile);
    } catch (e) {
      uploadErrorMessage();
      console.error("Upload - custom request", e);
    } finally {
      setUploadings({ [requestOption.file.uid]: false });
    }
  };

  const uploadErrorMessage = () =>
    notification({
      type: "error",
      title: " Error uploading the file",
      description: "Try again!",
    });

  const addFileToFiles = (file) =>
    setFiles((prevFiles) => {
      const index = prevFiles.findIndex(
        (prevFile) => prevFile.uid === file.uid
      );

      const nextFiles = [...prevFiles];

      nextFiles[index] = file;

      return nextFiles;
    });

  const onChangeUpload = ({ file, fileList }) => {
    if (file.status === "done") return;

    setFiles(fileList);
  };

  const onPreview = (file) => setCurrentFile(file);

  const onRemove = async (file) =>
    new Promise((resolve) => {
      modalConfirm({
        content: "The image will be removed.",
        onOk: async () => {
          await deleteFile(file);
          resolve(true);
        },
      });
    });

  const deleteFile = async (file) => {
    await deleteFileAndFileThumbFromStorage(storage, filePath, file.name);

    setFiles((prevFiles) =>
      prevFiles.filter((prevFile) => prevFile.uid !== file.uid)
    );
  };

  return (
    <>
      <ComponentContainer.outlined
        required={required}
        error={error}
        label={label}
        animation
      >
        {dragger ? (
          <AntdUpload.Dragger
            fileList={files}
            multiple={true}
            listType="picture"
            accept={accept}
            customRequest={customRequest}
            onRemove={onRemove}
            onPreview={onPreview}
            onChange={onChangeUpload}
          >
            <UploadDraggerBody
              hint="Soportado para subir varias imágenes"
              text="Click aquí o arrastrar para subir las imágenes"
            />
          </AntdUpload.Dragger>
        ) : (
          <UploadStyled
            fileList={files}
            multiple={true}
            listType="picture"
            accept={accept}
            customRequest={customRequest}
            onRemove={onRemove}
            onPreview={onPreview}
            onChange={onChangeUpload}
          >
            <UploadBody
              visible={limit ? files.length < limit : true}
              buttonText={buttonText}
            />
          </UploadStyled>
        )}
      </ComponentContainer.outlined>
      {currentFile?.url && (
        <PreviewFile
          url={currentFile.url}
          thumbUrl={currentFile?.thumbUrl}
          isImage={isImage}
          onCancel={() => setCurrentFile(null)}
          visible={!!currentFile}
        />
      )}
    </>
  );
};

const UploadStyled = styled(AntdUpload)`
  cursor: pointer;

  .ant-upload.ant-upload-select {
    display: block;

    .ant-upload {
      button {
        text-align: left;
      }
    }
  }

  .ant-upload-list .ant-upload-list-item {
    margin: 7px 5px;
  }
`;
