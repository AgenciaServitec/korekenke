import React, { useTransition } from "react";
import { dasRequestsRef } from "../../firebase/collections";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { assign, chunk } from "lodash";
import { firestore } from "../../firebase";
import { notification } from "../../components";
import { Button } from "antd";
import { getSearchDataToDasRequest } from "../../utils";

export const Scripts = () => {
  // const [isPending, startTransition] = useTransition();
  //
  // const [dasRequests, dasRequestsLoading, dasRequestError] = useCollectionData(
  //   dasRequestsRef.where("isDeleted", "==", false),
  // );

  return <></>;
};

// const RunAddSearchDataScript = ({
//   dasRequests,
//   isPending,
//   startTransition,
// }) => {
//   // SCRIPT PARA searchData in all products
//
//   const runScript = async () => {
//     startTransition(async () => {
//       try {
//         const batches = chunk(dasRequests, 490).map((dasRequests) => {
//           const batch = firestore.batch();
//
//           dasRequests.forEach((dasRequest) => {
//             batch.update(
//               dasRequestsRef.doc(dasRequest.id),
//               mapDasRequests(dasRequest),
//             );
//           });
//
//           return batch.commit();
//         });
//
//         await Promise.all(batches);
//
//         console.log("COMPLETE SUCCESSFULL!");
//       } catch (e) {
//         notification({ type: "error" });
//         console.log("setDataToFirestore: ", e);
//       }
//     });
//   };
//
//   const mapDasRequests = (dasRequest) =>
//     assign({}, dasRequest, {
//       searchData: getSearchDataToDasRequest(
//         [
//           dasRequest.headline.phone.number,
//           dasRequest.headline.cip,
//           dasRequest.headline.email,
//           dasRequest.headline.paternalSurname,
//           dasRequest.headline.maternalSurname,
//         ],
//         dasRequest.headline.firstName,
//       ),
//     });
//
//   return (
//     <div>
//       <Button type="primary" loading={isPending} onClick={() => runScript()}>
//         RUN ADD SEARCH DATA - SCRIPT
//       </Button>
//     </div>
//   );
// };

// const RunAddNameIdScript = () => {
//   // SCRIPT PARA AGREGAR nameId
//   const { categories } = useGlobalData();
//
//   const [loading, setLoading] = useState(false);
//
//   const runScript = async () => {
//     try {
//       setLoading(true);
//
//       const result = categories.map(async (category) => {
//         const category_ = mapCategory(category);
//
//         console.log(category_);
//
//         await firestore
//           .collection("brands")
//           .doc(category.id)
//           .set(category_, { merge: false });
//       });
//
//       console.log("result->", result.length);
//
//       console.log("COMPLETE SUCCESSFULL!");
//     } catch (e) {
//       notification({ type: "error" });
//       console.log("setDataToFirestore: ", e);
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   const mapCategory = (category) =>
//     assign({}, category, {
//       nameId: getNameId(category.name),
//     });
//
//   return (
//     <div>
//       <Button type="primary" loading={loading} onClick={() => runScript()}>
//         RUN ADD NAME ID - SCRIPT
//       </Button>
//     </div>
//   );
// };

// const FourScriptGetMetadatosProductsImagesAndFirestoreDB = () => {
//   // SCRIPT: OBTIENE METADATOS DE IMAGENES, SE ARMA LAS URLS DE LAS IMAGENES Y SE ACTUALIZA FIRESTORE
//   const { products } = useGlobalData();
//
//   const [loading, setLoading] = useState(false);
//
//   const productsView = products.filter((product) => !product.isDeleted);
//
//   const runScript = async () => {
//     try {
//       setLoading(true);
//
//
//       const getListFiles = async (index, productId) => {
//         const bucketName = "vida-organic-stores-dev-photos";
//
//         const storageRef = firebase
//           .storage()
//           .refFromURL(`gs://${bucketName}/${productId}`);
//
//         const result = await storageRef.listAll();
//
//         const imagesPromises = result.items.map((itemRef) =>
//           itemRef.getMetadata().then((metadata) => metadata)
//         );
//
//         const imagesDataResults = await Promise.all(imagesPromises);
//
//         const images = imagesDataResults.map((imagesData) => {
//           //URL => https://firebasestorage.googleapis.com/v0/b/vida-organic-stores-dev-photos/o/3C60ffK8T5hA0CILrNTh%2Fb0360fb0-027b-11ee-96db-97469c9306a2?alt=media
//           //THUMB URL => https://firebasestorage.googleapis.com/v0/b/vida-organic-stores-dev-photos/o/3C60ffK8T5hA0CILrNTh%2Fthumbs%2Fb0360fb0-027b-11ee-96db-97469c9306a2_1000x1000?alt=media
//
//           const urlBase = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o`;
//
//           const { name } = imagesData;
//
//           const url = `${urlBase}/${productId}%2F${name}?alt=media`;
//           const thumbUrl = `${urlBase}/${productId}%2Fthumbs%2F${name}_1000x1000?alt=media`;
//
//           return {
//             id: productId,
//             name,
//             url,
//             thumbUrl,
//           };
//         });
//
//         return {
//           id: productId,
//           images: mapFirestoreData(images),
//         };
//       };
//
//       const mapFirestoreData = (images = []) =>
//         images.map((image) => ({
//           name: image.name,
//           uid: image.name,
//           url: image.url,
//           thumbUrl: image.thumbUrl,
//         }));
//
//       const mapProduct = (oldProduct, newProduct) =>
//         assign({}, oldProduct, {
//           productContent: {
//             ...oldProduct.productContent,
//             ...(!isEmpty(newProduct.images) && { photos: newProduct.images }),
//           },
//         });
//
//
//
//       const imagesRecoveryDataPromises = await productsView.map(
//         async (product, index) => await getListFiles(index + 1, product.id)
//       );
//
//       const productImagesRecoveryData = await Promise.all(
//         imagesRecoveryDataPromises
//       );
//
//       productImagesRecoveryData.map(async (newProduct) => {
//         const oldProduct = productsView.find(
//           (product_) => product_.id === newProduct.id
//         );
//
//         const currentProduct = mapProduct(oldProduct, newProduct);
//
//         console.log("currentProduct->", currentProduct);
//
//         await firestore
//           .collection("products")
//           .doc(currentProduct.id)
//           .update(currentProduct);
//       });
//
//       console.log("COMPLETE SUCCESSFULL!");
//     } catch (e) {
//       notification({ type: "error" });
//       console.log("setDataToFirestore: ", e);
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   return (
//     <div>
//       <Button type="primary" loading={loading} onClick={() => runScript()}>
//         FourScript RUN
//       </Button>
//     </div>
//   );
// };

// const OneScript = () => {
//   // SCRIPT PARA AGREGAR principalCategoryId Y categoryId
//   const { principalCategories, categories, subCategories, brands, products } =
//     useGlobalData();
//
//   const [loading, setLoading] = useState(false);
//
//   const runScript = async () => {
//     try {
//       setLoading(true);
//
//       const productsWithSubCategory = products.filter(
//         (product) => product?.productContent?.productSetup?.subCategoryId
//       );
//
//       const result = productsWithSubCategory.map(async (product_) => {
//         const { principalCategory, category } =
//           getAllCategoriesAndBrandByProduct(
//             product_.productContent.productSetup,
//             principalCategories,
//             categories,
//             subCategories,
//             brands
//           );
//
//         const currentProduct = mapProduct(
//           product_,
//           principalCategory,
//           category
//         );
//
//         await firestore
//           .collection("products")
//           .doc(currentProduct.id)
//           .set(currentProduct, { merge: false });
//       });
//
//       console.log("result->", result.length);
//
//       console.log("COMPLETE SUCCESSFULL!");
//     } catch (e) {
//       notification({ type: "error" });
//       console.log("setDataToFirestore: ", e);
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   const mapProduct = (product, principalCategory, category) =>
//     assign({}, product, {
//       productContent: {
//         photos: product.productContent.productSetup.photos,
//         productSetup: {
//           ...product.productContent.productSetup,
//           principalCategoryId: principalCategory?.id || null,
//           categoryId: category?.id || null,
//         },
//       },
//     });
//
//   return (
//     <div>
//       <Button type="primary" loading={loading} onClick={() => runScript()}>
//         OneScript RUN
//       </Button>
//     </div>
//   );
// };
