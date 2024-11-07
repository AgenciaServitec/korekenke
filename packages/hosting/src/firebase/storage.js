import { firebase, storage } from "./index";
import { currentConfig } from "../config";

// export type FirebaseStorage = firebase.storage.Storage;
// export type FirebaseStorageReference = firebase.storage.Reference;
// export type FirebaseStorageError = firebase.storage.FirebaseStorageError;
//
// export type BucketType = "default" | "photos";
// export type ImageResize = "100x50" | "200x150" | "700x450";

// type Buckets = Record<BucketType, FirebaseStorage>;

export const buckets = {
  default: storage,
  documents: firebase.app().storage(currentConfig.buckets.documents),
  servicioDeVeterinariaYRemontaDelEjercito: firebase
    .app()
    .storage(currentConfig.buckets.servicioDeVeterinariaYRemontaDelEjercito),
  departamentoDeApoyoSocial: firebase
    .app()
    .storage(currentConfig.buckets.departamentoDeApoyoSocial),
  militaryServiceRecruitment: firebase
    .app()
    .storage(currentConfig.buckets.militaryServiceRecruitment),
};

export const imageResizes = ["423x304", "313x370"];
