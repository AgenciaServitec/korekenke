import React, { useEffect, useState } from "react";
import { buckets } from "../firebase/storage";
import { ComponentContainer, modalConfirm, notification } from "./index";
import AntdUpload from "antd/lib/upload";
import styled from "styled-components";
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
import AntdMessage from "antd/lib/message";
import * as assert from "assert";

export const Upload = ({
  accept,
  bucket = "default",
  buttonText = "Upload image",
  dragger = true,
  hidden,
  name,
  error = false,
  helperText,
  filePath,
  fileName,
  isImage = true,
  withThumbImage = true,
  label,
  required = false,
  resize = "1480x2508",
  additionalFields = null,
  value,
  onUploading,
  onChange,
  onChangeCopy,
  copyFilesTo = null,
}) => {
  const storage = buckets[bucket];

  const [files, setFiles] = useState([]);
  const [filesCopy, setFilesCopy] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);

  useEffect(() => {
    if (!value || typeof value !== "object") return;

    setFiles([{ ...value, status: "done" }]);
  }, [JSON.stringify(value)]);

  useEffect(() => {
    onUploading && onUploading(uploading);
  }, [uploading]);

  useEffect(() => {
    const filesDone = files.every((file) => file.status === "success");

    filesDone &&
      onChange(!isEmpty(files) ? uploadFileToFile(files[0]) : undefined);
  }, [JSON.stringify(files)]);

  useEffect(() => {
    if (!copyFilesTo || !onChangeCopy) return;

    const filesDone2 = filesCopy.every((file) => file.status === "success");

    filesDone2 &&
      onChangeCopy(
        !isEmpty(filesCopy) ? uploadFileToFile(filesCopy[0]) : undefined,
      );
  }, [JSON.stringify(filesCopy)]);

  const uploadFileToFile = ({ uid, name, url, thumbUrl }) => {
    assert(url, "Missing url");

    const file = {
      ...additionalFields,
      uid,
      name,
      url,
    };

    if (isImage) {
      file.thumbUrl = thumbUrl;
    }

    return file;
  };

  const customRequest = async (requestOption) => {
    try {
      setUploading(true);

      const fileType = requestOption?.file?.type.split("/")[0];

      if (isImage && fileType !== "image") {
        setUploading(false);
        requestOption.onError(true);
        return notification({
          type: "warning",
          title: "Debe subir una imagen",
        });
      }

      const { newFile, status } = await uploadFile({
        filePath,
        fileName,
        resize,
        storage,
        isImage,
        withThumbImage,
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

      if (copyFilesTo) {
        const { newFile, status } = await uploadFile({
          ...copyFilesTo,
          storage: buckets[copyFilesTo.bucket],
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

        status
          ? addFileToFilesCopy(newFile)
          : await deleteFileCopy(newFile, copyFilesTo);
      }

      if (status) return addFileToFiles(newFile);
      await deleteFile(newFile);
    } catch (e) {
      uploadErrorMessage();
      console.error("Upload - custom request", e);
    } finally {
      setUploading(false);
    }
  };

  const uploadErrorMessage = () =>
    notification({
      type: "error",
      title: "Error al cargar el archivo",
      description: "¡Intentar otra vez!",
    });

  const addFileToFiles = (file) =>
    setFiles((prevFiles) => {
      const index = prevFiles.findIndex(
        (prevFile) => prevFile.uid === file.uid,
      );

      const nextFiles = [...prevFiles];

      nextFiles[index] = file;

      return nextFiles;
    });

  const addFileToFilesCopy = (fileCopy) => {
    setFilesCopy((prevFilesCopy) => {
      const index = prevFilesCopy.findIndex(
        (prevFileCopy) => prevFileCopy?.uid === fileCopy?.uid,
      );

      const nextFilesCopy = [...prevFilesCopy];

      nextFilesCopy[index <= 0 ? 0 : index] = fileCopy;

      return nextFilesCopy;
    });
  };

  const onChangeUpload = ({ file, fileList }) => {
    if (file.status === "done") return;

    setFiles(fileList);
  };

  const onPreview = (file) => setCurrentFile(file);

  const onRemove = async (file) =>
    new Promise((resolve) => {
      modalConfirm({
        content: "La imagen será eliminada.",
        onOk: async () => {
          await deleteFile(file);
          resolve(true);
        },
      });
    });

  const deleteFile = async (file) => {
    await deleteFileAndFileThumbFromStorage(storage, filePath, file.name);

    setFiles((prevFiles) =>
      prevFiles.filter((prevFile) => prevFile.uid !== file.uid),
    );
  };

  const deleteFileCopy = async (file, copyFilesTo) => {
    await deleteFileAndFileThumbFromStorage(
      copyFilesTo.storage,
      copyFilesTo.filePath,
      file.name,
    );

    setFilesCopy((prevFiles) =>
      prevFiles.filter((prevFile) => prevFile.uid !== file.uid),
    );
  };

  const beforeUpload = () => {
    if (isEmpty(files)) return true;

    AntdMessage.error(
      `¡Elimine el archivo actual antes de cargar un archivo nuevo!`,
    );

    return AntdUpload.LIST_IGNORE;
  };

  return (
    <>
      <ComponentContainer.filled
        animation={false}
        required={required}
        hidden={hidden}
        error={error}
        helperText={helperText}
        label={label}
      >
        <WrapperComponents>
          {dragger ? (
            <AntdUpload.Dragger
              name={name}
              fileList={files}
              listType="picture"
              accept={accept}
              customRequest={customRequest}
              onRemove={onRemove}
              onPreview={onPreview}
              onChange={onChangeUpload}
              beforeUpload={beforeUpload}
            >
              <UploadDraggerBody
                hint="Soportado para cargar solo un archivo"
                text="Haga clic aquí o arrastre para cargar el archivo"
              />
            </AntdUpload.Dragger>
          ) : (
            <UploadStyled
              name={name}
              fileList={files}
              listType="picture"
              accept={accept}
              customRequest={customRequest}
              onRemove={onRemove}
              onPreview={onPreview}
              onChange={onChangeUpload}
              beforeUpload={beforeUpload}
            >
              <UploadBody visible={isEmpty(files)} buttonText={buttonText} />
            </UploadStyled>
          )}
        </WrapperComponents>
      </ComponentContainer.filled>
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

const WrapperComponents = styled.div`
  margin: 11px;
`;
