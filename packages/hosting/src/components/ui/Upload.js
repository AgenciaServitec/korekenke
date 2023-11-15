// import React, { forwardRef, useEffect, useState } from "react";
// import { Button, Modal as ModalAntd, Upload as AntUpload } from "antd";
// import { defaultTo, get, isEmpty } from "lodash";
// import { mediaQuery } from "../../styles";
// import { timeoutPromise } from "../../utils";
// import { v4 as uuidv4 } from "uuid";
// import styled from "styled-components";
// import { buckets, storage as storageDefault } from "../../firebase";
// import {
//   LoadingOutlined,
//   UploadOutlined,
//   VerticalAlignBottomOutlined,
// } from "@ant-design/icons";
// import Row from "antd/lib/row";
// import Col from "antd/lib/col";
//
// const buckets_ = {
//   animes: buckets.animesStorageBucket,
// };
//
// const Upload = (props, ref) => {
//   const storage = get(buckets_, props.bucket, storageDefault);
//
//   const [isUploading, setIsUploading] = useState(false);
//   const [previewVisible, setPreviewVisible] = useState(false);
//   const [isErrorUpload, setIsErrorUpload] = useState(false);
//   const [files, setFiles] = useState([]);
//   const [fileUrl, setFileUrl] = useState(null);
//   const [fileUrlThumb, setFileUrlThumb] = useState(null);
//
//   useEffect(() => {
//     const _fileUrl = get(
//       props.document,
//       `${props.name}Images.${props.name}`,
//       null
//     );
//
//     let _fileUrlThumb = null;
//
//     if (props.isImage) {
//       _fileUrlThumb = get(
//         props.document,
//         `${props.name}Images.${props.name}Thumb`,
//         null
//       );
//     }
//
//     console.log("_fileUrlThumb->", _fileUrlThumb);
//
//     if (!_fileUrl || (props.isImage && !_fileUrlThumb)) return;
//
//     setFiles([
//       {
//         name: props.fileName,
//         thumbUrl: _fileUrl,
//         uid: uuidv4(),
//       },
//     ]);
//
//     setFileUrl(_fileUrl);
//     setFileUrlThumb(_fileUrlThumb);
//   }, [props.document]);
//
//   const uploadFile = async (file) => {
//     const fileSuffix = file.name.split(".").pop();
//
//     _setIsUploading(true);
//     setIsErrorUpload(false);
//
//     console.log("file", `${props.filePath}/${props.fileName}.${fileSuffix}`);
//
//     const uploadTask = storage
//       .ref(`${props.filePath}/${props.fileName}.${fileSuffix}`)
//       .put(file);
//
//     uploadTask.on(
//       "state_changed",
//       (snapshot) => {
//         const progress = Math.round(
//           (snapshot.bytesTransferred / snapshot.totalBytes) * 100
//         );
//         console.log("Progress", progress);
//       },
//       (error) => {
//         console.log("Error uploading", error);
//         setIsErrorUpload(true);
//         setFiles([]);
//
//         _setIsUploading(false);
//       },
//       async () => {
//         try {
//           const _fileUrl = await storage
//             .ref(props.filePath)
//             .child(`${props.fileName}.${fileSuffix}`)
//             .getDownloadURL();
//           console.log("_fileUrl->", _fileUrl);
//           let _fileUrlThumb = null;
//
//           if (props.isImage) {
//             const sizeResized = defaultTo(props.sizeResized, "400x500");
//
//             const fileUrlThumbRef = await storage
//               .ref(`${props.filePath}/thumbs`)
//               .child(`${props.fileName}_${sizeResized}.${fileSuffix}`);
//
//             _fileUrlThumb = await keepTryingGetThumbURL(10, fileUrlThumbRef);
//           }
//
//           setFileUrl(_fileUrl);
//           setFileUrlThumb(_fileUrlThumb);
//
//           // When using useState use this props.setImageUrlToDocument
//           props.setImageUrlToDocument &&
//             props.setImageUrlToDocument(
//               _fileUrl,
//               _fileUrlThumb,
//               get(props, "document.id", null)
//             );
//
//           if (props.afterUpload) {
//             const imagesObject = {};
//
//             imagesObject[`${props.fileName}Images`] = {
//               [`${props.name}Thumb`]: _fileUrlThumb,
//               [`${props.name}`]: _fileUrl,
//             };
//
//             await props.afterUpload({ ...imagesObject });
//           }
//         } catch (error) {
//           setIsErrorUpload(true);
//           setFiles([]);
//           console.log("Error: ", error);
//         } finally {
//           _setIsUploading(false);
//         }
//       }
//     );
//   };
//
//   const keepTryingGetThumbURL = async (triesCount, storageRef) => {
//     console.log("Getting thumb download URL...");
//
//     if (triesCount < 0) {
//       return Promise.reject("out of tries");
//     }
//
//     try {
//       return await storageRef.getDownloadURL();
//     } catch (error) {
//       if (error.code === "storage/object-not-found") {
//         await timeoutPromise(1000);
//         return keepTryingGetThumbURL(triesCount - 1, storageRef);
//       } else {
//         console.log(error);
//         return Promise.reject(error);
//       }
//     }
//   };
//
//   const _setIsUploading = (value) => {
//     setIsUploading(value);
//     props.statusUploading && props.statusUploading(value);
//   };
//
//   const onRemove = () => {
//     setFileUrl("");
//     setFileUrlThumb("");
//     //When using useState use this props.setImageUrlToDocument
//     // props.setImageUrlToDocument && props.setImageUrlToDocument("", "", props.document.id);
//     props.setImageUrlToDocument &&
//       props.setImageUrlToDocument("", "", get(props, "document.id", null));
//   };
//
//   const onChange = (info) => {
//     const uploadFileList = [...info.fileList];
//
//     setFiles(uploadFileList.slice(-1));
//   };
//
//   return (
//     <React.Fragment>
//       <Container>
//         {props.label && <Label required={props.required}>{props.label}</Label>}
//         <StyledUpload
//           styled={props.styled}
//           listType={get(props, "listType", "picture")}
//           accept={get(props, "accept", "*")}
//           action={uploadFile}
//           onChange={onChange}
//           onPreview={() => setPreviewVisible(true)}
//           fileList={files}
//           onRemove={onRemove}
//         >
//           {isEmpty(files) && (
//             <Row>
//               <Col span={24}>{props.icon !== false && <UploadOutlined />}</Col>
//               <Col span={24}>{props.textUpload}</Col>
//             </Row>
//           )}
//         </StyledUpload>
//
//         <input type="hidden" ref={ref} name={props.name} value={fileUrl} />
//         {props.isImage && (
//           <input
//             type="hidden"
//             ref={ref}
//             name={`${props.name}Thumb`}
//             value={fileUrlThumb}
//           />
//         )}
//         {isUploading && (
//           <UploadingImage>
//             <LoadingOutlined /> Subiendo imagen ...
//           </UploadingImage>
//         )}
//         {isErrorUpload && (
//           <UploadError>
//             Error al subir la imagen!. Inténtelo de nuevo.
//           </UploadError>
//         )}
//         {get(props.errors, props.name, false) && (
//           <Error>{get(props.errors, `${props.name}.message`, "")}</Error>
//         )}
//       </Container>
//       {previewVisible && (
//         <Modal
//           footer={null}
//           onCancel={() => setPreviewVisible(false)}
//           visible={previewVisible}
//         >
//           <br />
//           {props.isImage ? (
//             <ModalImage src={fileUrlThumb} alt="thumbImage" />
//           ) : (
//             "Solo se puede visualizar las imagenes subidas"
//           )}
//           {props.download !== false && (
//             <Button
//               key="download"
//               width="150px"
//               onClick={() => {
//                 console.log("fileUrl", fileUrlThumb);
//                 window.open(fileUrlThumb, "_blank");
//               }}
//             >
//               <VerticalAlignBottomOutlined />
//               Descargar imagen
//             </Button>
//           )}
//         </Modal>
//       )}
//     </React.Fragment>
//   );
// };
//
// export default forwardRef(Upload);
//
// const Modal = styled(ModalAntd)`
//   top: 50px !important;
//
//   ${mediaQuery.minTablet} {
//     top: 0 !important;
//   }
//
//   .ant-modal-content {
//     .ant-modal-body {
//       color: ${(props) => props.theme.body};
//     }
//   }
// `;
//
// const ModalImage = styled.img`
//   width: 100%;
//   margin: 1.5rem auto;
// `;
//
// const Container = styled.div`
//   //margin: 1rem 0;
//   text-align: center;
//   .ant-upload-list-picture .ant-upload-list-item-thumbnail img,
//   .ant-upload-list-picture-card .ant-upload-list-item-thumbnail img {
//     object-fit: cover;
//     width: 100%;
//     height: 100%;
//   }
// `;
//
// const UploadError = styled.div`
//   color: red;
//   margin: 5px 0;
//   font-size: 15px;
// `;
//
// const UploadingImage = styled.div`
//   color: #fff;
//   background: #444;
//   font-size: 12px;
//   margin-top: 10px;
//
//   i {
//     font-size: 15px !important;
//     margin-right: 5px !important;
//   }
// `;
//
// const StyledUpload = styled(AntUpload)`
//   .ant-upload-list {
//     background: initial;
//     margin: 0 auto;
//     width: ${(props) => get(props.styled, "width", "initial")};
//     min-width: ${(props) => get(props.styled, "minWidth", "initial")};
//   }
//
//   .ant-upload-list-picture {
//     .ant-upload-list-item {
//       border: 1px solid #444;
//       color: ${(props) => props.theme.body};
//     }
//   }
//
//   .ant-upload-picture-card-wrapper {
//     ${(props) =>
//       props.listType === "picture-card" &&
//       `
//             width: initial !important;
//         `}
//   }
//
//   .ant-upload-list-item-name {
//     cursor: pointer;
//     color: ${(props) => props.theme.body} !important;
//     font: 0/0 a;
//
//     ::before {
//       ${(props) =>
//         props.listType === "picture" &&
//         `display: inline-block;
//                 margin-right: 4px;
//                 color: ${props.theme.body};
//                 font-size: 14px;
//                 line-height: 1;
//                 content: "Imagen";
//                 `}
//     }
//   }
//
//   .ant-upload-list-item-card-actions {
//     padding-right: 1rem;
//
//     svg {
//       color: red;
//     }
//
//     i {
//       padding-right: 0px !important;
//       color: rgba(0, 0, 0, 0.45);
//     }
//   }
//   .ant-upload-list-item-error {
//     color: ${(props) => (props.isErrorUpload ? "red" : props.theme.body)};
//     border-color: ${(props) =>
//       props.isErrorUpload ? "red" : props.theme.body};
//   }
//
//   .ant-upload-list-item-info {
//     ::before {
//       position: initial;
//       z-index: initial;
//       width: initial;
//       height: initial;
//       background-color: initial;
//       opacity: initial;
//       -webkit-transition: all 0.3s;
//       transition: all 0.3s;
//       content: "";
//     }
//
//     span {
//       ${(props) =>
//         props.listType === "picture" &&
//         `       display: flex;
//                 justify-content: center;
//                 align-items: center;
//             `}
//     }
//   }
// `;
//
// const Label = styled.label`
//   display: block;
//   margin-bottom: 0.5rem;
//   font-size: 15px;
//
//   ${(props) =>
//     props.required &&
//     `
//     ::before {
//         display: inline-block;
//         margin-right: 4px;
//         color: #f5222d;
//         font-size: 14px;
//         line-height: 1;
//         content: "*";
//     }
//   `}
// `;
//
// const Error = styled.p`
//   font-size: 12px;
//   color: red;
// `;
