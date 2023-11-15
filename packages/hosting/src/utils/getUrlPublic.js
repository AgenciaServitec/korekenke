import { currentConfig } from "../config";

// type SizeType = "x_small" | "small" | "medium";

export const getUrlPublic = (id, name, sizeType) => {
  const size = {
    small: "250x250",
    medium: "700x700",
    large: "1000x1000",
  };

  // https://storage.googleapis.com/vida-organic-stores-dev-photos/2q8NbJSLkKCfAgHgnB1m/thumbs/cargo%20caratula_300x400.png
  // https://storage.googleapis.com/vida-organic-stores-dev-photos/2q8NbJSLkKCfAgHgnB1m/thumbs/MAS
  return `${currentConfig.publicStorageUrl}/${id}/thumbs/${name}_${size[sizeType]}`;
};
