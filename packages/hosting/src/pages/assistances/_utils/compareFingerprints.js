const decodeTemplate = (template) => {
  const base64 = template.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(
    base64.length + ((4 - (base64.length % 4)) % 4),
    "=",
  );
  const binaryStr = atob(padded);
  const bytes = new Uint8Array(binaryStr.length);

  for (let i = 0; i < binaryStr.length; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }

  return bytes;
};

const cosineSimilarity = (a, b) => {
  if (a.length !== b.length) {
    throw new Error("Los templates deben tener la misma longitud");
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] ** 2;
    normB += b[i] ** 2;
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

export const compareFingerprint = (template1, template2) => {
  const bytes1 = decodeTemplate(template1);
  const bytes2 = decodeTemplate(template2);

  const similarity = cosineSimilarity(bytes1, bytes2);

  return similarity >= 0.7;
};
